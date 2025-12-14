#include "load_balancer.h"
#include <fstream>
#include <sstream>
#include <stdexcept>

LoadBalancer::LoadBalancer(const std::string &conf_path) : idx(0) {
    std::ifstream file(conf_path);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open backend config: " + conf_path);
    }

    std::string line;
    while (std::getline(file, line)) {
        if (line.empty()) continue;

        // Format: host:port
        size_t pos = line.find(':');
        if (pos == std::string::npos) continue;

        Backend b;
        b.host = line.substr(0, pos);
        b.port = std::stoi(line.substr(pos + 1));

        backends.push_back(b);
    }

    if (backends.empty()) {
        throw std::runtime_error("No backends available in config file");
    }
}

LoadBalancer::~LoadBalancer() {}

Backend LoadBalancer::get_next_backend() {
    size_t i = idx.fetch_add(1) % backends.size();
    return backends[i]; 
}
