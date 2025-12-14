#ifndef EPOLL_HANDLER_H
#define EPOLL_HANDLER_H

#include <sys/epoll.h>

class EpollHandler {
public:
    int epoll_fd;

    EpollHandler();
    ~EpollHandler();

    void add_fd(int fd, uint32_t events);
    void modify_fd(int fd, uint32_t events);
    void remove_fd(int fd);
};

#endif
