---
title: "ACID Is Not Just a Textbook Concept"
date: "2025-08-14"
description: "Real-world examples of what happens when you violate each ACID property — phantom reads, lost updates, dirty writes — and how PostgreSQL's isolation levels actually behave."
category: "backend"
tags: ["SQL", "PostgreSQL", "ACID", "Databases", "Backend"]
readTime: "10 min read"
---

## The Gap Between Theory and Production

Every CS curriculum covers ACID: Atomicity, Consistency, Isolation, Durability. Every developer nods along. And then in production, they write code that violates isolation guarantees without realizing it, wonder why their counters are off by one, and Google "PostgreSQL race condition" at 11 PM.

The problem isn't that developers don't know what ACID stands for. It's that the textbook definitions don't translate directly to "what will break in my application." This article bridges that gap with real scenarios from systems I've built.

## Atomicity: All or Nothing

Atomicity means a transaction either fully completes or fully rolls back. There's no halfway state.

**What breaks without it:**

Imagine a money transfer: debit account A, credit account B.

```sql
-- Without a transaction
UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
-- server crashes here
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
```

If the server crashes between the two statements, $100 disappears. Account A is debited, account B is not credited. The money exists nowhere.

```sql
-- With a transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT;
```

If the server crashes between the statements, PostgreSQL rolls back the entire transaction on recovery. Account A is unchanged. No money is lost.

This seems obvious. But I've seen production code that does multi-step operations without transactions more times than I'd like to admit — especially in ORMs where each `.save()` call is its own implicit transaction.

```typescript
// DANGEROUS: each save() is its own transaction
await order.save();         // commits
await inventory.save();     // if this fails, order is already saved
await payment.save();       // partial state in the database

// SAFE: explicit transaction
await db.transaction(async (tx) => {
  await tx.insert(orders).values(order);
  await tx.update(inventory).set({ stock: sql`stock - 1` });
  await tx.insert(payments).values(payment);
});
```

## Consistency: Rules That Always Hold

Consistency means a transaction brings the database from one valid state to another. "Valid" is defined by your constraints: foreign keys, unique indexes, check constraints, not-null rules.

**The catch:** PostgreSQL only enforces consistency for the constraints you've defined. If you haven't added a `CHECK (balance >= 0)` constraint, the database will happily let a balance go negative inside a transaction. Consistency is only as strong as your schema.

```sql
-- This constraint prevents negative balances
ALTER TABLE accounts ADD CONSTRAINT positive_balance CHECK (balance >= 0);

-- Now this transaction will fail atomically
BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE id = 'A';
-- ERROR: new row for relation "accounts" violates check constraint "positive_balance"
-- Entire transaction is rolled back
COMMIT;
```

The lesson: define your invariants as database constraints, not application logic. Application logic can be bypassed (direct SQL queries, migration scripts, other services). Database constraints cannot.

## Isolation: Where Things Get Interesting

Isolation defines what concurrent transactions can see of each other's uncommitted changes. This is where most production bugs live, because the default isolation level in PostgreSQL (`READ COMMITTED`) allows behaviors that surprise developers.

### The Four Isolation Levels

```
READ UNCOMMITTED  → Can see other transactions' uncommitted writes (dirty reads)
READ COMMITTED    → Can only see committed data, but data can change between reads
REPEATABLE READ   → Snapshot at transaction start, reads are stable
SERIALIZABLE      → Transactions behave as if executed one at a time
```

PostgreSQL's default is `READ COMMITTED`. Here's what that actually means in practice.

### Problem 1: Non-Repeatable Reads

```sql
-- Transaction A (READ COMMITTED, the default)
BEGIN;
SELECT balance FROM accounts WHERE id = 'A';  -- returns 1000

    -- Transaction B commits between A's two reads
    -- UPDATE accounts SET balance = 500 WHERE id = 'A'; COMMIT;

SELECT balance FROM accounts WHERE id = 'A';  -- returns 500!
COMMIT;
```

Transaction A reads the same row twice and gets different values. This happens because `READ COMMITTED` re-evaluates visibility on every statement.

**When this bites you:** Any logic that reads a value, does computation, then reads again assuming the value hasn't changed. Reporting queries that sum data across multiple queries. Balance checks that read before update.

### Problem 2: Phantom Reads

