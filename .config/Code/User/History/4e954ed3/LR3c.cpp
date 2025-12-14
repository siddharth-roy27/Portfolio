#include <iostream>
#include <unistd.h>
#include <sys/epoll.h>
#include <fcntl.h>
#include <sys/socket.h>     // ← required for accept()
#include <netinet/in.h>     // ← sockaddr_in
#include <arpa/inet.h>      // ← inet functions
#include <cstring>

#include "server.h"
#include "threadpool.h"


#define MAX_EVENTS 128

// Make fd non-blocking
static void set_nonblocking(int fd) {
    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);
}

int main() {
    int server_fd = start_server(8080);
    set_nonblocking(server_fd);

    int epfd = epoll_create1(0);

    epoll_event event{};
    event.data.fd = server_fd;
    event.events = EPOLLIN;
    epoll_ctl(epfd, EPOLL_CTL_ADD, server_fd, &event);

    // Create thread pool
    threadpool_t *pool = threadpool_create(8, 256);
    std::cout << "Step 3: Thread pool + epoll server running on port 8080\n";

    epoll_event events[MAX_EVENTS];

    while (true) {
        int n = epoll_wait(epfd, events, MAX_EVENTS, -1);

        for (int i = 0; i < n; i++) {
            int fd = events[i].data.fd;

            // New client connected
            if (fd == server_fd) {
                int client_fd = accept(server_fd, NULL, NULL);
                if (client_fd >= 0) {
                    set_nonblocking(client_fd);

                    epoll_event client_event{};
                    client_event.data.fd = client_fd;
                    client_event.events = EPOLLIN | EPOLLET;  // edge-triggered
                    epoll_ctl(epfd, EPOLL_CTL_ADD, client_fd, &client_event);
                }
            }
            else {
                // Existing client has data → push to thread pool
                if (events[i].events & EPOLLIN) {
                    threadpool_add_job(pool, fd);
                }
            }
        }
    }

    return 0;
}
