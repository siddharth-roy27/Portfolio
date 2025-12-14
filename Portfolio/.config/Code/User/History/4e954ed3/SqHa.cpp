#include <iostream>
#include <unistd.h>
#include <string.h>
#include <fcntl.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#include "epoll_handler.h"

// Make FD non-blocking
void make_nonblocking(int fd) {
    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);
}

int main() {
    int port = 8080;

    // Create server socket
    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (listen_fd < 0) {
        perror("socket");
        return 1;
    }

    make_nonblocking(listen_fd);

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    if (bind(listen_fd, (sockaddr*)&addr, sizeof(addr)) < 0) {
        perror("bind");
        return 1;
    }

    if (listen(listen_fd, SOMAXCONN) < 0) {
        perror("listen");
        return 1;
    }

    std::cout << "Step 2: epoll server running on port " << port << "\n";

    EpollHandler ep;
    ep.add_fd(listen_fd, EPOLLIN); // watch new clients

    epoll_event events[64];

    while (true) {
        int n = epoll_wait(ep.epoll_fd, events, 64, -1);
        if (n < 0) {
            perror("epoll_wait");
            continue;
        }

        for (int i = 0; i < n; i++) {
            int fd = events[i].data.fd;

            // New client
            if (fd == listen_fd) {
                int client_fd = accept(listen_fd, nullptr, nullptr);
                if (client_fd >= 0) {
                    make_nonblocking(client_fd);
                    ep.add_fd(client_fd, EPOLLIN);
                    std::cout << "New client accepted: FD " << client_fd << "\n";
                }
            }
            else if (events[i].events & EPOLLIN) {
                char buf[4096];
                int len = read(fd, buf, sizeof(buf));

                if (len <= 0) {
                    close(fd);
                    ep.remove_fd(fd);
                    std::cout << "Client disconnected: FD " << fd << "\n";
                } else {
                    write(fd, buf, len); // echo for now
                }
            }
        }
    }

    close(listen_fd);
    return 0;
}
