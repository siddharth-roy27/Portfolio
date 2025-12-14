package main

import (
    "context"
    "flag"
    "log"
    "time"

    "google.golang.org/grpc"
    pb "github.com/siddharth-roy27/distributed-kv-store/proto/kv"
)

func main() {
    target := flag.String("target", "localhost:50051", "KV gRPC server address")
    flag.Parse()

    conn, err := grpc.Dial(*target, grpc.WithInsecure(), grpc.WithBlock())
    if err != nil {
        log.Fatalf("failed to connect to KV server: %v", err)
    }
    defer conn.Close()

    client := pb.NewKVClient(conn)

    // Example: Set key
    ctx, cancel := context.WithTimeout(context.Background(), time.Second)
    defer cancel()
    setResp, err := client.Set(ctx, &pb.SetRequest{Key: "name", Value: "Siddharth"})
    if err != nil {
        log.Fatalf("Set RPC failed: %v", err)
    }
    log.Printf("Set Success: %v", setResp.Success)

    // Example: Get key
    ctx2, cancel2 := context.WithTimeout(context.Background(), time.Second)
    defer cancel2()
    getResp, err := client.Get(ctx2, &pb.GetRequest{Key: "name"})
    if err != nil {
        log.Fatalf("Get RPC failed: %v", err)
    }
    log.Printf("Get Response: key=%s, value=%s, found=%v", "name", getResp.Value, getResp.Found)
}
