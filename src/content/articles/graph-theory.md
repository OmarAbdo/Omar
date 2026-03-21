---
title: "Graph Theory: The Human Explanation"
date: "2025-11-25"
description: "Social networks, Google Maps, package managers — they're all graphs. A practical guide to the data structure that quietly powers half the software you use."
category: "computerScience"
tags: ["Graph Theory", "Algorithms", "Data Structures", "TypeScript", "Computer Science"]
readTime: "11 min read"
---

## You Already Think in Graphs

Every time you open Google Maps and ask for directions, you're running a graph algorithm. Every time LinkedIn says someone is a "2nd connection," it's doing a graph traversal. Every time you run `npm install` and your package manager resolves a dependency tree, it's performing a topological sort on a directed acyclic graph.

Graphs are not an exotic data structure reserved for whiteboard interviews. They're the most natural way to model relationships — between people, between cities, between software packages, between anything that connects to anything else. The math just formalizes what your brain already does when you look at a subway map.

I wrote about graph theory on Stackademic a while back. This is the evolved version — less academic, more grounded in the systems I've actually built. When I worked on Netro, a delivery simulation platform, graphs weren't a theoretical exercise. They were the core data structure that made the entire system work.

## Nodes and Edges: The Entire Foundation

A graph is two things: **nodes** (also called vertices) and **edges** (connections between nodes). That's it. Everything else in graph theory is just asking questions about how those nodes and edges are arranged.

```typescript
type Node = string;
type Edge = { from: Node; to: Node; weight?: number };
type Graph = { nodes: Node[]; edges: Edge[] };
```

From this simple structure, you can model:

- **Social networks:** Nodes are people, edges are friendships
- **Road networks:** Nodes are intersections, edges are roads (weights are distances or travel times)
- **The internet:** Nodes are web pages, edges are hyperlinks
- **Dependency trees:** Nodes are packages, edges are "depends on" relationships

The power of graphs is that the same algorithms work regardless of what the nodes and edges represent. Dijkstra's algorithm doesn't care if it's finding the shortest route between Berlin and Munich or the cheapest sequence of API calls in a microservice mesh.

## Directed vs. Undirected, Weighted vs. Unweighted

These are the four flavors you'll encounter:

**Undirected, unweighted:** Facebook friendships. If I'm friends with you, you're friends with me. No "cost" to the connection. This is the simplest graph.

**Directed, unweighted:** Twitter follows. I can follow you without you following me. The edge has a direction.

**Undirected, weighted:** A road network where you only care about distance. The road goes both ways, and each road has a length.

**Directed, weighted:** Google Maps. Roads can be one-way, and each segment has a travel time that might differ by direction (think of a steep hill — faster going down).

![Comparison of graph types: undirected, directed, weighted, and directed weighted graphs](/images/articles/graph-theory/graph-types.svg)

In code, the distinction matters because it changes how you store and traverse the graph:

```typescript
// Undirected: add edge in both directions
function addUndirectedEdge(graph: Map<string, string[]>, a: string, b: string) {
  if (!graph.has(a)) graph.set(a, []);
  if (!graph.has(b)) graph.set(b, []);
  graph.get(a)!.push(b);
  graph.get(b)!.push(a);
}

// Directed: add edge in one direction only
function addDirectedEdge(graph: Map<string, string[]>, from: string, to: string) {
  if (!graph.has(from)) graph.set(from, []);
  graph.get(from)!.push(to);
}
```

## How to Store a Graph: Adjacency List vs. Matrix

You have two main options, and the choice matters more than most tutorials let on.

**Adjacency list:** For each node, store a list of its neighbors. This is what you'll use 95% of the time.

```typescript
// Adjacency list — memory: O(V + E)
const adjList: Map<string, { node: string; weight: number }[]> = new Map();
adjList.set("Berlin", [
  { node: "Munich", weight: 585 },
  { node: "Hamburg", weight: 289 },
]);
adjList.set("Munich", [
  { node: "Berlin", weight: 585 },
  { node: "Frankfurt", weight: 392 },
]);
```

**Adjacency matrix:** A 2D grid where `matrix[i][j]` stores the weight of the edge from node `i` to node `j`. Zero or infinity means no edge.

