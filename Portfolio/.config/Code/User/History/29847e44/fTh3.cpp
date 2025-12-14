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
#include <sstream>

#include "load_balancer.h"   // must come first (defines Backend)
#include "backend.h"         // declares handle_client



static ssize_t safe_read(int fd, std::string &out) {
    char buf[4096];
    ssize_t total = 0;

    while (true) {
        ssize_t n = recv(fd, buf, sizeof(buf), 0);

        if (n > 0) {
            out.append(buf, buf + n);
            total += n;

            // end of headers
            if (out.find("\r\n\r\n") != std::string::npos)
                break;

        } else if (n == 0) {
            break; // EOF

        } else {
            if (errno == EAGAIN || errno == EWOULDBLOCK)
                break;
            return -1;
        }
    }
    return total;
}


static bool parse_request_line(const std::string &req,
                               std::string &method,
                               std::string &path,
                               std::string &ver) 
{
    size_t pos = req.find("\r\n");
    if (pos == std::string::npos) return false;

    std::string line = req.substr(0, pos);
    std::istringstream ss(line);

if (ss >> method >> path >> ver)
    return true;
return false;
}


static int connect_to_backend(const Backend &b) {
    struct addrinfo hints{}, *res = nullptr;
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    std::string port = std::to_string(b.port);

    if (getaddrinfo(b.host.c_str(), port.c_str(), &hints, &res) != 0)
        return -1;

    int sock = -1;
    for (struct addrinfo *rp = res; rp; rp = rp->ai_next) {
        sock = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);
        if (sock < 0) continue;

        if (connect(sock, rp->ai_addr, rp->ai_addrlen) == 0)
            break;  // connected

        close(sock);
        sock = -1;
    }

    freeaddrinfo(res);
    return sock;
}


void handle_client(int client_fd) {
    std::string req;
    ssize_t r = safe_read(client_fd, req);

    if (r < 0 || req.empty()) {
        close(client_fd);
        return;
    }

    std::string method, path, ver;
    if (!parse_request_line(req, method, path, ver)) {
        const char *bad =
            "HTTP/1.1 400 Bad Request\r\nContent-Length: 11\r\n\r\nBad Request";
        write(client_fd, bad, strlen(bad));
        close(client_fd);
        return;
    }

    if (method != "GET") {
        const char *notimpl =
            "HTTP/1.1 501 Not Implemented\r\nContent-Length: 15\r\n\r\nNot Implemented";
        write(client_fd, notimpl, strlen(notimpl));
        close(client_fd);
        return;
    }

    static LoadBalancer lb("configs/backends.conf");
    Backend b = lb.get_next_backend();

    int backend_sock = connect_to_backend(b);
    if (backend_sock < 0) {
        const char *srvfail =
            "HTTP/1.1 502 Bad Gateway\r\nContent-Length: 11\r\n\r\nBad Gateway";
        write(client_fd, srvfail, strlen(srvfail));
        close(client_fd);
        return;
    }

    // forward request
    size_t sent = 0;
    size_t remaining = req.size();

    while (remaining > 0) {
        ssize_t n = send(backend_sock, req.data() + sent, remaining, 0);
        if (n <= 0) {
            if (errno == EINTR) continue;
            break;
        }
        sent += n;
        remaining -= n;
    }

    // read response from backend and send to client
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
        } else {
            break;
        }
    }

    close(backend_sock);
    // threadpool closes client_fd
}
