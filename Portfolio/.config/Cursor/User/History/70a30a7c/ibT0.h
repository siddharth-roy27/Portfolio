#ifndef METRICS_H
#define METRICS_H

#include <string>
#include <map>
#include <atomic>
#include <mutex>

struct BackendMetrics {
    std::atomic<size_t> requests_total{0};
    std::atomic<size_t> failures_total{0};
    std::atomic<size_t> successes_total{0};
};

class Metrics {
public:
    static Metrics& get_instance() {
        static Metrics instance;
        return instance;
    }
    
    // Record a request attempt
    void record_request(const std::string& backend_key);
    
    // Record a successful request
    void record_success(const std::string& backend_key);
    
    // Record a failed request
    void record_failure(const std::string& backend_key);
    
    // Get metrics for a backend (returns individual values since atomic can't be copied)
    void get_metrics(const std::string& backend_key, 
                     size_t& requests, 
                     size_t& failures, 
                     size_t& successes) const;
    
    // Get all metrics (for /metrics endpoint) - returns formatted strings
    void print_all_metrics(std::ostream& out) const;
    
    // Format backend key from host:port
    static std::string format_backend_key(const std::string& host, int port);

private:
    Metrics() = default;
    ~Metrics() = default;
    Metrics(const Metrics&) = delete;
    Metrics& operator=(const Metrics&) = delete;
    
    mutable std::mutex metrics_mutex;
    std::map<std::string, BackendMetrics> backend_metrics;
};

#endif

