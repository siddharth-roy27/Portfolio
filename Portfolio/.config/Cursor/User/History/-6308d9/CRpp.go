package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"strings"
	"time"

	"github.com/siddharth-roy27/distributed-kv-store/internal/raft"
	"github.com/siddharth-roy27/distributed-kv-store/internal/state_machine"

	"google.golang.org/grpc"

	pb "github.com/siddharth-roy27/distributed-kv-store/proto/kv"
)

// KV gRPC adapter backed by Raft
type server struct {
	pb.UnimplementedKVServer
	raftNode      *raft.RaftNode
	nodeIDToGRPC  map[string]string // Map node ID to gRPC address
	selfGRPCAddr  string            // This node's gRPC address
}

func (s *server) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
	if s.raftNode == nil || s.raftNode.Store == nil {
		return &pb.GetResponse{Found: false}, nil
	}
	v, ok := s.raftNode.Store.Get(req.Key)
	return &pb.GetResponse{Value: v, Found: ok}, nil
}

func (s *server) Set(ctx context.Context, req *pb.SetRequest) (*pb.SetResponse, error) {
	if s.raftNode == nil {
		return &pb.SetResponse{Success: false}, nil
	}
	// If not leader, forward to known leader
	if !s.raftNode.IsLeader() {
		leader := s.raftNode.LeaderAddr()
		if leader == "" {
			return &pb.SetResponse{Success: false}, nil
		}
		// forward using simple gRPC KV client
		conn, err := grpc.Dial(leader, grpc.WithInsecure())
		if err != nil {
			return &pb.SetResponse{Success: false}, nil
		}
		defer conn.Close()
		kc := pb.NewKVClient(conn)
	ctx2, cancel := context.WithTimeout(ctx, 2*time.Second)
		defer cancel()
		resp, err := kc.Set(ctx2, &pb.SetRequest{Key: req.Key, Value: req.Value})
		if err != nil {
			return &pb.SetResponse{Success: false}, nil
		}
		return &pb.SetResponse{Success: resp.Success}, nil
	}

	// If leader, propose the set to Raft
	ok := s.raftNode.ProposeSet(req.Key, req.Value)
	return &pb.SetResponse{Success: ok}, nil
}

func normalizePeers(peersFlag string) []string {
	peers := []string{}
	if peersFlag == "" {
		return peers
	}
	for _, p := range strings.Split(peersFlag, ",") {
		t := strings.TrimSpace(p)
		if t == "" {
			continue
		}
		if !strings.Contains(t, ":") {
			t = "localhost:" + t
		}
		peers = append(peers, t)
	}
	return peers
}

func main() {
	nodeID := flag.String("id", "node1", "Raft node ID")
	raftPort := flag.String("port", "8001", "Raft peer port")
	kvPort := flag.String("grpc-port", "50051", "KV gRPC server port")
	peersFlag := flag.String("peers", "", "Comma-separated list of peer host:ports")
	flag.Parse()

	peers := normalizePeers(*peersFlag)

	// Create Raft node
	rn := &raft.RaftNode{
		ID:    *nodeID,
		Peers: peers,
		Store: state_machine.NewStore(),
	}
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
