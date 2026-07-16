---
title: "Understanding Raft, Part 3: Log Replication & Safety"
date: "2026-07-16"
description: "The heart of Raft: how a leader replicates its log with the AppendEntries RPC, what 'committed' really means, the Log Matching Property, and the subtle commitment rule that every first implementation gets wrong."
category: "computerScience"
tags: ["Distributed Systems", "Raft", "Replication", "Consensus", "Go"]
readTime: "13 min read"
---

## From Who to What

[Part 2](/articles/raft-part-2-leader-election) gave us a single elected leader. Now the leader has to do its job: take commands from clients and get them onto every server's log, identically and durably, so that the replicated state machines stay in lockstep. This is **log replication**, and buried inside it are the safety properties that make Raft *correct* rather than merely functional. This is the part worth reading twice.

## The Shape of the Log

Each log entry holds three things: the **command** for the state machine, the **term** in which the leader created it, and its **index** (position in the log). The term stamped into each entry turns out to be load-bearing — it's how servers detect and repair inconsistencies.

![Raft log across a leader and two followers: each entry stores a term and a command; entries replicated on a majority are committed; a lagging follower is missing recent entries and will catch up.](/images/articles/raft-part-3/log-structure.svg)

*Logs on three servers. Each cell is `term · command`. Entries stored on a majority are committed and safe to apply; Follower 3 has fallen behind and will be brought current by the leader. (Compare Ongaro & Ousterhout 2014, Figure 6.)*

The normal path is simple. A client sends a command; the leader appends it as a new entry; the leader sends `AppendEntries` RPCs to the followers to replicate it. Once the entry is stored on a **majority**, the leader marks it **committed**, applies it to its own state machine, and replies to the client. Followers learn the entry is committed on later RPCs and apply it to their own state machines in turn. Same commands, same order, same state.

The interesting engineering is entirely in the abnormal path: followers that crashed, fell behind, or accumulated entries a previous leader never committed. Raft repairs all of it through one RPC and one property.

## AppendEntries and the Consistency Check

`AppendEntries` is deliberately more than "here's a new entry." Every such RPC also carries the **index and term of the entry immediately preceding** the new ones (`prevLogIndex`, `prevLogTerm`). The follower will only accept the new entries if its own log contains a matching entry at `prevLogIndex` with `prevLogTerm`. Otherwise it **rejects** the request.

![The AppendEntries consistency check: the leader sends the index and term of the preceding entry; if the follower has no matching entry there it rejects, and the leader decrements nextIndex and retries until the logs converge.](/images/articles/raft-part-3/append-entries-check.svg)

*The consistency check. A follower accepts new entries only if the entry just before them matches in index and term; otherwise it rejects, and the leader backs up and retries. (Compare Ongaro & Ousterhout 2014, Figure 7 scenarios.)*

This little check is doing something profound by **induction**. When a leader first becomes leader, its logs and the followers' agree up to some point. Every `AppendEntries` that succeeds preserves the invariant that the follower's log matches the leader's up through the new entries — because the RPC verified the entry right before them already matched, and an empty log trivially matches at the start. So the property holds by induction on every successful call. This gives Raft the **Log Matching Property**:

> If two logs contain an entry with the same index and term, then the logs are **identical in all entries up through that index**.

Two consequences, both strong. Same index and same term ⇒ same command (a leader creates at most one entry per index per term, and entries never move). And matching at some position ⇒ matching for the *entire prefix* before it. One point of agreement certifies the whole history behind it. That is why a single (index, term) check per RPC is enough to police the entire log.

## Repairing a Divergent Follower

When a follower rejects because of a mismatch, the leader simply **decrements** its `nextIndex` for that follower and retries `AppendEntries` with an earlier preceding entry. It keeps backing up until it finds the last point where the two logs agree. From there it ships every entry the follower is missing, **overwriting** any conflicting tail the follower had.

That overwrite is safe — and this is the part that unsettles people at first — because of what "committed" guarantees, which we're about to pin down. Entries a leader force-overwrites on a follower were, by construction, never committed, so no state machine ever applied them and no client was ever told they succeeded. The leader's log is the authority; followers are made to match it. It's blunt, and it works.

