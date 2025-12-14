#include <unistd.h>
#include <cstring>
#include <cstdio>
#include <iostream>
#include <string>
#include <vector>
#include <sys/socket.h>
#include <netdb.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <arpa/inet.h>
#include <fcntl.h>
#include <errno.h>
#include <sys/select.h>
#include <sstream>

#include "load_balancer.h"   // must come first (defines Backend)
#include "backend.h"         // declares handle_client
#include "logger.h"
#include "metrics.h"

// Helper: Send all data, handling partial writes
// Returns true on success, false on error
static bool send_all(int fd, const void *data, size_t len) {
    const char *buf = static_cast<const char*>(data);
    size_t sent = 0;

    while (sent < len) {
        ssize_t n = send(fd, buf + sent, len - sent, MSG_NOSIGNAL);
        
        if (n < 0) {
            // Retry on interrupt, fail on other errors
            if (errno == EINTR) {
                continue;
            }
            // For non-blocking sockets, EAGAIN/EWOULDBLOCK means we'd block
            // In our blocking context, this is an error
            if (errno == EAGAIN || errno == EWOULDBLOCK) {
                // Could implement a timeout/retry here, but for now treat as error
                return false;
            }
            return false;
        }
        
        if (n == 0) {
            // Socket closed by peer
            return false;
        }
        
        sent += n;
    }
    
    return true;
}

// Helper: Read complete request from client (up to headers)
// Returns bytes read, or -1 on error
static ssize_t safe_read(int fd, std::string &out) {
    char buf[4096];
    ssize_t total = 0;

    while (true) {
        ssize_t n = recv(fd, buf, sizeof(buf), 0);

        if (n > 0) {
            out.append(buf, buf + n);
            total += n;

            // Stop when we see end of headers (for now, we read until headers are complete)
            if (out.find("\r\n\r\n") != std::string::npos)
                break;

        } else if (n == 0) {
            // EOF - client closed connection
            break;

        } else {
            // Error case
            if (errno == EINTR) {
                continue;  // Retry on interrupt
            }
            if (errno == EAGAIN || errno == EWOULDBLOCK) {
                // Non-blocking socket would block - in blocking mode this shouldn't happen
                // but handle it gracefully
                break;
            }
            return -1;  // Real error
        }
    }
    return total;
}

// Helper: Parse HTTP status code from response
// Returns status code, or -1 if not found
static int parse_http_status_code(const std::string& response) {
    // Look for "HTTP/1.x STATUS_CODE" pattern
    size_t start = response.find("HTTP/");
    if (start == std::string::npos) {
        return -1;
    }
    
    size_t code_start = response.find(' ', start);
    if (code_start == std::string::npos) {
        return -1;
    }
    
    code_start++;  // Skip space
    size_t code_end = response.find(' ', code_start);
    if (code_end == std::string::npos) {
        code_end = response.find('\r', code_start);
        if (code_end == std::string::npos) {
            return -1;
        }
    }
    
    try {
        return std::stoi(response.substr(code_start, code_end - code_start));
    } catch (...) {
        return -1;
    }
}

// Helper: Get client IP address from socket
static std::string get_client_ip(int client_fd) {
    struct sockaddr_in addr;
    socklen_t len = sizeof(addr);
    if (getpeername(client_fd, (struct sockaddr*)&addr, &len) == 0) {
        char ip_str[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &addr.sin_addr, ip_str, INET_ADDRSTRLEN);
        return std::string(ip_str);
    }
    return "unknown";
}

