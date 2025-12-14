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

BackendMetrics Metrics::get_metrics(const std::string& backend_key) const {
    std::lock_guard<std::mutex> lock(metrics_mutex);
    auto it = backend_metrics.find(backend_key);
    if (it != backend_metrics.end()) {
        return it->second;
    }
    return BackendMetrics{};
}

std::map<std::string, BackendMetrics> Metrics::get_all_metrics() const {
    std::lock_guard<std::mutex> lock(metrics_mutex);
    return backend_metrics;
}

