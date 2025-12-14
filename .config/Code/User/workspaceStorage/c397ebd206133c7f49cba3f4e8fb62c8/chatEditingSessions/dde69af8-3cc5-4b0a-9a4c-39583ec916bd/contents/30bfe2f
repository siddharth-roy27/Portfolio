package raft

import (
	"fmt"
	"math/rand"
	"sync"
	"time"

	"github.com/siddharth-roy27/distributed-kv-store/internal/rpc"
	"github.com/siddharth-roy27/distributed-kv-store/internal/state_machine"
)

type RaftNode struct {
	ID            string
	State         NodeState
	CurrentTerm   int
	VotedFor      string
	Log           []LogEntry
	CommitIndex   int
	LastApplied   int
	ElectionTimer *time.Timer

	Peers []string

	mu     sync.Mutex
	leader string

	Store *state_machine.Store
}

// StartRaft initializes timers and starts election loop
func (rn *RaftNode) StartRaft() {
	rn.mu.Lock()
	if rn.Store == nil {
		rn.Store = state_machine.NewStore()
	}
	rn.State = Follower
	rn.resetElectionTimer()
	rn.mu.Unlock()

	go rn.electionLoop()
}

// Reset the election timer with a random timeout
func (rn *RaftNode) resetElectionTimer() {
	if rn.ElectionTimer != nil {
		rn.ElectionTimer.Stop()
	}
	rn.ElectionTimer = time.NewTimer(randomElectionTimeout())
}

// Generate a random election timeout between 150–300ms
func randomElectionTimeout() time.Duration {
	return time.Duration(150+rand.Intn(150)) * time.Millisecond
}

func (rn *RaftNode) electionLoop() {
	for {
		<-rn.ElectionTimer.C
		rn.startElection()
		rn.resetElectionTimer()
	}
}

// startElection initiates a simple majority-based election
func (rn *RaftNode) startElection() {
	rn.mu.Lock()
	rn.CurrentTerm++
	rn.VotedFor = rn.ID
	rn.mu.Unlock()

	votes := 1
	var wg sync.WaitGroup
	voteCh := make(chan bool, len(rn.Peers))

	for _, p := range rn.Peers {
		wg.Add(1)
		go func(peerAddr string) {
			defer wg.Done()
			pc, err := NewPeerClient(peerAddr)
			if err != nil {
				voteCh <- false
				return
			}
			defer pc.Close()
			// lastLogIndex/term are simplified as 0 for now
			resp, err := pc.RequestVote(rn.CurrentTerm, rn.ID, len(rn.Log), 0)
			if err != nil {
				voteCh <- false
				return
			}
			voteCh <- resp.VoteGranted
		}(p)
	}

	// collect votes with timeout
	go func() {
		wg.Wait()
		close(voteCh)
	}()

	for granted := range voteCh {
		if granted {
			votes++
		}
	}

	if votes > (len(rn.Peers)+1)/2 {
		// become leader
		rn.mu.Lock()
		rn.State = Leader
		rn.leader = rn.ID
		rn.mu.Unlock()
		go rn.leaderLoop()
	}
}

func (rn *RaftNode) leaderLoop() {
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()
	for {
		rn.mu.Lock()
		if rn.State != Leader {
			rn.mu.Unlock()
			return
		}
		rn.mu.Unlock()

		// send heartbeats
		for _, p := range rn.Peers {
			go func(peerAddr string) {
				pc, err := NewPeerClient(peerAddr)
				if err != nil {
					return
				}
				defer pc.Close()
				// send empty AppendEntries as heartbeat
				_, _ = pc.AppendEntries(rn.CurrentTerm, rn.ID, len(rn.Log)-1, 0, []LogEntry{}, rn.CommitIndex)
			}(p)
		}

		<-ticker.C
	}
}

