#include <unistd.h>
#include <cstring>
#include <cstdio>
#include <iostream>
#include <string>
#include <vector>
#include <sys/socket.h>
#include <netdb.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#include "load_balancer.h"

// forward declaration if your threadpool uses this extern
// extern void handle_client(int client_fd);

static ssize_t safe_read(int fd, std::string &out) {
    char buf[4096];
    ssize_t total = 0;
    while (true) {
        ssize_t n = recv(fd, buf, sizeof(buf), 0);
        if (n > 0) {
            out.append(buf, buf + n);
            total += n;
            // If we already have end of headers, break to parse request
            if (out.find("\r\n\r\n") != std::string::npos) break;
            // else continue to try to read more
            continue;
        } else if (n == 0) {
            // EOF
            break;
        } else {
            if (errno == EAGAIN || errno == EWOULDBLOCK) {
                // no more data now
                break;
            } else {
                return -1;
            }
        }
    }
    return total;
}

static bool parse_request_line(const std::string &req, std::string &method, std::string &path, std::string &ver) {
    size_t pos = req.find("\r\n");
    if (pos == std::string::npos) return false;
    std::string line = req.substr(0, pos);
    std::istringstream ss(line);
    if (!(ss >> method >> path >> ver)) return false;
    return true;
}

static int connect_to_backend(const Backend &b) {
    struct addrinfo hints{}, *res = nullptr;
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    std::string port = std::to_string(b.port);
    int ret = getaddrinfo(b.host.c_str(), port.c_str(), &hints, &res);
    if (ret != 0) {
        return -1;
    }

    int sock = -1;
    for (struct addrinfo *rp = res; rp != nullptr; rp = rp->ai_next) {
        sock = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);
        if (sock < 0) continue;
        if (connect(sock, rp->ai_addr, rp->ai_addrlen) == 0) {
            break; // connected
        }
        close(sock);
        sock = -1;
    }

    freeaddrinfo(res);
    return sock;
}

void handle_client(int client_fd) {
    // Read request headers (simple)
    std::string req;
    // try reading (fd might be blocking or non-blocking)
    ssize_t r = safe_read(client_fd, req);
    if (r < 0) {
        close(client_fd);
        return;
    }
    if (req.size() == 0) {
        // nothing received
        close(client_fd);
        return;
    }

    std::string method, path, ver;
    if (!parse_request_line(req, method, path, ver)) {
        // malformed
        const char *bad = "HTTP/1.1 400 Bad Request\r\nContent-Length: 11\r\n\r\nBad Request";
        write(client_fd, bad, strlen(bad));
        close(client_fd);
        return;
    }

    if (method != "GET") {
        const char *notimpl = "HTTP/1.1 501 Not Implemented\r\nContent-Length: 15\r\n\r\nNot Implemented";
        write(client_fd, notimpl, strlen(notimpl));
        close(client_fd);
        return;
    }

    // choose backend
    // backends.conf path relative to project root
    static LoadBalancer lb("configs/backends.conf");
    Backend b = lb.get_next_backend();

    int backend_sock = connect_to_backend(b);
    if (backend_sock < 0) {
        const char *srvfail = "HTTP/1.1 502 Bad Gateway\r\nContent-Length: 11\r\n\r\nBad Gateway";
        write(client_fd, srvfail, strlen(srvfail));
        close(client_fd);
        return;
    }

    // Forward original request (raw) to backend
    ssize_t sent = 0;
    const char *data = req.data();
    size_t remaining = req.size();
    while (remaining > 0) {
        ssize_t n = send(backend_sock, data + sent, remaining, 0);
        if (n <= 0) {
            if (errno == EINTR) continue;
            break;
        }
        sent += n;
        remaining -= n;
    }

    // Now read backend response and stream back to client
    char buf[8192];
    while (true) {
        ssize_t n = recv(backend_sock, buf, sizeof(buf), 0);
        if (n > 0) {
            ssize_t w = 0;
            while (w < n) {
                ssize_t m = write(client_fd, buf + w, n - w);
                if (m <= 0) {
                    if (errno == EINTR) continue;
                    break;
                }
                w += m;
            }
        } else if (n == 0) {
            break; // backend closed
        } else {
            if (errno == EINTR) continue;
            break;
        }
    }

    close(backend_sock);
    // close(client_fd) - threadpool worker already closes client_fd after calling handle_client
}