// Helper: Read response from backend and forward to client
// Returns status code on success, -1 on error
static int forward_response(int backend_fd, int client_fd, std::string& response_buffer) {
    char buf[8192];
    response_buffer.clear();
    bool headers_complete = false;
    int status_code = -1;
    
    while (true) {
        ssize_t n = recv(backend_fd, buf, sizeof(buf), 0);
        
        if (n > 0) {
            // Append to response buffer for status code parsing
            if (!headers_complete) {
                response_buffer.append(buf, n);
                if (response_buffer.find("\r\n\r\n") != std::string::npos) {
                    headers_complete = true;
                    status_code = parse_http_status_code(response_buffer);
                }
            }
            
            // Forward data to client
            if (!send_all(client_fd, buf, n)) {
                // Failed to send to client (client probably disconnected)
                return -1;
            }
        } else if (n == 0) {
            // Backend closed connection - normal end of response
            break;
        } else {
            // Error reading from backend
            if (errno == EINTR) {
                continue;  // Retry on interrupt
            }
            if (errno == EAGAIN || errno == EWOULDBLOCK) {
                // Would block - shouldn't happen with blocking socket, but handle it
                break;
            }
            // Real error
            return -1;
        }
    }
    
    // If we didn't parse status code yet, try now
    if (status_code == -1 && !response_buffer.empty()) {
        status_code = parse_http_status_code(response_buffer);
    }
    
    return status_code;
}

// Parse HTTP request line: "METHOD PATH VERSION"
static bool parse_request_line(const std::string &req,
                               std::string &method,
                               std::string &path,
                               std::string &ver) 
{
    size_t pos = req.find("\r\n");
    if (pos == std::string::npos) {
        return false;
    }

    std::string line = req.substr(0, pos);
    std::istringstream ss(line);
    
    if (ss >> method >> path >> ver) {
        return true;
    }
    return false;
}

// Connect to backend with timeout (5 seconds)
// Returns socket fd on success, -1 on failure
static int connect_to_backend(const Backend &b) {
    struct addrinfo hints{}, *res = nullptr;
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    std::string port = std::to_string(b.port);

    if (getaddrinfo(b.host.c_str(), port.c_str(), &hints, &res) != 0) {
        return -1;
    }

    int sock = -1;
    for (struct addrinfo *rp = res; rp; rp = rp->ai_next) {
        sock = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);
        if (sock < 0) {
            continue;
        }

        // Set socket options for better behavior
        int opt = 1;
        setsockopt(sock, IPPROTO_TCP, TCP_NODELAY, &opt, sizeof(opt));
        
        // Set non-blocking for timeout
        int flags = fcntl(sock, F_GETFL, 0);
        fcntl(sock, F_SETFL, flags | O_NONBLOCK);
        
        // Try to connect (non-blocking)
        int result = connect(sock, rp->ai_addr, rp->ai_addrlen);
        if (result == 0) {
            // Connected immediately - restore blocking mode
            fcntl(sock, F_SETFL, flags);
            break;
        } else if (errno == EINPROGRESS) {
            // Connection in progress - wait with select for timeout
            fd_set write_fds;
            FD_ZERO(&write_fds);
            FD_SET(sock, &write_fds);
            
            struct timeval timeout;
            timeout.tv_sec = 5;  // 5 second connection timeout
            timeout.tv_usec = 0;
            
            int select_result = select(sock + 1, nullptr, &write_fds, nullptr, &timeout);
            if (select_result > 0 && FD_ISSET(sock, &write_fds)) {
                // Check if connection succeeded
                int error = 0;
                socklen_t len = sizeof(error);
                if (getsockopt(sock, SOL_SOCKET, SO_ERROR, &error, &len) == 0 && error == 0) {
                    // Successfully connected - restore blocking mode
                    fcntl(sock, F_SETFL, flags);
                    break;
                }
            }
            // Timeout or connection failed
            close(sock);
            sock = -1;
        } else {
            // Connection failed immediately - close and try next address
            close(sock);
            sock = -1;
        }
    }

    freeaddrinfo(res);
    return sock;
}

// Send error response to client
static void send_error_response(int client_fd, const char *response) {
    send_all(client_fd, response, strlen(response));
}

