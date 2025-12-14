#ifndef BACKEND_H
#define BACKEND_H

#include <string>

struct Backend {
    std::string host;
    int port;
};

// implemented in backend.cpp
void handle_client(int client_fd);

#endif
