---
title: "Operating Systems in 20 Minutes: What Every Developer Should Actually Know"
date: "2025-10-05"
description: "Not an OS course. A curated tour of the concepts that directly affect your code — processes, virtual memory, file systems, and why your Docker container isn't a VM."
category: "computerScience"
tags: ["Operating Systems", "Linux", "Docker", "Processes", "Computer Science"]
readTime: "11 min read"
---

## You Use an OS Every Day and Probably Can't Explain What It Does

Most developers interact with their operating system through a terminal. They know `ps`, `top`, `kill`, `chmod`. They know Docker runs containers. They know their Node.js app is "single-threaded."

But ask them *why* their 8GB machine can run programs that collectively "use" 20GB of memory, or *what* actually happens when they call `fs.writeFile()`, or *why* a Docker container isn't a VM — and you get shrugs or half-remembered lecture notes.

This isn't an operating systems course. I'm not going to walk you through implementing a scheduler or building a file system from scratch. This is a curated tour of the OS concepts that directly affect the software you write today. The stuff that explains why your production systems behave the way they do.

## Processes vs. Threads: The Fundamental Unit of Work

A **process** is an instance of a running program. It gets its own memory space, its own file descriptors, its own PID. When you run `node server.js`, the OS creates a process.

A **thread** is a unit of execution within a process. Threads share the process's memory and file descriptors but have their own stack and program counter. A process with four threads has four simultaneous paths of execution — all reading and writing the same heap memory.

```
Process (PID 1234)
├── Thread 1 (main) — stack, registers, program counter
├── Thread 2       — stack, registers, program counter
├── Thread 3       — stack, registers, program counter
└── Shared: heap memory, file descriptors, code
```

**Why this matters for your code:**

Java and Go create OS threads (or green threads mapped to OS threads). If you spawn 1,000 threads, the OS scheduler manages 1,000 execution contexts. Context switching between threads is cheap (they share memory) but not free — the CPU has to save and restore registers.

Node.js takes a different path. It runs your JavaScript on a single thread. But it's concurrent — the event loop is essentially cooperative scheduling. When your code does `await fetch(url)`, it yields control to the event loop, which can run other callbacks. The OS handles the actual I/O on separate threads (via libuv), but your code never touches them.

This is why a single Node.js process can handle thousands of concurrent HTTP connections but freezes entirely if you do `while(true)` in your request handler. You're blocking the one thread that runs all the JavaScript.

```javascript
// This handles 10,000 concurrent connections fine
app.get('/api/data', async (req, res) => {
  const data = await db.query('SELECT * FROM users'); // yields to event loop
  res.json(data);
});

// This kills your entire server
app.get('/api/compute', (req, res) => {
  const result = fibonacciSync(1000000); // blocks the event loop
  res.json({ result });
});
```

The fix for CPU-intensive work in Node.js: worker threads or child processes. You're not working around a limitation — you're using the right tool for the job.

## Virtual Memory: The Greatest Lie Your Computer Tells

Every process thinks it has access to a huge, contiguous block of memory starting at address 0. This is a complete fiction maintained by the OS and the CPU's memory management unit (MMU).

**How it actually works:**

1. Each process gets its own virtual address space (on 64-bit systems, this is theoretically 16 exabytes).
2. The OS maps virtual addresses to physical RAM addresses using **page tables**. A page is typically 4KB.
3. Not all virtual pages need to be in physical RAM at once. Some can live on disk (swap).
4. The OS loads pages into RAM on demand — **page faults** trigger this loading.

This is why your 8GB machine can run programs that collectively claim to use 20GB. Most of that virtual memory is either:
- **Not yet accessed** — allocated but no physical page assigned
- **Swapped to disk** — accessed but moved out of RAM because something else needed the space
- **Shared** — multiple processes mapping the same physical page (shared libraries like libc)

```bash
# This allocates 1GB of virtual memory but uses almost 0 physical memory
import mmap
data = mmap.mmap(-1, 1_000_000_000)  # Python: 1GB allocation
# Physical memory used: ~0 (until you read/write pages)
```

