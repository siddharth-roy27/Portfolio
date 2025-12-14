#ifndef BACKEND_H
#define BACKEND_H

#include <string>
#include <atomic>

struct Backend {
    std::string host;
    int port;
    std::atomic<bool> healthy;  // true if backend is healthy
    
    Backend() : port(0), healthy(true) {}
    Backend(const std::string &h, int p) : host(h), port(p), healthy(true) {}
};

// implemented in backend.cpp
void handle_client(int client_fd);

#endif
