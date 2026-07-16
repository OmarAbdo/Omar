---
title: "Understanding Raft, Part 4: Building Crystal in Go"
date: "2026-07-16"
description: "Turning the Raft paper into a running database. Inside Crystal DB: a crash-safe write-ahead log, snapshotting for log compaction, the InstallSnapshot RPC, and the single-writer control loop that makes concurrency tractable."
category: "backend"
tags: ["Distributed Systems", "Raft", "Go", "Crystal DB", "Databases"]
readTime: "12 min read"
---

## The Gap Between Paper and Production

The first three parts of this series built up Raft as an algorithm: [why consensus is hard](/articles/raft-part-1-why-consensus-is-hard), [leader election](/articles/raft-part-2-leader-election), and [replication and safety](/articles/raft-part-3-log-replication-and-safety). The paper is unusually complete — but it describes an idealized machine: an in-memory log that never loses data and grows forever. Real hardware offers neither.

[Crystal DB](https://github.com/OmarAbdo/Crystal) is my from-scratch implementation of Raft in Go, wrapped around a replicated key-value store. This part is about the four problems that only show up when you actually build the thing: **durability**, **unbounded log growth**, **bringing hopelessly-behind followers up to speed**, and **concurrency**. Each maps to a concrete piece of the system.

![Crystal DB architecture: an HTTP layer feeds a single-writer Raft control loop that persists to a crash-safe write-ahead log and drives per-peer replication goroutines; committed entries apply to a pluggable state machine, and snapshots compact the log.](/images/articles/raft-part-4/crystal-architecture.svg)

*Crystal's structure. Dependencies point one way: the storage layer imports Raft; Raft never imports HTTP or the key-value layer. That lets the consensus core be tested and reasoned about in isolation.*

## Problem 1 — Durability: The Write-Ahead Log

Raft's safety proof assumes that when a server records something — its current term, who it voted for, a log entry — that fact survives a crash. In memory, it doesn't. If a server appends an entry, tells the leader "got it," then crashes and forgets, the majority that "committed" the entry was a lie, and safety unravels.

So certain state **must** hit stable storage (with an `fsync`) *before* the server acts on it:

- `currentTerm` and `votedFor` — or a rebooted server could vote twice in one term, breaking election safety.
- Every log entry — before it's acknowledged to the leader.

Crystal handles this with a **write-ahead log**: entries are serialized and appended to a file, and `fsync` forces them to disk before the RPC is acknowledged. On startup, the server replays the WAL to reconstruct its log and term state exactly as they were. The word *ahead* is the contract — the durable record is written **ahead** of any action that depends on it. This is the same discipline a single-node database uses for ACID durability; here it's also what makes the distributed safety argument true instead of aspirational.

The cost is real: an `fsync` per commit is often the throughput ceiling for a Raft system. Batching multiple entries into one `fsync` is the standard optimization, and it's where a lot of production Raft tuning goes.

## Problem 2 — Log Growth: Snapshotting

The replicated log only ever grows. A system taking writes for months would accumulate a log too large to store and far too slow to replay on restart. And most of it is dead weight: once `SET x=3` is followed by `SET x=9`, the first entry's *effect* is gone — only the current state matters.

The answer is **snapshotting** (the paper's §7). Periodically, a server writes the current state of its state machine to a snapshot — "as of index N, the store is `{x:9, y:1}`" — and then **discards every log entry up to and including N**. The snapshot records the last included index and term so the log can still be continued correctly after it.

This collapses the two problems into one artifact: startup gets fast (load a snapshot, replay only the short tail after it) and the log stays bounded. Crystal takes snapshots on a size threshold and truncates the WAL behind them. The one subtlety: a server must keep enough metadata (that last-included index and term) to satisfy the `AppendEntries` consistency check for the entry right after the snapshot boundary — otherwise a follower one step behind can't be repaired.

## Problem 3 — Hopeless Followers: InstallSnapshot

Snapshotting creates a new problem. Normally a leader repairs a lagging follower by backing up `nextIndex` and resending missing entries. But what if the entries the follower needs have already been **snapshotted away** on the leader? The leader literally no longer has them to send.

For this, Raft adds the `InstallSnapshot` RPC. Instead of shipping individual entries, the leader sends its **entire snapshot** to a follower that's fallen behind the leader's log start. The follower installs it wholesale, replacing its state, and resumes normal `AppendEntries` from the snapshot's boundary. Crystal implements this as the catch-up path for a peer whose `nextIndex` has fallen before the first index the leader still retains. It's the mechanism that lets a brand-new or long-dead node rejoin and converge without the leader keeping history forever.

## Problem 4 — Concurrency: The Single-Writer Loop

This is the design decision I'm most glad I made, and it's the one the paper doesn't dictate.

A Raft node is a storm of concurrent events: client requests, `AppendEntries` from a leader, `RequestVote` from candidates, replication replies from followers, election and heartbeat timers all firing. Every one of them wants to read and modify the same core state — `currentTerm`, `votedFor`, the log, `commitIndex`, the role. The obvious approach is a mutex around all of it. The obvious approach is also a reliable source of deadlocks, forgotten-lock races, and reasoning you can't hold in your head — exactly the bugs consensus code can least afford, because they surface as silent divergence.

Crystal instead uses a **single-writer control loop**: one goroutine, and *only* that goroutine, owns the core Raft state. Everything else — HTTP handlers, RPC receivers, timers — doesn't touch state directly. It sends a message down a channel to the control loop, which processes events one at a time in a `select`:

```go
for {
    select {
    case rpc := <-n.rpcCh:        // AppendEntries / RequestVote
        n.handleRPC(rpc)
    case cmd := <-n.proposeCh:    // client command
        n.appendToLog(cmd)
    case reply := <-n.replyCh:    // replication result from a peer
        n.handleReplyAndAdvanceCommit(reply)
    case <-n.electionTimer.C:
        n.startElection()
    case <-n.heartbeatTimer.C:
        n.broadcastAppendEntries()
    }
}
```

Because state mutation happens in exactly one place, sequentially, **there are no data races on the core state — by construction, not by careful locking.** The safety rules from Part 3 (the commitment rule, the term checks, the vote restriction) each become a plain, single-threaded function that reads and writes fields directly, with no lock ceremony. Per-peer *replication* still runs in its own goroutines for throughput — but those goroutines only ever hand results *back* to the loop; they never mutate shared state themselves. The concurrency lives at the edges; the truth lives in one place. This is the actor pattern applied where it earns its keep, and it turned "how do I not deadlock" into a non-question.

## Testing: Pinning Reality, Not Hope

Consensus code is worthless if you can't trust it, and you can't trust distributed code you've only tested on the happy path. Crystal is verified at two levels:

- **Fast unit tests** target the invariants directly: a candidate with a stale log loses the vote; a message with a higher term forces a step-down; the commitment rule refuses to count an old-term entry.
- **Integration tests spin up a real multi-node cluster** and inject the failures that matter — kill the leader mid-write and assert a new one is elected and no committed data is lost; partition a follower and assert it converges when healed; force a snapshot and assert a lagging node catches up via `InstallSnapshot`.

That second suite is the one that matters. It's the difference between "passes the tests I thought of" and "survives leader failure and preserves data," which is the only property anyone actually wants from this thing.

## What Building It Taught Me

Reading the Raft paper, I understood it. Building Crystal, I *believed* it — because every place I tried to cut a corner, the algorithm punished me with exactly the failure it was designed to prevent. Skip the `fsync` and a crash eats a "committed" write. Use the naive commit rule and a killed-leader test overwrites committed data — Figure 8, live, in my own terminal. The paper's restrictions stop feeling arbitrary the moment your integration suite fails without them.

That's the real reason to implement a paper instead of just reading it. Understanding is passive and forgiving; a running system is not. If you want to genuinely know how consensus works, don't take my word for it — [go read Crystal](https://github.com/OmarAbdo/Crystal), or better, build your own. The paper is only 18 pages, and it was written, unusually and generously, to be understood.

---

*Series reference: Diego Ongaro and John Ousterhout, "In Search of an Understandable Consensus Algorithm," USENIX Annual Technical Conference (ATC), 2014 — persistence and compaction draw on §5 and §7. Diagrams are my own. This concludes the four-part series; the implementation is [Crystal DB](https://github.com/OmarAbdo/Crystal).*