**The OOM Killer:** When the system runs out of both RAM and swap, Linux's Out-Of-Memory killer picks a process and terminates it. The selection heuristic considers process size and priority. This is why your production app sometimes dies with no stack trace and signal 9 — the OOM killer shot it. Check `dmesg` for the evidence.

![Virtual memory mapping: how virtual addresses map to physical RAM pages and swap space](/images/articles/operating-systems/virtual-memory.svg)

Understanding virtual memory explains why `htop` shows two different memory columns: VIRT (virtual — what the process thinks it has) and RES (resident — what's actually in physical RAM). The first number is almost meaningless. The second is what matters.

## What Happens When You Call `fs.writeFile()`

Let's trace a simple file write from your JavaScript all the way down:

1. **Your code:** `fs.writeFile('/tmp/data.txt', 'hello')` — this calls into Node.js's native bindings.
2. **System call:** Node.js issues a `write()` syscall. This is the boundary between user space and kernel space. Your code can't touch hardware directly — it asks the kernel.
3. **Page cache:** The kernel doesn't write to disk immediately. It writes to the **page cache** — a region of RAM that acts as a buffer for disk I/O. The `write()` syscall returns success at this point. Your data is in RAM, not on disk.
4. **Writeback:** The kernel's pdflush daemon periodically writes dirty pages from the cache to the actual disk. This happens asynchronously, seconds to minutes later.
5. **Disk:** The data finally hits persistent storage.

This means `fs.writeFile()` returning doesn't guarantee your data is on disk. If the machine loses power between steps 3 and 5, your data is gone.

If you need that guarantee — and for databases and financial systems, you do — you need `fsync()`:

```javascript
import { open } from 'fs/promises';

async function durableWrite(path: string, data: string) {
  const handle = await open(path, 'w');
  await handle.write(data);
  await handle.datasync(); // fsync: forces kernel to flush to disk
  await handle.close();
}
```

`fsync` is expensive because it waits for the physical disk write. This is the fundamental tension in file systems: performance (page cache) vs. durability (fsync). Databases like PostgreSQL call fsync on every transaction commit. Your average web app doesn't need to.

## The Scheduler: Why CI Builds Are Slow on Shared Infra

The OS scheduler decides which thread runs on which CPU core and for how long. On a modern Linux system, the default is CFS (Completely Fair Scheduler).

The core concept is **time slicing**: each runnable thread gets a slice of CPU time (typically a few milliseconds). When the slice expires, the scheduler preempts the thread and switches to another one. This creates the illusion of parallelism even on a single-core machine.

**Why your CI builds are slow on shared infrastructure:** Your CI runner is sharing a machine (physical or virtual) with other tenants. The scheduler divides CPU time across all runnable threads. If the machine is running 200 containers' worth of build processes, each one gets a tiny slice. The total CPU work is the same, but the wall-clock time balloons because your threads spend most of their time waiting for their turn.

This is also why "1 CPU" in Kubernetes doesn't mean what you think. It means you get the equivalent of one core's worth of time over a period — but your process might be scheduled, preempted, scheduled again, preempted again. Latency-sensitive workloads feel this jitter.

**Nice values and priorities:** Every process has a priority that affects scheduling. A nice value of -20 gives highest priority; +19 gives lowest. This is why `nice -n 19 make build` is polite — it tells the scheduler to deprioritize your build when other work is waiting.

## Concurrency Primitives: What the OS Actually Provides

When you use a mutex in Go or a Lock in Python, you're using abstractions built on OS primitives.

**Mutex (mutual exclusion):** Ensures only one thread can access a critical section at a time. At the OS level, this often involves a **futex** (fast userspace mutex) on Linux — it tries to acquire the lock in user space without a syscall, and only falls back to a kernel syscall if there's contention.

**Semaphore:** Like a mutex, but allows N threads through instead of just one. Think of it as a bouncer at a club with a capacity limit. Database connection pools are conceptually semaphores — allow up to 20 concurrent connections, block the 21st until one returns.

**The deadlock problem:** Thread A holds lock 1 and waits for lock 2. Thread B holds lock 2 and waits for lock 1. Both wait forever. The OS doesn't prevent this — it's your problem. The standard prevention: always acquire locks in the same global order.

```go
// DEADLOCK: inconsistent lock ordering
// Goroutine 1: Lock(A) → Lock(B)
// Goroutine 2: Lock(B) → Lock(A)

// SAFE: consistent lock ordering
// Goroutine 1: Lock(A) → Lock(B)
// Goroutine 2: Lock(A) → Lock(B)
```

Understanding these primitives at the OS level explains why concurrent programming is hard. The OS gives you the building blocks — mutexes, semaphores, condition variables — but the correctness is entirely on you. Languages like Go and Rust add higher-level abstractions (channels, ownership) that make certain classes of bugs impossible, but they're built on the same kernel primitives underneath.

## Containers Aren't VMs: The Explanation You've Been Missing

I've met senior developers who use Docker daily and describe containers as "lightweight VMs." They're not. The distinction matters because it affects security assumptions, performance characteristics, and debugging strategies.

**A virtual machine** runs a complete guest OS on virtualized hardware. The hypervisor (VMware, KVM, Hyper-V) emulates CPU, memory, and devices. The guest OS has its own kernel, its own init system, its own everything. It's fully isolated — a bug in the guest kernel doesn't affect the host.

**A container** is a regular Linux process with two kernel features applied:

**Namespaces:** Isolation of what a process can *see*. There are namespaces for:
- **PID:** The container sees its own process tree. PID 1 inside the container is just a regular process on the host.
- **Network:** The container gets its own network stack — its own IP address, its own ports.
- **Mount:** The container sees its own filesystem (the Docker image layers).
- **User:** UID 0 (root) inside the container can map to a non-root user on the host.

**Cgroups (control groups):** Limits on what a process can *use*. CPU time, memory, disk I/O, network bandwidth. When you set `--memory=512m` on a Docker container, you're setting a cgroup limit.

```bash
# A "container" is just a process with namespaces and cgroups
# You can almost make one with raw Linux commands:
unshare --mount --pid --net --fork /bin/bash
# This creates new mount, PID, and network namespaces for a bash shell
```

![Containers vs VMs: containers share the host kernel using namespaces and cgroups, while VMs run separate guest operating systems on a hypervisor](/images/articles/operating-systems/containers-vs-vms.svg)

**Why this matters:**

1. **Performance:** Containers have near-zero overhead because there's no hypervisor, no second kernel. The containerized process runs directly on the host kernel. A VM has measurable overhead from hardware emulation.
2. **Security:** Containers share the host kernel. A kernel exploit inside a container compromises the host. VMs have stronger isolation — the guest kernel is separate. This is why multi-tenant cloud providers use VMs (or microVMs like Firecracker), not just containers.
3. **Debugging:** When your containerized app misbehaves, you can inspect it from the host with `strace`, `perf`, and `nsenter`. It's just a process. With a VM, you'd need to debug from inside the guest OS.

When I'm running LifeOS's Go services in Docker on my dev machine, I'm not spinning up virtual machines. I'm running isolated Linux processes that share my host kernel but think they're alone. The illusion is maintained by namespaces. The resource limits are maintained by cgroups. There's no hypervisor in the picture.

## The Mental Model That Ties It Together

The operating system is a resource manager. It manages four things:

1. **CPU time** — via the scheduler and time slicing
2. **Memory** — via virtual memory, page tables, and the OOM killer
3. **Storage** — via file systems, page cache, and syscalls
4. **Isolation** — via processes, namespaces, and cgroups

Every OS concept maps to one of these four responsibilities. When you're debugging a production issue — slow response times, memory growth, disk write failures, container escapes — knowing which resource is involved tells you which OS subsystem to investigate.

You don't need to read the Linux kernel source code. But you need to know that `fs.writeFile()` doesn't mean "written to disk," that your 8GB machine can address 20GB of virtual memory, that `docker run` creates a namespace not a VM, and that your CI build is slow because a scheduler is sharing a CPU across a hundred containers.

These aren't trivia. They're the difference between guessing why production is broken and knowing.
