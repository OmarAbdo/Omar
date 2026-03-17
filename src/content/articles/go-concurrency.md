---
title: "Goroutines Are Not Threads: A Practical Guide to Go Concurrency"
date: "2025-12-15"
description: "Channels, goroutines, select, and the patterns that actually matter — a hands-on guide from building concurrent systems in Go at LifeOS."
category: "backend"
tags: ["Go", "Concurrency", "Goroutines", "Channels", "Backend"]
readTime: "12 min read"
---

## The Goroutine Misconception

When developers come to Go from Java or C#, they map goroutines to threads. This is technically wrong and practically dangerous.

A goroutine is a lightweight function execution managed by the Go runtime, not the OS kernel. The Go scheduler multiplexes thousands of goroutines onto a small number of OS threads (typically one per CPU core). Creating a goroutine costs ~2KB of stack memory. Creating an OS thread costs ~1MB.

This means:

- You can run 100,000 goroutines on a laptop. You cannot run 100,000 threads.
- Goroutine context switching is handled in user space — it's fast.
- But goroutines share the same address space, so data races are just as real as with threads.

At LifeOS, our Go backend handled concurrent AI model inference, database queries, and WebSocket connections — all on goroutines. Here's what I learned about doing it correctly.

## The Basics: Starting Goroutines

```go
func main() {
    go doWork() // runs concurrently
    fmt.Println("main continues")
    time.Sleep(time.Second) // don't do this in production
}
```

The `go` keyword launches a function in a new goroutine. The function runs concurrently — the caller doesn't wait for it to finish.

The `time.Sleep` at the end is a code smell. If `main` exits before the goroutine finishes, the goroutine is killed. You need explicit synchronization, not sleep calls.

## Channels: Communication Over Shared Memory

Go's mantra is: *Don't communicate by sharing memory; share memory by communicating.* Channels are how you do this.

```go
func fetchUser(id string, ch chan<- User) {
    user, err := db.GetUser(id)
    if err != nil {
        ch <- User{} // send zero value on error
        return
    }
    ch <- user
}

func main() {
    ch := make(chan User, 1) // buffered channel
    go fetchUser("abc123", ch)

    user := <-ch // blocks until a value is sent
    fmt.Println(user.Name)
}
```

Channels are typed, concurrent-safe pipes. A send blocks until someone reads (unbuffered) or until the buffer is full (buffered). A receive blocks until someone sends.

### Buffered vs Unbuffered

- **Unbuffered (`make(chan int)`):** Sender blocks until receiver is ready. This is synchronous communication — use it when you want guaranteed handoff.
- **Buffered (`make(chan int, 10)`):** Sender only blocks when the buffer is full. Use it when the producer is faster than the consumer and you want to absorb bursts.

The right default is unbuffered. Add a buffer only when you've measured that the producer is blocking unnecessarily.

## The Patterns That Matter

### Fan-out / Fan-in

You have one input and want to process it concurrently, then collect the results.

```go
func processItems(items []Item) []Result {
    results := make(chan Result, len(items))

    // Fan out: one goroutine per item
    for _, item := range items {
        go func(it Item) {
            results <- process(it)
        }(item)
    }

    // Fan in: collect all results
    collected := make([]Result, 0, len(items))
    for range items {
        collected = append(collected, <-results)
    }

    return collected
}
```

At LifeOS, we used this pattern to query multiple AI models simultaneously — send the same prompt to three models, return the first response that meets quality criteria.

### Worker Pool

Fan-out without limits is dangerous. If you have 10,000 items and launch 10,000 goroutines, each making an HTTP call, you'll exhaust file descriptors or get rate-limited.

```go
func workerPool(items []Item, workers int) []Result {
    jobs := make(chan Item, len(items))
    results := make(chan Result, len(items))

    // Start fixed number of workers
    for w := 0; w < workers; w++ {
        go func() {
            for item := range jobs {
                results <- process(item)
            }
        }()
    }

    // Send all jobs
    for _, item := range items {
        jobs <- item
    }
    close(jobs) // signals workers to stop

    // Collect results
    collected := make([]Result, 0, len(items))
    for range items {
        collected = append(collected, <-results)
    }
    return collected
}
```

The `workers` parameter gives you backpressure. If the workers are busy, the `jobs <- item` send blocks. The system self-regulates without you writing rate-limiting logic.

