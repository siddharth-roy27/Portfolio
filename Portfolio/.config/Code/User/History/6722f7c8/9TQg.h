#ifndef LOAD_BALANCER_H
#define LOAD_BALANCER_H

#include "backend.h"   // include actual definition
#include <string>
#include <vector>
#include <atomic>

class LoadBalancer {
public:
    LoadBalancer() = delete;
    explicit LoadBalancer(const std::string &conf_path);
    ~LoadBalancer();

    Backend get_next_backend();

private:
    std::vector<Backend> backends;
    std::atomic<size_t> idx;
};

#endif // LOAD_BALANCER_H
