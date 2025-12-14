#include "logger.h"
#include <mutex>
#include <chrono>
#include <iomanip>
#include <sstream>

std::mutex Logger::log_mutex;

std::string Logger::get_timestamp() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()) % 1000;
    
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d %H:%M:%S");
    ss << "." << std::setfill('0') << std::setw(3) << ms.count();
    return ss.str();
}

std::string Logger::level_to_string(LogLevel level) {
    switch (level) {
        case LogLevel::INFO: return "INFO";
        case LogLevel::WARN: return "WARN";
        case LogLevel::ERROR: return "ERROR";
        default: return "UNKNOWN";
    }
}

void Logger::log(LogLevel level, const std::string& message) {
    std::lock_guard<std::mutex> lock(log_mutex);
    std::cout << "[" << get_timestamp() << "] "
              << "[" << level_to_string(level) << "] "
              << message << std::endl;
}

void Logger::info(const std::string& message) {
    log(LogLevel::INFO, message);
}

void Logger::warn(const std::string& message) {
    log(LogLevel::WARN, message);
}

void Logger::error(const std::string& message) {
    log(LogLevel::ERROR, message);
}

void Logger::proxy_request(const std::string& client_ip,
                          const std::string& method,
                          const std::string& path,
                          const std::string& backend_host,
                          int backend_port,
                          int status_code,
                          const std::string& status_text) {
    std::lock_guard<std::mutex> lock(log_mutex);
    std::cout << "[" << get_timestamp() << "] "
              << "[Proxy] " << client_ip << " "
              << method << " " << path
              << " -> backend " << backend_host << ":" << backend_port
              << " " << status_code;
    if (!status_text.empty()) {
        std::cout << " " << status_text;
    }
    std::cout << std::endl;
}

void Logger::backend_health(const std::string& backend_host,
                           int backend_port,
                           bool healthy,
                           const std::string& reason) {
    std::lock_guard<std::mutex> lock(log_mutex);
    std::string status = healthy ? "recovered" : "marked unhealthy";
    std::cout << "[" << get_timestamp() << "] "
              << "[Health] Backend " << backend_host << ":" << backend_port
              << " " << status;
    if (!reason.empty()) {
        std::cout << " (" << reason << ")";
    }
    std::cout << std::endl;
}

void Logger::backend_retry(const std::string& old_backend,
                          const std::string& new_backend,
                          const std::string& reason) {
    std::lock_guard<std::mutex> lock(log_mutex);
    std::cout << "[" << get_timestamp() << "] "
              << "[Proxy] " << reason << " on backend " << old_backend
              << ", retrying with " << new_backend << std::endl;
}

