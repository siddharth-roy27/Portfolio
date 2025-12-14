#ifndef LOAD_BALANCER_H
#define LOAD_BALANCER_H

#include "backend.h"   // now this correctly brings struct Backend

#include <vector>
#include <atomic>
#include <string>
#include <mutex>

class LoadBalancer {
public:
    LoadBalancer() = delete;
    explicit LoadBalancer(const std::string &conf_path);
    ~LoadBalancer();

    Backend get_next_backend();
    
    // Health check methods
    void mark_backend_healthy(size_t index);
    void mark_backend_unhealthy(size_t index);
    bool is_backend_healthy(size_t index) const;
    size_t get_backend_count() const { return backends.size(); }

private:
    std::vector<Backend> backends;
    std::vector<bool> health_status;  // parallel array for health
    std::atomic<size_t> idx;
    mutable std::mutex health_mutex;  // for thread-safe health checks
};

#endif
