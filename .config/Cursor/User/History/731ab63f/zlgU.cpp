#include "load_balancer.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <algorithm>

LoadBalancer::LoadBalancer(const std::string &conf_path) : idx(0) {
    std::ifstream file(conf_path);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open backend config: " + conf_path);
    }

    std::string line;
    while (std::getline(file, line)) {
        // Skip empty lines and comments
        if (line.empty() || line[0] == '#') {
            continue;
        }

        // Format: host:port
        size_t pos = line.find(':');
        if (pos == std::string::npos) {
            continue;
        }

        Backend b;
        b.host = line.substr(0, pos);
        b.port = std::stoi(line.substr(pos + 1));

        backends.push_back(b);
    }
    
    // Initialize health status for all backends (all start healthy)
    health_status.resize(backends.size(), true);

    if (backends.empty()) {
        throw std::runtime_error("No backends available in config file");
    }
}

LoadBalancer::~LoadBalancer() {}

Backend LoadBalancer::get_next_backend() {
    // Round-robin with health check - skip unhealthy backends
    size_t start_idx = idx.fetch_add(1);
    size_t attempts = 0;
    const size_t max_attempts = backends.size();
    
    std::lock_guard<std::mutex> lock(health_mutex);
    
    while (attempts < max_attempts) {
        size_t i = (start_idx + attempts) % backends.size();
        
        // Check if this backend is healthy
        if (health_status[i]) {
            return backends[i];
        }
        
        attempts++;
    }
    
    // All backends unhealthy - return first one anyway (better than nothing)
    // In production, you might want to return an error or retry
    return backends[0];
}

void LoadBalancer::mark_backend_healthy(size_t index) {
    std::lock_guard<std::mutex> lock(health_mutex);
    if (index < health_status.size()) {
        health_status[index] = true;
    }
}

void LoadBalancer::mark_backend_unhealthy(size_t index) {
    std::lock_guard<std::mutex> lock(health_mutex);
    if (index < health_status.size()) {
        health_status[index] = false;
    }
}

bool LoadBalancer::is_backend_healthy(size_t index) const {
    std::lock_guard<std::mutex> lock(health_mutex);
    if (index >= health_status.size()) {
        return false;
    }
    return health_status[index];
}

size_t LoadBalancer::find_backend_index(const Backend &b) const {
    for (size_t i = 0; i < backends.size(); ++i) {
        if (backends[i].host == b.host && backends[i].port == b.port) {
            return i;
        }
    }
    return backends.size();  // Not found
}

bool LoadBalancer::check_backend_health(const Backend &b) const {
    // Simple TCP health check - try to connect
    struct addrinfo hints{}, *res = nullptr;
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    std::string port = std::to_string(b.port);
    bool healthy = false;

    if (getaddrinfo(b.host.c_str(), port.c_str(), &hints, &res) == 0) {
        for (struct addrinfo *rp = res; rp; rp = rp->ai_next) {
            int sock = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);
            if (sock < 0) {
                continue;
            }

            // Set non-blocking for timeout
            int flags = fcntl(sock, F_GETFL, 0);
            fcntl(sock, F_SETFL, flags | O_NONBLOCK);

            // Try to connect (non-blocking)
            int result = connect(sock, rp->ai_addr, rp->ai_addrlen);
            if (result == 0) {
                // Connected immediately
                healthy = true;
                close(sock);
                break;
            } else if (errno == EINPROGRESS) {
                // Connection in progress - wait with select for timeout
                fd_set write_fds;
                FD_ZERO(&write_fds);
                FD_SET(sock, &write_fds);
                
                struct timeval timeout;
                timeout.tv_sec = 2;  // 2 second timeout
                timeout.tv_usec = 0;
                
                int select_result = select(sock + 1, nullptr, &write_fds, nullptr, &timeout);
                if (select_result > 0 && FD_ISSET(sock, &write_fds)) {
                    // Check if connection succeeded
                    int error = 0;
                    socklen_t len = sizeof(error);
                    if (getsockopt(sock, SOL_SOCKET, SO_ERROR, &error, &len) == 0 && error == 0) {
                        healthy = true;
                    }
                }
                close(sock);
                if (healthy) break;
            } else {
                close(sock);
            }
        }
        freeaddrinfo(res);
    }

    return healthy;
}
