#include "metrics.h"
#include <sstream>
#include <algorithm>

std::string Metrics::format_backend_key(const std::string& host, int port) {
    std::stringstream ss;
    ss << host << ":" << port;
    return ss.str();
}

void Metrics::record_request(const std::string& backend_key) {
    std::lock_guard<std::mutex> lock(metrics_mutex);
    backend_metrics[backend_key].requests_total.fetch_add(1, std::memory_order_relaxed);
}

void Metrics::record_success(const std::string& backend_key) {
    std::lock_guard<std::mutex> lock(metrics_mutex);
    backend_metrics[backend_key].successes_total.fetch_add(1, std::memory_order_relaxed);
}

void Metrics::record_failure(const std::string& backend_key) {
    std::lock_guard<std::mutex> lock(metrics_mutex);
    backend_metrics[backend_key].failures_total.fetch_add(1, std::memory_order_relaxed);
}

void Metrics::get_metrics(const std::string& backend_key,
                          size_t& requests,
                          size_t& failures,
                          size_t& successes) const {
    std::lock_guard<std::mutex> lock(metrics_mutex);
    auto it = backend_metrics.find(backend_key);
    if (it != backend_metrics.end()) {
        requests = it->second.requests_total.load(std::memory_order_relaxed);
        failures = it->second.failures_total.load(std::memory_order_relaxed);
        successes = it->second.successes_total.load(std::memory_order_relaxed);
    } else {
        requests = failures = successes = 0;
    }
}

void Metrics::print_all_metrics(std::ostream& out) const {
    std::lock_guard<std::mutex> lock(metrics_mutex);
    for (const auto& pair : backend_metrics) {
        std::string key = pair.first;
        // Replace : with _ for Prometheus-style metric names
        std::string metric_key = key;
        std::replace(metric_key.begin(), metric_key.end(), ':', '_');
        std::replace(metric_key.begin(), metric_key.end(), '.', '_');
        
        size_t requests = pair.second.requests_total.load(std::memory_order_relaxed);
        size_t failures = pair.second.failures_total.load(std::memory_order_relaxed);
        size_t successes = pair.second.successes_total.load(std::memory_order_relaxed);
        
        out << "backend_" << metric_key << "_requests_total " << requests << "\n";
        out << "backend_" << metric_key << "_failures_total " << failures << "\n";
        out << "backend_" << metric_key << "_successes_total " << successes << "\n";
    }
}

