---
title: "Building an Arabic-First AI SaaS with 59 Models via OpenRouter"
date: "2026-02-15"
description: "How I architected Tafkeer — a multi-model AI platform serving Arabic speakers — from a single tRPC server on AWS EKS, with Stripe billing and React Native."
category: "backend"
tags: ["AI", "SaaS", "OpenRouter", "AWS", "tRPC", "React Native"]
readTime: "8 min read"
---

## The Problem Space

Arabic speakers represent over 400 million people, yet the vast majority of AI tooling is English-first. Prompts get silently mangled. Arabic context is lost in translation. Models trained on imbalanced datasets produce mediocre Arabic output.

Tafkeer started from a single question: *what would an AI platform look like if Arabic wasn't an afterthought?*

## Architecture Overview

The system is built on three pillars:

1. **Multi-model inference via OpenRouter** — 59 models under one API surface
2. **tRPC on AWS EKS** — type-safe end-to-end API with Kubernetes-managed pods
3. **React Native mobile client** — offline-capable, RTL-native UI

### Why OpenRouter?

OpenRouter gives you a single API key and a unified `chat/completions` endpoint that routes to GPT-4o, Claude 3.5, Gemini 1.5 Pro, Mistral, and 55+ others. The cost arbitrage is real — you pick the cheapest capable model for each task type.

```typescript
// Model selection strategy
const selectModel = (task: TaskType): string => {
  switch (task) {
    case "arabic-comprehension": return "anthropic/claude-3.5-sonnet";
    case "fast-chat":            return "google/gemini-flash-1.5";
    case "code-generation":      return "openai/gpt-4o";
    default:                     return "meta-llama/llama-3.1-70b-instruct";
  }
};
```

### tRPC + AWS EKS

I went with tRPC over REST because the frontend is TypeScript and I wanted zero-cost type propagation from server to client. The router structure is flat:

```
router
├── ai.chat       → streams tokens to the mobile client
├── ai.models     → lists available models with metadata
├── billing.sub   → Stripe subscription management
└── user.profile  → preferences, history, saved threads
```

EKS horizontal pod autoscaling handles burst traffic during peak usage — typically when Arabic-speaking regions come online at 8-10 AM GST.

## RTL-First UI Design

React Native handles RTL automatically when you set `I18nManager.forceRTL(true)`, but the subtleties are brutal:

- Text alignment in mixed Arabic/English content
- Icon mirroring (back arrows, directional indicators)
- Number formatting (Arabic-Indic vs. Western Arabic numerals)
- Keyboard type for Arabic input on iOS vs. Android

The solution was a custom `<RTLText>` component that detects script direction per-string and applies inline direction overrides where needed.

## Stripe Billing

For SaaS billing with Stripe, the key insight is that Arabic-speaking markets often use card networks not well-supported in the EU. I added Mada (Saudi Arabia) and Meeza (Egypt) as payment methods via Stripe's `payment_method_types` array, which immediately unlocked conversion in GCC markets.

## What's Next

The platform is live at [tafkeer-ai.com](https://tafkeer-ai.com). Next milestones: voice-to-voice Arabic conversation (Whisper + TTS), document RAG with Arabic OCR, and a web client.

Building for an underserved market with 400M+ native speakers is not just a moral good — it's an enormous product opportunity that BigTech is still sleeping on.