// Main handler for client requests
void handle_client(int client_fd) {
    // Get client IP for logging
    std::string client_ip = get_client_ip(client_fd);
    
    // Read request from client
    std::string req;
    ssize_t r = safe_read(client_fd, req);

    if (r < 0 || req.empty()) {
        // Error reading or empty request - just close
        close(client_fd);
        return;
    }

    // Parse request line
    std::string method, path, ver;
    if (!parse_request_line(req, method, path, ver)) {
        const char *bad = 
            "HTTP/1.1 400 Bad Request\r\n"
            "Content-Length: 11\r\n"
            "Connection: close\r\n"
            "\r\n"
            "Bad Request";
        send_error_response(client_fd, bad);
        Logger::proxy_request(client_ip, method, path, "", 0, 400, "Bad Request");
        close(client_fd);
        return;
    }

    // For now, only support GET (can extend later)
    if (method != "GET") {
        const char *notimpl = 
            "HTTP/1.1 501 Not Implemented\r\n"
            "Content-Length: 15\r\n"
            "Connection: close\r\n"
            "\r\n"
            "Not Implemented";
        send_error_response(client_fd, notimpl);
        Logger::proxy_request(client_ip, method, path, "", 0, 501, "Not Implemented");
        close(client_fd);
        return;
    }

    // Get backend from load balancer with retry logic
    static LoadBalancer lb("configs/backends.conf");
    static Metrics& metrics = Metrics::get_instance();
    
    const size_t max_retries = 3;
    int status_code = 502;
    std::string status_text = "Bad Gateway";
    Backend selected_backend;
    bool success = false;
    
    for (size_t attempt = 0; attempt < max_retries; ++attempt) {
        // Get next healthy backend
        Backend b = (attempt == 0) ? lb.get_next_backend() : lb.get_next_healthy_backend(max_retries);
        selected_backend = b;
        
        std::string backend_key = Metrics::format_backend_key(b.host, b.port);
        metrics.record_request(backend_key);
        
        // Connect to backend
        int backend_sock = connect_to_backend(b);
        if (backend_sock < 0) {
            // Failed to connect - mark as unhealthy and retry
            size_t backend_idx = lb.find_backend_index(b);
            if (backend_idx < lb.get_backend_count()) {
                lb.mark_backend_unhealthy(backend_idx, "connection failed");
            }
            metrics.record_failure(backend_key);
            
            if (attempt < max_retries - 1) {
                // Retry with next backend
                Backend next_b = lb.get_next_healthy_backend(max_retries);
                Logger::backend_retry(
                    b.host + ":" + std::to_string(b.port),
                    next_b.host + ":" + std::to_string(next_b.port),
                    "Connection failed"
                );
                continue;
            }
            // All retries exhausted
            break;
        }
        
        // Connection succeeded - mark as healthy
        size_t backend_idx = lb.find_backend_index(b);
        if (backend_idx < lb.get_backend_count()) {
            lb.mark_backend_healthy(backend_idx, "connection successful");
        }

        // Forward the request to backend
        if (!send_all(backend_sock, req.data(), req.size())) {
            // Failed to send request to backend
            metrics.record_failure(backend_key);
            close(backend_sock);
            
            if (attempt < max_retries - 1) {
                Backend next_b = lb.get_next_healthy_backend(max_retries);
                Logger::backend_retry(
                    b.host + ":" + std::to_string(b.port),
                    next_b.host + ":" + std::to_string(next_b.port),
                    "Send failed"
                );
                continue;
            }
            break;
        }

        // Read response from backend and forward to client
        std::string response_buffer;
        status_code = forward_response(backend_sock, client_fd, response_buffer);
        
        // Clean up backend socket
        close(backend_sock);
        
        // Determine status text
        if (status_code >= 200 && status_code < 300) {
            status_text = "OK";
            metrics.record_success(backend_key);
            success = true;
        } else if (status_code >= 400) {
            status_text = "Error";
            metrics.record_failure(backend_key);
        } else {
            status_text = "";
            metrics.record_success(backend_key);
            success = true;
        }
        
        // Log the request with structured logging
        Logger::proxy_request(client_ip, method, path, 
                             selected_backend.host, selected_backend.port,
                             status_code, status_text);
        
        // Close client socket and return
        close(client_fd);
        return;
    }
    
    // All retries failed - send error response
    const char *srvfail = 
        "HTTP/1.1 502 Bad Gateway\r\n"
        "Content-Length: 11\r\n"
        "Connection: close\r\n"
        "\r\n"
        "Bad Gateway";
    send_error_response(client_fd, srvfail);
    
    // Log the failed request
    Logger::proxy_request(client_ip, method, path,
                         selected_backend.host, selected_backend.port,
                         502, "Bad Gateway");
    
    close(client_fd);
}

