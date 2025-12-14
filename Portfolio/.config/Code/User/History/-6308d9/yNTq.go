package main

import (
	"context"
	"flag"
	"log"
	"net"
	"strings"
	"time"

	"google.golang.org/grpc"

	pb "github.com/siddharth-roy27/distributed-kv-store/proto/kv"
	raftpb "github.com/siddharth-roy27/distributed-kv-store/proto/raft"
	"github.com/siddharth-roy27/distributed-kv-store/internal/raft"
)

// In-memory KV store (simple)
var store = make(map[string]string)

type server struct {
	pb.UnimplementedKVServer
	raftNode *raft.RaftNode
}

func (s *server) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
	value, ok := store[req.Key]
	return &pb.GetResponse{Value: value, Found: ok}, nil
}

func (s *server) Set(ctx context.Context, req *pb.SetRequest) (*pb.SetResponse, error) {
	// TODO: route via leader. For now we write locally (useful for testing)
	store[req.Key] = req.Value
	return &pb.SetResponse{Success: true}, nil
}

func main() {
	// parse flags
	id := flag.String("id", "node1", "node id")
	raftPort := flag.String("raft-port", "8001", "Raft peer port")
	kvPort := flag.String("grpc-port", "50051", "KV gRPC port")
	peers := flag.String("peers", "", "comma-separated list of peer addresses (host:port or port)")
	flag.Parse()

	// Normalize peer addresses: allow "8002" or "host:8002"
	peerAddrs := []string{}
	if *peers != "" {
		for _, p := range strings.Split(*peers, ",") {
			trim := strings.TrimSpace(p)
			if trim == "" {
				continue
			}
			if !strings.Contains(trim, ":") {
				trim = "localhost:" + trim
			}
			peerAddrs = append(peerAddrs, trim)
		}
	}

	kvAddr := ":" + *kvPort
	raftAddr := ":" + *raftPort

	// Create Raft node
	rn := &raft.RaftNode{ID: *id}
	rn.StartRaft()
	log.Printf("Raft node started with ID: %s", rn.ID)

	// Optionally create clients to peers (non-blocking)
	for _, p := range peerAddrs {
		go func(peerAddr string) {
			// try to connect with retries
			for i := 0; i < 5; i++ {
				pc, err := raft.NewPeerClient(peerAddr)
				if err == nil {
					// you may want to save pc into rn.peers map for use during elections
					log.Printf("Connected to peer %s", peerAddr)
					_ = pc // TODO: store
					return
				}
				log.Printf("failed to connect to peer %s: %v (retrying)", peerAddr, err)
				time.Sleep(500 * time.Millisecond)
			}
			log.Printf("giving up connecting to peer %s", peerAddr)
		}(p)
	}

	// Start KV gRPC server on kvAddr
	lisKV, err := net.Listen("tcp", kvAddr)
	if err != nil {
		log.Fatalf("failed to listen for KV gRPC on %s: %v", kvAddr, err)
	}
	kvServer := grpc.NewServer()
	pb.RegisterKVServer(kvServer, &server{raftNode: rn})

	// Start Raft gRPC server on raftAddr
	lisRaft, err := net.Listen("tcp", raftAddr)
	if err != nil {
		log.Fatalf("failed to listen for Raft on %s: %v", raftAddr, err)
	}
	raftServer := grpc.NewServer()
	raftService := raft.NewRaftService(rn)
	raftpb.RegisterRaftServer(raftServer, raftService)

	log.Printf("Node %s KV gRPC listening on %s; Raft listening on %s (peers=%v)", *id, kvAddr, raftAddr, peerAddrs)

	// Serve both servers concurrently: kv in goroutine, raft in main goroutine
	go func() {
		if err := kvServer.Serve(lisKV); err != nil {
			log.Fatalf("KV gRPC server failed: %v", err)
		}
	}()

	if err := raftServer.Serve(lisRaft); err != nil {
		log.Fatalf("Raft gRPC server failed: %v", err)
	}
}
package main

import (
	"context"
	"flag"
	"log"
	"net"
	"strings"
	"time"
	"strconv"

	"google.golang.org/grpc"

	pb "github.com/siddharth-roy27/distributed-kv-store/proto/kv"
	raftpb "github.com/siddharth-roy27/distributed-kv-store/proto/raft"
	"github.com/siddharth-roy27/distributed-kv-store/internal/raft"
)

// In-memory KV store (simple)
var store = make(map[string]string)

type server struct {
	pb.UnimplementedKVServer
	raftNode *raft.RaftNode
}

func (s *server) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
	value, ok := store[req.Key]
	return &pb.GetResponse{Value: value, Found: ok}, nil
}

func (s *server) Set(ctx context.Context, req *pb.SetRequest) (*pb.SetResponse, error) {
	// TODO: route via leader. For now we write locally (useful for testing)
	store[req.Key] = req.Value
	return &pb.SetResponse{Success: true}, nil
}

func main() {
	// parse flags
	id := flag.String("id", "node1", "node id")
	port := flag.Int("port", 50051, "gRPC port to listen on")
	peers := flag.String("peers", "", "comma-separated list of peer addresses (host:port)")
	flag.Parse()

	peerAddrs := []string{}
	if *peers != "" {
		for _, p := range strings.Split(*peers, ",") {
			trim := strings.TrimSpace(p)
			if trim != "" {
				peerAddrs = append(peerAddrs, trim)
			}
	
	// In-memory KV store (simple)
	var store = make(map[string]string)
	
	type server struct {
		pb.UnimplementedKVServer
		raftNode *raft.RaftNode
	}
	
	func (s *server) Get(ctx context.Context, req *pb.GetRequest) (*pb.GetResponse, error) {
		value, ok := store[req.Key]
		return &pb.GetResponse{Value: value, Found: ok}, nil
	}
	
	func (s *server) Set(ctx context.Context, req *pb.SetRequest) (*pb.SetResponse, error) {
		// TODO: route via leader. For now we write locally (useful for testing)
		store[req.Key] = req.Value
		return &pb.SetResponse{Success: true}, nil
	}
		}
	}

	addr := ":" + strconv.Itoa(*port)
		raftPort := flag.String("raft-port", "8001", "Raft peer port")
		kvPort := flag.String("grpc-port", "50051", "KV gRPC port")
	// Create Raft node
	rn := &raft.RaftNode{ID: *id}
	rn.StartRaft()
	log.Printf("Raft node started with ID: %s", rn.ID)

	// Optionally create clients to peers (non-blocking)
	for _, p := range peerAddrs {
		go func(peerAddr string) {
			// try to connect with retries
			for i := 0; i < 5; i++ {
				pc, err := raft.NewPeerClient(peerAddr)
				if err == nil {
					// you may want to save pc into rn.peers map for use during elections
		kvAddr := ":" + *kvPort
		raftAddr := ":" + *raftPort
					_ = pc // TODO: store
					return
				}
				log.Printf("failed to connect to peer %s: %v (retrying)", peerAddr, err)
				time.Sleep(500 * time.Millisecond)
			}
			log.Printf("giving up connecting to peer %s", peerAddr)
		}(p)
	}

	// Start listening
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	// Register KV service
	pb.RegisterKVServer(grpcServer, &server{raftNode: rn})

	// Register Raft service (so other nodes can call us)
	raftService := raft.NewRaftService(rn)
	raftpb.RegisterRaftServer(grpcServer, raftService)

	log.Printf("Node %s listening on %s (peers=%v)", *id, addr, peerAddrs)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
