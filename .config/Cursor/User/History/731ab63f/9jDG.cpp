#include "load_balancer.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <algorithm>

LoadBalancer::LoadBalancer(const std::string &conf_path) : idx(0) {
    std::ifstream file(conf_path);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open backend config: " + conf_path);
    }

    std::string line;
    while (std::getline(file, line)) {
        // Skip empty lines and comments
        if (line.empty() || line[0] == '#') {
            continue;
        }

        // Format: host:port
        size_t pos = line.find(':');
        if (pos == std::string::npos) {
            continue;
        }

        Backend b;
        b.host = line.substr(0, pos);
        b.port = std::stoi(line.substr(pos + 1));

        backends.push_back(b);
    }
    
    // Initialize health status for all backends (all start healthy)
    health_status.resize(backends.size(), true);

    if (backends.empty()) {
        throw std::runtime_error("No backends available in config file");
    }
}

LoadBalancer::~LoadBalancer() {}

Backend LoadBalancer::get_next_backend() {
    // Round-robin with health check - skip unhealthy backends
    size_t start_idx = idx.fetch_add(1);
    size_t attempts = 0;
    const size_t max_attempts = backends.size();
    
    while (attempts < max_attempts) {
        size_t i = (start_idx + attempts) % backends.size();
        
        // Check if this backend is healthy
        if (health_status[i].load(std::memory_order_acquire)) {
            return backends[i];
        }
        
        attempts++;
    }
    
    // All backends unhealthy - return first one anyway (better than nothing)
    // In production, you might want to return an error or retry
    return backends[0];
}

void LoadBalancer::mark_backend_healthy(size_t index) {
    if (index < health_status.size()) {
        health_status[index].store(true, std::memory_order_release);
    }
}

void LoadBalancer::mark_backend_unhealthy(size_t index) {
    if (index < health_status.size()) {
        health_status[index].store(false, std::memory_order_release);
    }
}

bool LoadBalancer::is_backend_healthy(size_t index) const {
    if (index >= health_status.size()) {
        return false;
    }
    return health_status[index].load(std::memory_order_acquire);
}
