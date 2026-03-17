---
title: "Distributed Systems Are About Trade-offs, Not Technology"
date: "2025-10-22"
description: "CAP theorem, eventual consistency, leader election, and the uncomfortable truth that distributed systems fail in ways you can't fully predict — lessons from building microservices at scale."
category: "computerScience"
tags: ["Distributed Systems", "CAP Theorem", "Microservices", "Architecture", "Backend"]
readTime: "11 min read"
---

## The Uncomfortable Truth

Here's what nobody tells you in the "Introduction to Microservices" blog post: distributed systems don't fail less than monoliths. They fail *differently*. Instead of one server crashing and taking everything down, you get partial failures — one service is slow, another is returning stale data, a third is up but can't reach the database.

These partial failures are harder to detect, harder to reproduce, and harder to debug than a clean crash. I've spent more 2 AM hours debugging distributed systems issues than monolith outages by a wide margin.

That doesn't mean distributed systems are wrong. It means the decision to distribute should be deliberate, and it should be driven by a specific constraint you've actually hit — not by architectural aesthetics.

## The CAP Theorem, Practically

You've probably seen the CAP theorem: in a distributed system, you can have at most two of Consistency, Availability, and Partition tolerance.

The standard explanation stops there. Here's the practical version.

**Partition tolerance** is not optional. Networks fail. AWS AZ connectivity drops. A cable gets cut. If you're distributed across multiple nodes, you *will* experience partitions. So the real choice is:

- **CP (Consistency + Partition tolerance):** During a partition, the system refuses to serve requests rather than risk returning incorrect data. Example: a banking ledger. You'd rather be down than show wrong balances.

- **AP (Availability + Partition tolerance):** During a partition, the system keeps serving requests but might return stale data. Example: a social media timeline. Showing a post from 30 seconds ago instead of refusing to load is the right trade-off.

Most systems aren't purely CP or AP. They make different trade-offs for different operations:

```
User profile reads   → AP (eventual consistency is fine)
Account balance      → CP (must be accurate)
Notification status  → AP (delayed read is acceptable)
Payment processing   → CP (double-charge is unacceptable)
```

At LifeOS, AI model responses were AP — if a model was temporarily unavailable, we'd serve a cached response or fall back to a different model. But user authentication was CP — we'd rather fail the request than authenticate with stale credentials.

## Eventual Consistency Is a Business Decision

"Eventual consistency" sounds like a technical compromise. It's actually a business decision: **how stale can the data be before users notice or care?**

Consider an e-commerce product catalog:

- A price change takes 30 seconds to propagate to all read replicas.
- During those 30 seconds, some users see the old price, some see the new price.
- If a user adds the item at the old price, what happens?

The answer isn't technical. It's a business rule. Do you honor the old price? Show an error? Re-quote? That decision determines your consistency requirements, which determines your architecture, not the other way around.

```
Strong consistency:  Every read sees the latest write.
                     Cost: higher latency, lower throughput, more coordination.

Eventual consistency: Reads may be stale, but will converge.
                     Cost: application logic must handle staleness.

Causal consistency:  If A happened before B, everyone sees A before B.
                     Cost: requires tracking causality (vector clocks).
```

The right choice depends on what "wrong" looks like for your specific use case.

## Leader Election: Harder Than It Sounds

When multiple nodes need to agree on who does a thing (processes a queue, holds a lock, coordinates writes), you need leader election. This sounds simple until you consider:

- The current leader crashes. How quickly is a new leader elected?
- The network partitions. Both sides think they're the leader (split brain).
- The old leader comes back after a partition. Now there are two leaders.

In practice, you don't implement leader election yourself. You use a consensus protocol through a proven system:

- **etcd** (Raft consensus) — what Kubernetes uses internally
- **ZooKeeper** (ZAB protocol) — battle-tested, operationally complex
- **Redis RedLock** — simpler but weaker guarantees (Martin Kleppmann's critique is worth reading)

```go
// Using etcd for leader election in Go
session, _ := concurrency.NewSession(client, concurrency.WithTTL(10))
election := concurrency.NewElection(session, "/my-service/leader")

// This blocks until we become leader
election.Campaign(ctx, "node-1")

// We are now the leader — do the work
processQueue()

// When done, resign leadership
election.Resign(ctx)
```

The TTL (time-to-live) is critical. If the leader crashes without resigning, the lease expires after 10 seconds and a new leader is elected. Too short = frequent false failovers. Too long = extended downtime during real failures.

## The Patterns I've Found Reliable

### Idempotency

In a distributed system, messages can be delivered more than once. A retry after a timeout might mean the original request already succeeded. If your handler isn't idempotent, you'll process the same event twice.

```go
func handlePayment(ctx context.Context, req PaymentRequest) error {
    // Idempotency key: check if we've already processed this
    if exists, _ := db.PaymentExists(ctx, req.IdempotencyKey); exists {
        return nil // already processed, no-op
    }

    // Process the payment
    err := stripe.Charge(req.Amount, req.Token)
    if err != nil {
        return err
    }

    // Record that we processed it
    return db.RecordPayment(ctx, req.IdempotencyKey, req.Amount)
}
```

Every write operation in a distributed system should have an idempotency key. No exceptions.

### Circuit Breakers

When a downstream service is failing, continuing to send it requests makes things worse — you exhaust your own connection pools, increase latency, and pile pressure on the failing service.

A circuit breaker tracks failure rates and "opens" when failures exceed a threshold, returning errors immediately without calling the downstream service. After a cooldown period, it lets a few requests through to test if the service has recovered.

```
CLOSED → errors exceed threshold → OPEN → timer expires → HALF-OPEN
   ↑                                                          │
   └────────── test requests succeed ──────────────────────────┘
```

This isn't optional in production microservices. Without circuit breakers, one failing service cascades into every service that depends on it.

### Saga Pattern for Distributed Transactions

A monolith uses database transactions. A distributed system can't — there's no single database to wrap a transaction around. The saga pattern coordinates multi-service operations through a sequence of local transactions with compensating actions:

```
1. Order Service:    Create order (PENDING)
2. Payment Service:  Charge card
3. Inventory Service: Reserve stock
4. Order Service:    Update order (CONFIRMED)

If step 3 fails:
3a. Payment Service: Refund card (compensating action)
3b. Order Service:   Update order (CANCELLED)
```

Each step is a local transaction. Each step has a corresponding "undo" action. If any step fails, you execute the compensating actions in reverse order.

This is more complex than a database transaction. That's the cost of distribution. If your operations can fit in a single database, keep them there.

## When to Distribute

Distribute a system when you've hit a specific constraint:

- **Scale:** A single node can't handle the load.
- **Reliability:** A single point of failure is unacceptable and you need geographic redundancy.
- **Organizational:** Multiple teams need to deploy independently with different release cadences.

If you haven't hit any of these, a well-structured monolith is simpler, faster to develop, easier to debug, and cheaper to run.

The decision to distribute is a trade-off: you gain certain properties (independent scaling, fault isolation, team autonomy) and you lose others (transactional guarantees, simple debugging, straightforward deployment). Make that trade-off consciously.

The technology — Kubernetes, Kafka, gRPC, service meshes — is secondary. The hard part is understanding the trade-offs you're making and designing your system to handle the failure modes you've accepted.

Distributed systems engineering is not about building systems that don't fail. It's about building systems that fail gracefully, recover automatically, and never lose data they've acknowledged.

That's a higher bar than most teams realize when they draw their first microservice diagram.
