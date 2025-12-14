package raft

import (
    "time"
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
}

// StartRaft initializes timers and starts election loop
func (rn *RaftNode) StartRaft() {
    rn.State = Follower
    rn.resetElectionTimer()
}

func (rn *RaftNode) resetElectionTimer() {
    rn.ElectionTimer = time.NewTimer(randomElectionTimeout())
}

func randomElectionTimeout() time.Duration {
    return time.Duration(150+rand.Intn(150)) * time.Millisecond
}
