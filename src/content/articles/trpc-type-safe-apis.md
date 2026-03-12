---
title: "tRPC in Production: End-to-End Type Safety Without the Overhead"
date: "2025-09-20"
description: "A practical guide to tRPC — why it beats REST for TypeScript monorepos, how to structure routers for scale, and lessons from running it in production on AWS EKS."
category: "backend"
tags: ["tRPC", "TypeScript", "Node.js", "API Design", "React"]
readTime: "7 min read"
---

## The Problem with REST in TypeScript Monorepos

You have a TypeScript backend and a TypeScript frontend. You write a REST endpoint. You immediately have two problems:

1. The frontend has no idea what the response type looks like without a schema generator
2. Any API change breaks the contract silently at runtime, not compile time

OpenAPI + code generation solves this, but it adds a build step, a generator tool, and a pile of generated boilerplate that goes stale the moment you forget to regenerate.

**tRPC eliminates the problem entirely.**

## What tRPC Actually Is

tRPC is not a framework. It's a library that lets you call server functions from the client as if they were local functions — with full TypeScript type inference, no code generation, no HTTP verbs to argue about.

```typescript
// Server: define a procedure
const appRouter = router({
  user: router({
    byId: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.user.findUnique({ where: { id: input.id } });
      }),
  }),
});

// Client: call it — TypeScript knows the return type
const user = await trpc.user.byId.query({ id: "123" });
//    ^-- type is inferred automatically. No import needed.
```

## Structuring Routers for Scale

The naive approach is one giant router file. That becomes unmaintainable past ~20 procedures. The pattern I use in Tafkeer:

```
src/
  server/
    routers/
      _app.ts        ← merge all routers here
      ai.ts          ← AI model calls
      billing.ts     ← Stripe
      user.ts        ← profile, preferences
      conversation.ts ← thread management
```

Each router is self-contained with its own middleware stack:

```typescript
// routers/ai.ts
export const aiRouter = router({
  chat: protectedProcedure
    .input(chatInputSchema)
    .mutation(async ({ input, ctx }) => {
      await checkQuota(ctx.user.id);
      return streamCompletion(input);
    }),
});
```

The `protectedProcedure` middleware handles auth — if the user isn't authenticated, the call never reaches the resolver.

## Streaming with tRPC

One of the underrated features is subscription/streaming support. For an AI chat interface, you want tokens to stream, not batch at completion:

```typescript
// Server: use async generators
chat: protectedProcedure
  .input(chatInputSchema)
  .subscription(async function* ({ input }) {
    const stream = await openrouter.chat.completions.create({
      model: input.model,
      messages: input.messages,
      stream: true,
    });
    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content ?? "";
    }
  }),
```

On the client, this shows up as a React Query subscription that appends tokens to state in real-time.

## Production Notes from AWS EKS

Running tRPC on EKS with multiple pods requires a few non-obvious things:

**1. Sticky sessions for subscriptions**
WebSocket-based subscriptions need to hit the same pod. Use an ALB with `stickiness.enabled=true` for subscription endpoints, or switch to a message broker (we use Redis pub/sub).

**2. Context serialization**
The tRPC context is created per-request. Put heavy auth lookups behind a lazy getter or you'll hammer the database on every call.

**3. Error serialization**
tRPC errors serialized over the wire lose their `instanceof` identity on the client. Use error codes + data shapes instead of `instanceof` checks.

## Should You Use tRPC?

**Yes if:**
- You have a TypeScript frontend and backend in the same repo (or monorepo)
- You value developer experience and rapid iteration
- Your team is allergic to contract drift

**No if:**
- You need to serve third-party API consumers (they want REST/OpenAPI)
- Your frontend is not TypeScript
- You have a large existing REST API worth maintaining

For greenfield TypeScript full-stack projects, tRPC is my default. The DX improvement over REST is not incremental — it's categorical.