### Select: Multiplexing Channels

`select` is Go's way of waiting on multiple channel operations simultaneously:

```go
func fetchWithTimeout(ctx context.Context, url string) ([]byte, error) {
    ch := make(chan []byte, 1)
    errCh := make(chan error, 1)

    go func() {
        data, err := httpGet(url)
        if err != nil {
            errCh <- err
            return
        }
        ch <- data
    }()

    select {
    case data := <-ch:
        return data, nil
    case err := <-errCh:
        return nil, err
    case <-ctx.Done():
        return nil, ctx.Err() // timeout or cancellation
    }
}
```

`select` blocks until one of the cases can proceed. If multiple are ready, it picks one at random. The `ctx.Done()` pattern is how you implement timeouts and cancellation in Go — pass a `context.WithTimeout` and `select` handles the rest.

## WaitGroup: When You Just Need to Wait

Channels are for communication. If you just need to wait for goroutines to finish without passing data, use `sync.WaitGroup`:

```go
func crawlPages(urls []string) {
    var wg sync.WaitGroup

    for _, url := range urls {
        wg.Add(1)
        go func(u string) {
            defer wg.Done()
            crawl(u)
        }(url)
    }

    wg.Wait() // blocks until all Done() calls match Add() calls
}
```

Simple, readable, no channels needed. The `defer wg.Done()` ensures the counter decrements even if `crawl` panics.

## The Mistakes That Burn You

### Goroutine Leaks

A goroutine that blocks forever is a memory leak. It never gets garbage collected.

```go
// LEAK: if nobody reads from ch, this goroutine blocks forever
func leaky() {
    ch := make(chan int)
    go func() {
        result := expensiveComputation()
        ch <- result // blocks if nobody reads
    }()
    // function returns without reading ch
}
```

Fix: use buffered channels when the receiver might not read, or use `context` for cancellation.

```go
func notLeaky(ctx context.Context) {
    ch := make(chan int, 1) // buffer of 1: send won't block
    go func() {
        select {
        case ch <- expensiveComputation():
        case <-ctx.Done():
            return // clean exit
        }
    }()
}
```

### Data Races

Two goroutines reading and writing the same variable without synchronization is a data race. Go's race detector catches these:

```bash
go test -race ./...
go run -race main.go
```

Always run with `-race` during development. It has ~10x performance overhead, so disable it in production, but a race detector finding is a guaranteed bug.

```go
// RACE: concurrent map writes
var cache = make(map[string]int)

go func() { cache["a"] = 1 }()
go func() { cache["b"] = 2 }() // crash: concurrent map writes

// FIX: use sync.Map or a mutex
var mu sync.Mutex
go func() {
    mu.Lock()
    cache["a"] = 1
    mu.Unlock()
}()
```

### Closing Channels Wrong

Only the sender should close a channel. Closing a channel that's already closed panics. Sending to a closed channel panics.

```go
// PANIC: closing a channel twice
close(ch)
close(ch) // panic: close of closed channel

// PANIC: sending to closed channel
close(ch)
ch <- 1 // panic: send on closed channel
```

Rule: close channels from the producer side, and only when all sends are done. If multiple goroutines send to the same channel, use a `WaitGroup` to coordinate closing.

## The Mental Model

Go concurrency is built on CSP (Communicating Sequential Processes). The core idea: goroutines are independent processes that communicate through channels. Each goroutine is sequential internally — the concurrency happens at the boundaries, where goroutines exchange messages.

When I'm designing a concurrent Go system, I draw it as a pipeline:

```
[HTTP Handler] → channel → [Validator] → channel → [Processor] → channel → [DB Writer]
```

Each stage is a goroutine (or pool of goroutines). Each arrow is a channel. Data flows in one direction. No shared state between stages. If a stage needs to scale, you add more goroutines reading from the same channel.

This model made LifeOS's Go backend remarkably easy to reason about, even with 40+ concurrent model inference sessions. Each session was a pipeline. Each pipeline was isolated. The channels were the only shared surface.

Concurrency is hard. Go doesn't make it easy. But it gives you primitives — goroutines, channels, select — that make the hard parts explicit and visible, rather than hidden behind lock hierarchies and thread pool configurations.

That's the best you can ask for from a language.
