package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    pb "github.com/siddharth-roy27/distributed-kv-store/github.com/siddharth-roy27/distributed-kv-store/proto"
)

// In-memory KV store
var store = make(map[string]string)

// KV service implementation
type server struct {
    pb.UnimplementedKVServer
}

func (s *server) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
    value, ok := store[req.Key]
    return &pb.GetResponse{Value: value, Found: ok}, nil
}

func (s *server) Set(ctx context.Context, req *pb.SetRequest) (*pb.SetResponse, error) {
    store[req.Key] = req.Value
    return &pb.SetResponse{Success: true}, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    grpcServer := grpc.NewServer()
    pb.RegisterKVServer(grpcServer, &server{})

    log.Println("KV gRPC server listening on :50051")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
