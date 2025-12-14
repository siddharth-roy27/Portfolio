#include <unistd.h>
#include <cstring>
#include <cstdio>
#include <iostream>

void handle_client(int client_fd) {
    char buffer[4096];

    int len = read(client_fd, buffer, sizeof(buffer)-1);
    if (len > 0) {
        buffer[len] = '\0';
        std::cout << "[CLIENT] " << buffer << std::endl;

        // Basic echo for now
        write(client_fd, buffer, len);
    }

    close(client_fd);
}
