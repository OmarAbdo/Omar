---
title: "Understanding Raft, Part 2: Leader Election"
date: "2026-07-16"
description: "How a Raft cluster elects exactly one leader — and how it recovers when that leader dies. Terms as a logical clock, the RequestVote RPC, and the elegant randomized-timeout trick that breaks split votes."
category: "computerScience"
tags: ["Distributed Systems", "Raft", "Leader Election", "Consensus", "Go"]
readTime: "11 min read"
---

## One Leader, No Exceptions

In [Part 1](/articles/raft-part-1-why-consensus-is-hard) we reduced consensus to a single goal: keep an identical, ordered log on every server. Raft's central design choice is that a **single leader** owns that log. Clients send commands only to the leader; the leader appends them and copies them outward. Followers are passive — they answer RPCs and otherwise wait.

That makes the whole system's correctness depend on one thing: **at any moment, there is at most one leader that matters.** If two servers ever act as leader for the same slice of time and both accept commands, the logs diverge and we've lost. So the election mechanism has to guarantee — through crashes, partitions, and delayed messages — that we never get two legitimate leaders at once.

This part is how Raft pulls that off.

## The Three States

Every server is always in exactly one of three states, and the transitions between them are the entire life of the protocol.

![Raft server states: a server starts as a Follower, becomes a Candidate on election timeout, becomes Leader on winning a majority, and any server steps down to Follower when it sees a higher term.](/images/articles/raft-part-2/server-states.svg)

*State transitions in Raft. A follower that stops hearing from a leader becomes a candidate; a candidate that wins a majority becomes leader; any server that learns of a higher term immediately reverts to follower. (Compare Ongaro & Ousterhout 2014, Figure 4.)*

- **Follower.** The default. Does nothing on its own; responds to the leader and to candidates. If it goes too long without hearing from a leader, it suspects the leader is dead and promotes itself.
- **Candidate.** A follower that has decided to try to become leader. It starts an election and asks everyone for votes.
- **Leader.** Won an election. Serves clients and sends periodic heartbeats to assert "I'm still alive," which keep followers from starting their own elections.

## Terms: A Logical Clock

Here's the idea that makes elections safe without any synchronized wall clock: **terms**.

Raft chops time into consecutive numbered **terms**. Each term begins with an election. If someone wins, they're leader for the rest of that term. If the election is a split vote and nobody wins, the term ends leaderless and the cluster rolls straight into the next term with a fresh election.

![Raft time divided into numbered terms: each begins with an election; some terms elect a leader and run normally, while a term with a split vote ends with no leader and advances to the next term.](/images/articles/raft-part-2/terms-timeline.svg)

*Terms are a monotonically increasing integer — a logical clock. Term numbers, not timestamps, are how servers decide whose information is current. (Compare Ongaro & Ousterhout 2014, Figure 5.)*

The term number is a monotonically increasing integer that every server tracks. It rides along in **every** RPC, and it drives one rule that quietly does an enormous amount of work:

> If a server receives any message with a term **higher** than its own, it updates to that term and immediately becomes a follower.

> If a server receives any message with a term **lower** than its own, it rejects it.

Think about what the first rule buys you. A leader gets partitioned away, the rest of the cluster elects a new leader in a higher term, and eventually the old leader reconnects. The instant it exchanges a single message with anyone from the new term, it sees the higher number and **steps down on its own** — no special "you've been deposed" protocol needed. A stale leader can't do damage because the first contact with the present demotes it. Terms are how the cluster agrees on *when* it is, and staleness becomes self-correcting.

## The Election

An election starts when a follower's **election timeout** fires — it hasn't heard from a valid leader in a while. The follower:

1. Increments its current term (entering a new term).
2. Transitions to **candidate** and votes for itself.
3. Sends a `RequestVote` RPC to every other server.

Each server grants **at most one vote per term**, first-come-first-served (subject to a log-freshness check we'll get to in Part 3). One vote per term is the safety linchpin. Because a candidate needs a **majority** to win, and every server hands out only one vote per term, two candidates can't both assemble a majority in the same term — that would require some server to have voted twice. The quorum-overlap argument from Part 1, applied to votes.

Three things can happen to a candidate:

- **It wins** — receives votes from a majority. It becomes leader and immediately sends heartbeats to stop any other elections.
- **Someone else wins** — while waiting, it gets an `AppendEntries` from a server claiming to be leader for a term ≥ its own. It accepts that leader and returns to follower.
- **Nobody wins** — the votes split, the timeout fires again, and it starts a fresh election in yet another new term.

## The Split-Vote Problem

That third outcome is the tricky one. Suppose several followers time out at nearly the same moment. They all become candidates, all in the same new term, all voting for themselves and begging others for votes. The votes fragment — nobody reaches a majority. Everyone times out again, and if they *again* time out together, they split *again*. The cluster can livelock: perpetually holding elections, never electing anyone, serving no clients.

Raft's fix is almost startling in how little it costs: **randomized election timeouts.**

Instead of a fixed timeout, each server picks its election timeout **randomly** from a range — say 150–300 ms. Now the followers almost never fire at the same instant. One of them times out first, becomes a candidate, and collects votes from the others *before they've timed out at all*. It wins the term outright. In the rare case of a split, each server re-randomizes its timeout for the next attempt, so a repeat collision is unlikely, and it gets less likely every round.

That's it. No priorities, no coordinator, no tie-break election-of-electors. A single line of randomness converts a potential livelock into a system that reliably settles on one leader in a couple of round-trips. The paper's own evaluation shows that with a sensible timeout range the cluster elects a leader well within a second, and the authors are candid that they explored more complex schemes before concluding randomization "conflicts the least" with Raft's understandability goal. It's the most quietly brilliant trick in the algorithm.

## Timeout Ranges Matter in Practice

The randomization only helps if the range is chosen well relative to the network. The rule of thumb from the paper is a timing inequality worth internalizing:

```
broadcastTime  ≪  electionTimeout  ≪  MTBF
```

- **broadcastTime** — how long a round-trip RPC to the cluster takes (often well under a millisecond in a datacenter).
- **electionTimeout** — your randomized range (say 150–300 ms).
- **MTBF** — mean time between failures of a single server (months).

The election timeout must be an order of magnitude larger than broadcast time, or followers will start needless elections faster than heartbeats can reassure them — the cluster thrashes. And it must be far smaller than MTBF, or you'll spend a meaningful fraction of your uptime leaderless after a crash. There's a comfortable window of several orders of magnitude, but pick outside it and a "correct" implementation still behaves badly. When I tuned Crystal's timeouts, this inequality was the thing I kept coming back to.

## What Election Alone Doesn't Solve

Now we can elect a single leader and re-elect one whenever the current leader dies, all without conflicts. But election only decides **who's in charge** — it says nothing about the *contents* of the log. A newly elected leader might be missing entries that a majority already agreed on, or carry entries that were never committed.

Making sure the right server can become leader — and that once it does, the logs converge correctly and safely — is the subject of [Part 3](/articles/raft-part-3-log-replication-and-safety), where the real subtlety of Raft lives.

---

*Series reference: Diego Ongaro and John Ousterhout, "In Search of an Understandable Consensus Algorithm," USENIX Annual Technical Conference (ATC), 2014. Diagrams are my own; captions note where they parallel a figure in the paper. Implementation details from [Crystal DB](https://github.com/OmarAbdo/Crystal).*
