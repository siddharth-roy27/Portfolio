#include <iostream>
#include <csignal>
#include <unistd.h>
#include <arpa/inet.h>
#include <cstring>

bool keep_running = true;

void handle_signal(int) {
    keep_running = false;
}

int main() {
    signal(SIGINT, handle_signal);

    int port = 8080;

    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (listen_fd < 0) {
        std::cerr << "Socket creation failed\n";
        return 1;
    }

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    if (bind(listen_fd, (sockaddr *)&addr, sizeof(addr)) < 0) {
        std::cerr << "Bind failed\n";
        return 1;
    }

    if (listen(listen_fd, SOMAXCONN) < 0) {
        std::cerr << "Listen failed\n";
        return 1;
    }

    std::cout << "Echo server running on port " << port << "\n";

    while (keep_running) {
        sockaddr_in client_addr{};
        socklen_t client_len = sizeof(client_addr);

        int client_fd = accept(listen_fd, (sockaddr *)&client_addr, &client_len);
        if (client_fd < 0) continue;

        char buffer[1024];
        ssize_t bytes = read(client_fd, buffer, sizeof(buffer) - 1);
        if (bytes > 0) {
            buffer[bytes] = '\0';
            std::cout << "Received: " << buffer;
            write(client_fd, buffer, strlen(buffer)); // Echo back
        }

        close(client_fd);
    }

    close(listen_fd);
    std::cout << "Server shutting down\n";
    return 0;
}