// ProposeSet appends a Set command to the log and tries to replicate it to peers.
// Returns true if the entry was committed (majority replicated).
func (rn *RaftNode) ProposeSet(key, value string) bool {
	rn.mu.Lock()
	if rn.State != Leader {
		rn.mu.Unlock()
		return false
	}
	entry := LogEntry{Term: rn.CurrentTerm, Command: fmt.Sprintf("set:%s:%s", key, value)}
	rn.Log = append(rn.Log, entry)
	index := len(rn.Log) - 1
	rn.mu.Unlock()

	successes := 1
	var mu sync.Mutex
	var wg sync.WaitGroup

	for _, p := range rn.Peers {
		wg.Add(1)
		go func(peerAddr string) {
			defer wg.Done()
			pc, err := NewPeerClient(peerAddr)
			if err != nil {
				return
			}
			defer pc.Close()
			prevIndex := index - 1
			prevTerm := 0
			if prevIndex >= 0 {
				rn.mu.Lock()
				prevTerm = rn.Log[prevIndex].Term
				rn.mu.Unlock()
			}
			_, err = pc.AppendEntries(rn.CurrentTerm, rn.ID, prevIndex, prevTerm, []LogEntry{entry}, rn.CommitIndex)
			if err == nil {
				mu.Lock()
				successes++
				mu.Unlock()
			}
		}(p)
	}
	wg.Wait()

	if successes > (len(rn.Peers)+1)/2 {
		rn.mu.Lock()
		rn.CommitIndex = index
		rn.mu.Unlock()
		rn.applyLog(index)
		return true
	}
	return false
}

func (rn *RaftNode) applyLog(index int) {
	rn.mu.Lock()
	if index > rn.LastApplied {
		entry := rn.Log[index]
		rn.LastApplied = index
		rn.mu.Unlock()
		// apply to state machine
		if rn.Store != nil {
			if cmd, ok := entry.Command.(string); ok {
				rn.Store.Apply(cmd)
			}
		}
		return
	}
	rn.mu.Unlock()
}

// ---------------- Raft RPCs ---------------- //

// Handle RequestVote RPC
func (rn *RaftNode) RequestVote(args *rpc.RequestVoteArgs, reply *rpc.RequestVoteReply) {
	reply.VoteGranted = false
	rn.mu.Lock()
	defer rn.mu.Unlock()
	if args.Term < rn.CurrentTerm {
		reply.Term = int32(rn.CurrentTerm)
		return
	}
	// grant vote if haven’t voted or voted for candidate
	if rn.VotedFor == "" || rn.VotedFor == args.CandidateID {
		rn.VotedFor = args.CandidateID
		reply.VoteGranted = true
		rn.CurrentTerm = args.Term
	}
	reply.Term = int32(rn.CurrentTerm)
}

// Handle AppendEntries RPC (heartbeat + log replication)
func (rn *RaftNode) AppendEntries(args *rpc.AppendEntriesArgs, reply *rpc.AppendEntriesReply) {
	reply.Success = false
	rn.mu.Lock()
	defer rn.mu.Unlock()
	if args.Term < rn.CurrentTerm {
		reply.Term = int32(rn.CurrentTerm)
		return
	}
	// reset election timer on heartbeat
	rn.resetElectionTimer()
	rn.CurrentTerm = args.Term
	rn.leader = args.LeaderID
	reply.Success = true
	reply.Term = int32(rn.CurrentTerm)

	// append entries (simple append, no conflict resolution)
	for _, e := range args.Entries {
		rn.Log = append(rn.Log, LogEntry{Term: int(e.Term), Command: e.Command})
	}
	// update commit index and apply newly committed entries
	if args.LeaderCommit > int32(rn.CommitIndex) {
		rn.CommitIndex = int(args.LeaderCommit)
	}
	// apply any unapplied entries up to commit index
	for rn.LastApplied < rn.CommitIndex {
		rn.LastApplied++
		entry := rn.Log[rn.LastApplied]
		if cmd, ok := entry.Command.(string); ok {
			if rn.Store != nil {
				rn.Store.Apply(cmd)
			}
		}
	}
}