```sql
-- Transaction A
BEGIN;
SELECT count(*) FROM orders WHERE status = 'pending';  -- returns 5

    -- Transaction B: INSERT INTO orders (status) VALUES ('pending'); COMMIT;

SELECT count(*) FROM orders WHERE status = 'pending';  -- returns 6!
COMMIT;
```

A new row appeared between two identical queries. The "phantom" is a row that matches your WHERE clause but didn't exist when you first queried.

### Problem 3: Lost Updates

This is the most common real-world bug I've seen:

```sql
-- Transaction A                          -- Transaction B
BEGIN;                                    BEGIN;
SELECT stock FROM products WHERE id = 1;  SELECT stock FROM products WHERE id = 1;
-- stock = 10                             -- stock = 10

UPDATE products SET stock = 9             UPDATE products SET stock = 9
WHERE id = 1;                             WHERE id = 1;
COMMIT;                                   COMMIT;
-- Both transactions decremented from 10 to 9
-- Two items sold, but stock only decreased by 1
```

Both transactions read stock = 10, both set it to 9. One update is lost. This happens at `READ COMMITTED` because each transaction sees the committed value at read time.

**The fix:** Use `UPDATE ... SET stock = stock - 1` (atomic decrement) or raise the isolation level:

```sql
-- Atomic decrement: no read-then-write race
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0;
-- If stock is 0, no rows are updated — safe.
```

### REPEATABLE READ vs SERIALIZABLE

`REPEATABLE READ` takes a snapshot at the start of the transaction. All reads see the database as of that moment. No non-repeatable reads, no phantoms within the transaction.

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
SELECT balance FROM accounts WHERE id = 'A';  -- returns 1000
-- even if another transaction updates this to 500 and commits,
-- this transaction still sees 1000
SELECT balance FROM accounts WHERE id = 'A';  -- still 1000
COMMIT;
```

But `REPEATABLE READ` can still have write conflicts. If two transactions try to update the same row, one will get a serialization failure:

```
ERROR: could not serialize access due to concurrent update
```

Your application needs to catch this error and retry the transaction.

`SERIALIZABLE` goes further: it guarantees that the result is equivalent to running the transactions one at a time. PostgreSQL detects any anomaly (even complex ones involving multiple rows and read-write dependencies) and aborts one transaction.

The cost: more retries. At high concurrency, serializable transactions abort more frequently. You need retry logic in your application.

## Durability: When Committed Means Committed

Durability means that once a transaction commits, the data survives crashes, power failures, and disk issues.

PostgreSQL achieves this through WAL (Write-Ahead Logging): before confirming a commit, it writes the change to a log on disk. If the server crashes, it replays the WAL on startup to recover committed transactions.

**The edge case:** `synchronous_commit = off`. This PostgreSQL setting lets the server confirm commits before the WAL is flushed to disk. It's faster but means recent commits can be lost in a crash. Some applications enable this for performance-critical, loss-tolerant writes (analytics events, logs). Know whether your system uses it.

```sql
-- Per-transaction durability control
SET LOCAL synchronous_commit = off;
INSERT INTO analytics_events (event, timestamp) VALUES ('page_view', now());
COMMIT; -- returns immediately, data might be lost in a crash
```

## The Practical Takeaways

1. **Wrap related writes in explicit transactions.** Don't rely on ORM auto-commit behavior.
2. **Use `UPDATE ... SET x = x - 1` for counters**, not read-then-write.
3. **Know your isolation level.** PostgreSQL defaults to `READ COMMITTED`. If your logic reads then writes based on what it read, you probably need `REPEATABLE READ` or `SELECT ... FOR UPDATE`.
4. **Define constraints in the schema**, not just in application code. Foreign keys, check constraints, and unique indexes are your safety net.
5. **Handle serialization failures.** If you use `REPEATABLE READ` or `SERIALIZABLE`, your application must catch `40001` errors and retry.

```typescript
// Retry loop for serializable transactions
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.code === '40001' && attempt < maxRetries - 1) {
        continue; // serialization failure, retry
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}
```

ACID properties aren't academic abstractions. They're the reason your bank balance is correct, your orders aren't duplicated, and your data survives server crashes. Understanding them at the practical level — what breaks, when, and how to prevent it — is the difference between code that works in development and code that works in production.
