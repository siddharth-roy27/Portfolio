#ifndef BACKEND_H
#define BACKEND_H

#include <string>

struct Backend {
    std::string host;
    int port;
    
    Backend() : port(0) {}
    Backend(const std::string &h, int p) : host(h), port(p) {}
};

// implemented in backend.cpp
void handle_client(int client_fd);

#endif
