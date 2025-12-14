package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"strings"

	"google.golang.org/grpc"

	"github.com/siddharth-roy27/distributed-kv-store/internal/raft"
	pb "github.com/siddharth-roy27/distributed-kv-store/proto/kv"
)

// adapter server that implements the generated KV gRPC service and delegates to raft node
type server struct {
	pb.UnimplementedKVServer
	raftNode *raft.RaftNode
}

func (s *server) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) { // keep signature but delegate to simple store
	// For now the raft node doesn't expose a KV server helper; keep a simple in-memory store via raft if needed.
	return &pb.GetResponse{Value: "", Found: false}, nil
}

func (s *server) Set(ctx context.Context, req *pb.SetRequest) (*pb.SetResponse, error) {
	return &pb.SetResponse{Success: false}, nil
}

func main() {
	nodeID := flag.String("id", "node1", "Raft node ID")
	raftPort := flag.String("port", "8001", "Raft peer port")
	kvPort := flag.String("grpc-port", "50051", "KV gRPC server port")
	peersFlag := flag.String("peers", "", "Comma-separated list of peer host:ports")
	flag.Parse()

	peers := []string{}
	if *peersFlag != "" {
		for _, p := range strings.Split(*peersFlag, ",") {
			t := strings.TrimSpace(p)
			if t == "" {
				continue
			}
			if !strings.Contains(t, ":") {
				t = "localhost:" + t
			}
			peers = append(peers, t)
		}
	}

	// Create and start Raft node (current API uses StartRaft)
	rn := &raft.RaftNode{ID: *nodeID}
	rn.StartRaft()
	log.Printf("Raft node started with ID: %s, listening on :%s (peers=%v)", *nodeID, *raftPort, peers)

	// Start KV gRPC server
	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", *kvPort))
	if err != nil {
		log.Fatalf("failed to listen on KV gRPC port %s: %v", *kvPort, err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterKVServer(grpcServer, &server{raftNode: rn})

	log.Printf("KV gRPC server listening on :%s", *kvPort)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve KV gRPC: %v", err)
	}
}