```typescript
// Adjacency matrix — memory: O(V²)
// Indices: 0=Berlin, 1=Munich, 2=Hamburg, 3=Frankfurt
const matrix = [
  [0, 585, 289, Infinity],
  [585, 0, Infinity, 392],
  [289, Infinity, 0, Infinity],
  [Infinity, 392, Infinity, 0],
];
```

**When to use which:**

- **Adjacency list** when the graph is sparse (most nodes aren't connected to most other nodes). Social networks, road maps, dependency trees — almost everything real.
- **Adjacency matrix** when you need O(1) edge lookups or the graph is dense. Dense graphs are rare in practice — think fully connected neural network layers or small game boards.

An adjacency matrix for a social network with 1 million users would need 1 trillion entries. An adjacency list stores only the connections that exist — maybe a few hundred per user.

## BFS and DFS: The Two Ways to Walk a Graph

Every graph algorithm builds on one of two traversal strategies: go wide first, or go deep first.

### Breadth-First Search (BFS)

BFS explores all neighbors of a node before moving to their neighbors. It naturally finds the shortest path in unweighted graphs. This is why LinkedIn can tell you that someone is exactly 2 connections away — BFS from your profile, counting levels.

```typescript
function bfs(graph: Map<string, string[]>, start: string): Map<string, number> {
  const distances = new Map<string, number>();
  const queue: string[] = [start];
  distances.set(start, 0);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDist = distances.get(current)!;

    for (const neighbor of graph.get(current) || []) {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, currentDist + 1);
        queue.push(neighbor);
      }
    }
  }

  return distances; // shortest distance from start to every reachable node
}
```

Time complexity: O(V + E). You visit every node once and examine every edge once. Space: O(V) for the queue and distances map.

One caveat: `queue.shift()` is O(n) on arrays in JavaScript. For performance-critical BFS on large graphs, use a proper deque implementation. For most practical cases, it's fine.

### Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking. It's the natural approach for detecting cycles, finding connected components, and topological sorting.

```typescript
function dfs(graph: Map<string, string[]>, start: string): Set<string> {
  const visited = new Set<string>();

  function explore(node: string) {
    visited.add(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        explore(neighbor);
      }
    }
  }

  explore(start);
  return visited; // all nodes reachable from start
}
```

DFS is naturally recursive, which makes the code clean but means you're limited by the call stack. For very deep graphs (thousands of levels), use an iterative version with an explicit stack.

**When to use which:** BFS when you care about shortest distances or levels. DFS when you care about reachability, cycles, or topological ordering. When in doubt, BFS is safer — it won't overflow your stack on deep graphs.

## Dijkstra's Algorithm: Why Google Maps Works

BFS finds shortest paths when all edges have equal weight. In the real world, edges have costs — travel time, distance, latency. That's where Dijkstra's comes in.

The intuition: start at the source, always expand the node with the smallest known distance, and update neighbor distances as you go. It's a greedy algorithm — it makes the locally optimal choice at each step, and for non-negative weights, that choice is globally optimal.

```typescript
type WeightedEdge = { node: string; weight: number };

function dijkstra(
  graph: Map<string, WeightedEdge[]>,
  start: string
): Map<string, number> {
  const distances = new Map<string, number>();
  // Priority queue: [distance, node] — in production, use a real min-heap
  const pq: [number, string][] = [[0, start]];
  distances.set(start, 0);

  while (pq.length > 0) {
    // Sort to simulate priority queue (inefficient — use a heap in production)
    pq.sort((a, b) => a[0] - b[0]);
    const [currentDist, current] = pq.shift()!;

    // Skip if we already found a shorter path
    if (currentDist > (distances.get(current) ?? Infinity)) continue;

    for (const { node: neighbor, weight } of graph.get(current) || []) {
      const newDist = currentDist + weight;
      if (newDist < (distances.get(neighbor) ?? Infinity)) {
        distances.set(neighbor, newDist);
        pq.push([newDist, neighbor]);
      }
    }
  }

  return distances;
}
```

![Dijkstra's algorithm step-by-step traversal finding the shortest path in a weighted graph](/images/articles/graph-theory/dijkstra.svg)

A note on the implementation: the `pq.sort()` call makes this O(V² log V) instead of the optimal O((V + E) log V) you'd get with a real binary heap. In production, use a proper priority queue. I'm using the sort approach here because it shows the logic clearly without a heap implementation cluttering the example.

**The critical constraint:** Dijkstra's only works with non-negative edge weights. If you have negative weights (which happen in financial modeling — discounts, rebates), you need Bellman-Ford, which is slower (O(V·E)) but handles negatives.

When I built Netro's delivery simulation, Dijkstra's was the backbone. We ran it on a graph of city intersections to find optimal delivery routes, with edge weights representing estimated travel time based on time of day. The same algorithm, different weights — and suddenly you're modeling rush hour traffic.

## Topological Sort: Why Your Package Manager Works

If you've ever run `npm install` and had it resolve dependencies in the right order, you've benefited from topological sorting.

A topological sort orders nodes so that for every directed edge from A to B, A comes before B. This only works on Directed Acyclic Graphs (DAGs) — if there's a cycle, there's no valid ordering (and npm will tell you so).

```typescript
function topologicalSort(graph: Map<string, string[]>): string[] | null {
  const inDegree = new Map<string, number>();
  for (const [node, neighbors] of graph) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    }
  }

  // Start with nodes that have no dependencies
  const queue: string[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }

  const result: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    for (const neighbor of graph.get(current) || []) {
      const newDegree = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  // If result doesn't include all nodes, there's a cycle
  if (result.length !== inDegree.size) return null;
  return result;
}
```

This is Kahn's algorithm. The idea: repeatedly find nodes with no incoming edges (no unresolved dependencies), add them to the result, and remove their outgoing edges. If you run out of zero-in-degree nodes before processing everything, you've found a cycle.

Beyond package managers, topological sort shows up in build systems (Makefile targets), course prerequisites, spreadsheet cell evaluation, and CI/CD pipeline ordering.

## Minimum Spanning Tree: Why Cable Companies Care

Given a weighted undirected graph, the minimum spanning tree (MST) connects all nodes with the minimum total edge weight. No cycles, all nodes reachable, cheapest possible.

This is literally the problem cable companies solve: connect every house in a neighborhood using the least total cable. It's also relevant for network design, clustering, and circuit layout.

Prim's and Kruskal's are the two classic algorithms. Kruskal's is more intuitive: sort all edges by weight, add them one by one, skip any edge that would create a cycle. Use a Union-Find data structure to check for cycles efficiently.

I won't implement a full MST here — the Union-Find alone deserves its own section — but knowing it exists is important. When someone says "connect everything as cheaply as possible," they're describing an MST problem.

## Graph Databases vs. Graph Algorithms on Relational Data

A question that comes up at work: should we use Neo4j (or similar graph databases) or just run graph algorithms on our PostgreSQL data?

**Graph databases (Neo4j, Amazon Neptune)** excel when your primary access pattern is traversal — "find all friends of friends who also like jazz" or "what's the shortest path between these two users?" They store relationships as first-class citizens, so traversals are O(1) per hop instead of requiring joins.

**Relational databases with graph algorithms** work when graphs are a secondary concern. If you have a users table and a friendships table, you can load that into memory, build an adjacency list, and run BFS. This is what most applications actually do.

My rule of thumb: if your application's core value proposition involves traversing relationships (social network, knowledge graph, fraud detection), consider a graph database. If you occasionally need graph operations on data that's primarily relational, load it into memory and use algorithms. The impedance mismatch of forcing a graph database into a CRUD app is worse than the query performance you gain.

## The Insight That Took Me Years

When I first learned graph theory in university, it felt abstract. Vertices, edges, adjacency matrices — mathematical objects disconnected from real systems.

Then I started building things. Netro's delivery optimization was a shortest-path problem. LifeOS's AI workflow orchestration was a DAG. Tafkeer's Arabic text processing pipeline had dependency ordering that was, at its core, a topological sort.

Graphs are not a data structure you reach for occasionally. They're a lens for seeing structure in problems. The moment you start seeing your problem as "things and connections between things," you've unlocked an entire library of algorithms that humanity has spent decades perfecting.

You don't need to implement Dijkstra's from scratch in production. You need to recognize when your problem *is* Dijkstra's problem. That recognition — seeing the graph hiding inside your domain — is worth more than memorizing any implementation.

The math formalizes what's already intuitive. You've been thinking in graphs your whole life. Now you have the vocabulary to talk about it.
