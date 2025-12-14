#include <iostream>
#include <unistd.h>
#include <sys/epoll.h>
#include <fcntl.h>
#include <sys/socket.h>     // ← required for accept()
#include <netinet/in.h>     // ← sockaddr_in
#include <arpa/inet.h>      // ← inet functions
#include <cstring>
#include <cstdlib>
#include <pthread.h>
#include <unistd.h>
#include <stdio.h>

#include "server.h"
#include "threadpool.h"
#include "load_balancer.h"
#include "backend.h"
#include "logger.h"


#define MAX_EVENTS 128

// Make fd non-blocking
static void set_nonblocking(int fd) {
    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);
}

// Health check thread - periodically checks all backends
static void* health_check_thread(void* arg) {
    LoadBalancer* lb = static_cast<LoadBalancer*>(arg);
    
    while (true) {
        // Sleep for 10 seconds between health checks
        sleep(10);
        
        // Check each backend
        for (size_t i = 0; i < lb->get_backend_count(); ++i) {
            Backend b = lb->get_backend(i);
            bool healthy = lb->check_backend_health(b);
            
            if (healthy) {
                lb->mark_backend_healthy(i);
            } else {
                lb->mark_backend_unhealthy(i);
            }
        }
    }
    
    return nullptr;
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

    // Create LoadBalancer instance for health checks
    // Note: backend.cpp has its own static instance, but we need one here for health checks
    // In a production system, you'd want a single shared instance
    LoadBalancer* lb = nullptr;
    try {
        lb = new LoadBalancer("configs/backends.conf");
        
        // Start health check thread
        pthread_t health_thread;
        if (pthread_create(&health_thread, nullptr, health_check_thread, lb) != 0) {
            std::cerr << "Failed to create health check thread\n";
        } else {
            pthread_detach(health_thread);  // Detach so it cleans up automatically
            std::cout << "Health check thread started\n";
        }
    } catch (const std::exception& e) {
        std::cerr << "Failed to initialize load balancer: " << e.what() << std::endl;
        return 1;
    }

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
