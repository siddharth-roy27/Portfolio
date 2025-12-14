package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    pb "github.com/siddharth-roy27/distributed-kv-store/proto"
    "github.com/siddharth-roy27/distributed-kv-store/internal/raft"
)

// In-memory KV store
var store = make(map[string]string)

// KV service implementation
type server struct {
    pb.UnimplementedKVServer
    raftNode *raft.RaftNode
}

func (s *server) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
    value, ok := store[req.Key]
    return &pb.GetResponse{Value: value, Found: ok}, nil
}

func (s *server) Set(ctx context.Context, req *pb.SetRequest) (*pb.SetResponse, error) {
    // TODO: In the future, this should go through Raft leader
    store[req.Key] = req.Value
    return &pb.SetResponse{Success: true}, nil
}

func main() {
    // Start Raft node
    raftNode := &raft.RaftNode{ID: "node1"}
    raftNode.StartRaft()
    log.Println("Raft node started with ID:", raftNode.ID)

    // Start gRPC server
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    grpcServer := grpc.NewServer()
    pb.RegisterKVServer(grpcServer, &server{raftNode: raftNode})

    log.Println("KV gRPC server listening on :50051")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
