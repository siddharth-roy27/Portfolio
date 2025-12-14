#ifndef LOAD_BALANCER_H
#define LOAD_BALANCER_H

#include "backend.h"   // <-- THIS IS REQUIRED


#include <string>
#include <vector>
#include <atomic>

struct Backend {
    std::string host;
    int port;
};

class LoadBalancer {
public:
    LoadBalancer() = delete;
    explicit LoadBalancer(const std::string &conf_path);
    ~LoadBalancer();

    // returns "host:port"
    Backend get_next_backend();

private:
    std::vector<Backend> backends;
    std::atomic<size_t> idx;
};

#endif // LOAD_BALANCER_H