## What "Committed" Actually Means

"Stored on a majority" is the *usual* commit condition, but stated that baldly it hides a genuine trap. Consider the danger: an entry is replicated to a majority, but before the leader can commit it, that leader crashes. A new leader is elected. Could the entry get **overwritten** even though it once sat on a majority? If yes, a client might have been told nothing (fine), but worse, a *committed* entry could vanish — catastrophe.

Raft closes this with two coupled rules. The first constrains **who may become leader** (the election restriction). The second constrains **what a leader may declare committed** (the commitment rule).

### Rule 1 — Only an up-to-date candidate can win

Remember the "log-freshness check" I deferred in Part 2. When a server receives a `RequestVote`, it refuses its vote unless the candidate's log is **at least as up-to-date** as its own. "Up-to-date" is defined precisely: compare the term of the last entry first; if equal, compare log length. A candidate whose last entry is from an older term — or is shorter at the same term — loses the vote.

Because winning requires a majority, and every entry that was committed lives on a majority, the winner's log must overlap that majority in at least one server — and the freshness check guarantees the winner is at least as current as that server. So **any server that can win an election already holds every committed entry.** The election restriction and the quorum overlap together mean a newly elected leader can never be missing committed data. This is the **Leader Completeness Property**, and it's the keystone of Raft's safety.

### Rule 2 — A leader only commits entries from its own term

Here's the rule that every first implementation gets wrong, including nearly everyone who codes Raft from the paper without reading §5.4.2 carefully. It is tempting to say: "the moment an entry is on a majority, commit it." That is **wrong**, and the paper devotes its famous Figure 8 to exactly why.

The scenario: an entry from an *older* term sits replicated on a majority, but was never committed. A leader shows up, sees it on a majority, and — using the naive rule — commits it. Then that leader crashes, and a *different* server, one that didn't have the entry but has a fresher log by the freshness test, legitimately wins the next election and overwrites it. An entry that was "committed" gets erased. Safety violated.

Raft's fix is a restriction that sounds arbitrary until you've stared at Figure 8:

> A leader may only mark an entry committed by counting replicas if the entry is **from the leader's current term**.

Older entries become committed only **indirectly** — carried along once an entry from the current term commits above them (which, by the Log Matching Property, pulls the whole prefix with it). So a new leader appends a fresh no-op-like entry in its own term as soon as it takes power; committing *that* under Rule 2 retroactively commits everything before it that belongs on the log. The counting rule plus "current term only" is the precise line between an entry that's merely *replicated* and one that's *committed and permanent*.

## The Safety Argument, Assembled

Step back and the pieces lock together:

- **Election safety** — one vote per term + majority ⇒ at most one leader per term. *(Part 2.)*
- **Log Matching** — the per-RPC consistency check ⇒ any two logs agreeing at a point agree on the whole prefix.
- **Leader Completeness** — the vote's freshness restriction ⇒ every elected leader already has all committed entries.
- **The commitment rule** — commit-by-count only for current-term entries ⇒ a committed entry can never be overwritten by a future leader.

Chain them and you get the property the whole system exists to provide — the **State Machine Safety Property**: if any server has applied a log entry at a given index to its state machine, no other server will ever apply a *different* entry at that index. Every replica walks the same log in the same order, forever. That is consistency, earned rather than assumed.

## Next: Making It Real

We now have the complete logical algorithm — election, replication, and the safety rules binding them. But a paper algorithm assumes an in-memory log that never loses data and never grows without bound. A real database on real disks has neither luxury.

In [Part 4](/articles/raft-part-4-building-crystal) I turn all of this into running Go: how Crystal DB persists the log to a crash-safe write-ahead file, how it compacts an ever-growing log with snapshots and the `InstallSnapshot` RPC, and how a single-writer control loop lets me implement every rule above without drowning in concurrency bugs.

---

*Series reference: Diego Ongaro and John Ousterhout, "In Search of an Understandable Consensus Algorithm," USENIX Annual Technical Conference (ATC), 2014 — see especially §5.3–5.4 and Figure 8. Diagrams are my own; captions note where they parallel a figure in the paper. Implementation details from [Crystal DB](https://github.com/OmarAbdo/Crystal).*
