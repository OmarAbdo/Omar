---
title: "Understanding Raft, Part 1: Why Consensus Is Hard"
date: "2026-07-16"
description: "Consensus is the problem of getting a cluster of unreliable machines to agree on a single sequence of events. This is the first of a four-part series building up Raft from the ground — the algorithm behind my distributed database, Crystal DB."
category: "computerScience"
tags: ["Distributed Systems", "Raft", "Consensus", "Go", "Crystal DB"]
readTime: "10 min read"
---

## The Problem Nobody Warns You About

You build a service. It stores state. One machine is fine until it isn't — the disk dies, the process crashes, someone trips over a power cable in a datacenter you'll never see. So you run three machines instead of one.

Now you have a much harder problem. Three machines, each with its own copy of the data, need to agree on *what the data is*. Not eventually, not usually — always, even when messages are lost, reordered, or delayed, even when one of the machines vanishes mid-write and comes back an hour later convinced it was right all along.

This is **consensus**, and it is the load-bearing problem underneath almost every serious distributed system: etcd, ZooKeeper, CockroachDB, Kafka's controller, the config plane of Kubernetes. It's also the problem I set out to solve from scratch, in Go, when I built [Crystal DB](https://github.com/OmarAbdo/Crystal) — a distributed key-value store that implements the Raft consensus algorithm end to end.

This series walks through Raft the way I wish someone had walked me through it: as a set of problems, each demanding a specific mechanism, rather than a wall of pseudocode. You need to know programming. You don't need a PhD.

## Replicated State Machines

Start with the mental model every consensus system shares: the **replicated state machine**.

A state machine is anything that takes commands and applies them in order to evolve some state. A key-value store is a state machine: `SET x=3`, then `SET y=1`, then `DELETE x`. Feed the same commands, in the same order, to two identical state machines starting from the same point, and they end in the same state. Determinism does the work.

So the trick to keeping replicas consistent is almost embarrassingly simple to state: **make sure every server applies the same commands in the same order.** If they all execute an identical log of commands, they all reach an identical state.

![Replicated state machine: clients send commands to a consensus module, which replicates an identical log to every server; each server's state machine executes that log in order to reach the same state.](/images/articles/raft-part-1/replicated-state-machine.svg)

*The consensus module's entire job is to keep the replicated log identical across servers. Everything above it — the state machine, the key-value semantics — is downstream of that one guarantee. (Compare Ongaro & Ousterhout 2014, Figure 1.)*

That reframes consensus precisely. The hard part isn't "agree on the current value of `x`." It's **agree on the log** — the ordered sequence of commands — despite failures. Get the log right and consistent state falls out for free.

## Why This Is Genuinely Hard

If networks were reliable and machines never failed, this would be trivial: broadcast each command, everyone appends it, done. The difficulty is entirely in the failure modes.

- **Machines crash and restart.** A server can be part of an agreement, crash before it records the decision durably, and come back with no memory of it.
- **Messages are lost, delayed, and reordered.** You cannot tell a slow machine apart from a dead one. You cannot tell a lost message from a late one.
- **The network partitions.** Half your cluster can talk to each other but not to the other half. Now you have two groups, each tempted to make progress on its own — and if both do, they diverge permanently. This is the failure that eats naive systems alive.

A correct consensus algorithm has to make forward progress whenever a **majority** of servers can talk to each other, and it must *never* produce two conflicting decisions — not even for a moment, not even during a partition, not even if a crashed leader comes back from the dead. "Usually correct" is worthless here; a single divergence is silent data corruption.

## The Majority Trick

The one idea that makes all of this tractable is the **quorum**, specifically the majority.

In a cluster of `2f + 1` servers, any two majorities must share at least one server. Five servers: any group of three overlaps any other group of three in at least one member. That overlap is the entire foundation of safety. If every decision requires a majority, then two conflicting decisions would need two majorities — which would have to share a server, and that shared server would have refused to vote for both. Contradiction. The math quietly forbids divergence.

A practical consequence people miss: a five-server cluster tolerates **two** failures (three still form a majority), and a three-server cluster tolerates **one**. Adding a machine to make an *even* cluster buys you nothing — a four-server cluster still only tolerates one failure, because a majority of four is three. You go from three to five, not three to four. That's why real deployments are almost always odd-sized.

## Paxos, and Why Raft Exists

For decades the canonical answer to consensus was **Paxos**, from Leslie Lamport. Paxos is correct and it is foundational — and it is notoriously, almost comically, hard to understand. The paper introduces the single-decree case, and turning that into a working system that agrees on a whole *sequence* of values (Multi-Paxos) is left largely as an exercise, one that different engineers reconstruct differently.

Ongaro and Ousterhout named this problem directly in their 2014 paper, *In Search of an Understandable Consensus Algorithm*. Their thesis was unusual: they treated **understandability as a first-class design goal**, not a nice-to-have. As they put it, they wanted an algorithm that "should be as easy as possible to understand." Raft is the result — an algorithm engineered to be teachable, so that the people who build on it actually understand what they're building on.

Raft achieves this mainly through **decomposition**. Instead of one tangled protocol, it splits consensus into three parts you can reason about almost independently:

1. **Leader election** — how the cluster picks exactly one server to be in charge, and how it copes when that server dies. *(Part 2.)*
2. **Log replication** — how the leader accepts commands from clients and copies its log to everyone else. *(Part 3.)*
3. **Safety** — the constraints that guarantee the elected leaders and replicated logs can never produce a divergence. *(Woven through Parts 3 and 4.)*

The second big idea is **strong leadership**. In Raft, one server is the leader, and the log flows in exactly one direction: from the leader to the followers, never the other way. Clients talk only to the leader. This is more restrictive than Paxos, and that restriction is the point — it removes whole categories of "what if two servers both think they're in charge" reasoning by making leadership itself the thing the cluster agrees on.

## Where We're Going

By the end of this series you'll understand every moving part of a working Raft implementation, because I'll ground each one in decisions I actually made building Crystal DB:

- **Part 2 — Leader Election.** Terms as a logical clock, the `RequestVote` RPC, and the beautifully simple trick — randomized timeouts — that keeps elections from deadlocking.
- **Part 3 — Log Replication & Safety.** The `AppendEntries` RPC, the Log Matching Property, what "committed" really means, and the subtle commitment rule that trips up every first implementation.
- **Part 4 — Building Crystal.** Turning the paper into Go: a crash-safe write-ahead log, snapshotting for log compaction, and a single-writer control loop that sidesteps a class of concurrency bugs entirely.

Consensus feels like magic until you see it as a sequence of small, forced moves. Let's make the first move.

---

*Series reference: Diego Ongaro and John Ousterhout, "In Search of an Understandable Consensus Algorithm," USENIX Annual Technical Conference (ATC), 2014. Diagrams in this series are my own; where they parallel a figure in the paper, the caption says so. The implementation details come from [Crystal DB](https://github.com/OmarAbdo/Crystal).*
