#ifndef LOGGER_H
#define LOGGER_H

#include <string>
#include <iostream>
#include <iomanip>
#include <sstream>
#include <ctime>
#include <mutex>

enum class LogLevel {
    INFO,
    WARN,
    ERROR
};

class Logger {
public:
    static void log(LogLevel level, const std::string& message);
    static void info(const std::string& message);
    static void warn(const std::string& message);
    static void error(const std::string& message);
    
    // Structured logging helpers
    static void proxy_request(const std::string& client_ip, 
                              const std::string& method,
                              const std::string& path,
                              const std::string& backend_host,
                              int backend_port,
                              int status_code,
                              const std::string& status_text = "");
    
    static void backend_health(const std::string& backend_host,
                               int backend_port,
                               bool healthy,
                               const std::string& reason = "");
    
    static void backend_retry(const std::string& old_backend,
                              const std::string& new_backend,
                              const std::string& reason);

private:
    static std::string get_timestamp();
    static std::string level_to_string(LogLevel level);
    static std::mutex log_mutex;
};

#endif

