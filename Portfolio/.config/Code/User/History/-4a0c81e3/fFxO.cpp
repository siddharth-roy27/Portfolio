#include "server.h"
#include "threadpool.h"
#include "backend.h"   // for handle_client()
#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

int start_server(int port) {
    std::cout << "[server] Starting server on port " << port << std::endl;

    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        perror("socket");
        return -1;
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    if (bind(server_fd, (sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("bind");
        close(server_fd);
        return -1;
    }

    if (listen(server_fd, 128) < 0) {
        perror("listen");
        close(server_fd);
        return -1;
    }

    std::cout << "[server] Listening...\n";

    // Create thread pool with 8 threads, queue of 64 jobs
    threadpool_t *pool = threadpool_create(8, 64);

    while (true) {
        int client_fd = accept(server_fd, nullptr, nullptr);
        if (client_fd < 0) {
            perror("accept");
            continue;
        }

        // Hand off to thread pool
        threadpool_add_job(pool, client_fd);
    }

    close(server_fd);
    return 0;
}
