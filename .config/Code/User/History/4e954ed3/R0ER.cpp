// Build: g++ -std=c++17 -Wall -Wextra src/main.cpp -o bin/reverse-proxy-step1
return 1;
}


sockaddr_in addr{};
addr.sin_family = AF_INET;
addr.sin_addr.s_addr = INADDR_ANY;
addr.sin_port = htons(port);


if (bind(listen_fd, (sockaddr*)&addr, sizeof(addr)) < 0) {
perror("bind");
close(listen_fd);
return 1;
}


if (listen(listen_fd, SOMAXCONN) < 0) {
perror("listen");
close(listen_fd);
return 1;
}


std::cout << "Echo server listening on port " << port << " (CTRL-C to stop)\n";


while (keep_running) {
sockaddr_in client_addr{};
socklen_t client_len = sizeof(client_addr);
int client_fd = accept(listen_fd, (sockaddr*)&client_addr, &client_len);
if (client_fd < 0) {
if (errno == EINTR) continue; // interrupted by signal
perror("accept");
break;
}


char hostbuf[INET_ADDRSTRLEN];
inet_ntop(AF_INET, &client_addr.sin_addr, hostbuf, sizeof(hostbuf));
std::cout << "Accepted connection from " << hostbuf << ":" << ntohs(client_addr.sin_port) << "\n";


// Handle client in-blocking style (simple for step 1)
const size_t BUF_SZ = 4096;
char buffer[BUF_SZ];
ssize_t n;
while ((n = read(client_fd, buffer, BUF_SZ)) > 0) {
// echo back
ssize_t written = 0;
while (written < n) {
ssize_t w = write(client_fd, buffer + written, n - written);
if (w < 0) {
perror("write");
break;
}
written += w;
}
}
if (n == 0) {
std::cout << "Client closed connection\n";
} else if (n < 0) {
perror("read");
}


close(client_fd);
}


close(listen_fd);
std::cout << "Server shutting down\n";
return 0;
}