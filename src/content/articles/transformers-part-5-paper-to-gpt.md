---
title: "Transformers from Scratch, Part 5: From Paper to GPT"
date: "2026-03-18"
description: "How a 2017 translation paper became the foundation for GPT, BERT, and every modern AI system. The evolution from 'Attention Is All You Need' to the models we use today."
category: "ai"
tags: ["Transformers", "GPT", "BERT", "LLMs", "AI History"]
readTime: "10 min read"
---

## From Translation to Everything

The 2017 paper was about machine translation. Eight researchers at Google built a model to convert English sentences to German sentences. That's it. They did not set out to create the architecture behind ChatGPT, Claude, Gemini, Copilot, Midjourney, AlphaFold, or autonomous driving perception systems.

But that's exactly what happened. The transformer turned out to be a general-purpose computation engine that works on any sequential data — and almost everything is sequential if you look at it the right way. Text is a sequence of tokens. Images are a sequence of patches. Audio is a sequence of samples. Protein structures are sequences of amino acids.

The story of how a translation paper became the foundation of modern AI is really two stories: the BERT path and the GPT path.

## Encoder-Only: BERT and Understanding

In 2018, Google published BERT (Bidirectional Encoder Representations from Transformers). The key insight: take the transformer's encoder, throw away the decoder, and train it with a clever objective.

BERT's training task is **masked language modeling**. Take a sentence, randomly hide 15% of the words, and train the model to predict what's missing:

```
Input:  "The [MASK] sat on the [MASK] because it was tired"
Target: "The  cat   sat on the  mat   because it was tired"
```

Because the encoder uses **bidirectional** self-attention (no causal mask), every word can attend to every other word, including words that come after the masked position. This is fundamentally different from left-to-right generation — BERT reads the whole sentence to understand each word.

BERT was extraordinary for **understanding** tasks:

- Sentiment analysis: is this review positive or negative?
- Named entity recognition: which words are people, places, organizations?
- Question answering: given a paragraph, find the answer to a question
- Natural language inference: does sentence A entail sentence B?

Pre-train BERT once on massive text data, then fine-tune on your specific task with a tiny labeled dataset. This "pre-train then fine-tune" paradigm demolished every NLP benchmark in 2018-2019. Tasks that previously required custom architectures could all be solved by BERT + a simple output layer.

## Decoder-Only: GPT and Generation

OpenAI took the opposite approach. In 2018 (just months before BERT), they published GPT (Generative Pre-trained Transformer). Take the transformer's decoder, throw away the encoder, and train it to predict the next word:

```
Input:  "The cat sat on the"
Target: "cat sat on the mat"
```

This is autoregressive language modeling — predict the next token given all previous tokens. The causal mask ensures the model never sees the future. It's the same masked self-attention from Part 3, but now it's the entire model, not just half of it.

GPT-1 had 117 million parameters and was a proof of concept. It showed that a decoder-only transformer, pre-trained on next-token prediction, could be fine-tuned for various tasks. The results were good but not spectacular. BERT was getting more attention.

Then GPT-2 happened.

## The Scaling Surprise

GPT-2 (2019) scaled to 1.5 billion parameters — 13x larger than GPT-1. OpenAI trained it on 40GB of internet text and discovered something unexpected: the model could perform tasks it was never explicitly trained for.

Without any fine-tuning, GPT-2 could:
- Summarize articles (just prompt it with "TL;DR:")
- Answer questions (format the prompt as Q&A)
- Translate between languages (give it a few examples)

This was the first glimpse of **in-context learning** — the model figures out the task from the prompt itself. Nobody designed this capability. It emerged from scale.

OpenAI famously called GPT-2 "too dangerous to release" (they later released it fully). The hype was overblown — GPT-2's outputs were fluent but often incoherent. But the trajectory was clear.

## GPT-3: The Phase Transition

GPT-3 (2020) scaled to 175 billion parameters — 100x larger than GPT-2. And something qualitatively different happened.

**Few-shot learning worked reliably.** Give GPT-3 three examples of a task in the prompt, and it could generalize to new inputs:

```
Translate English to French:
sea otter => loutre de mer
peppermint => menthe poivr e
cheese => fromage
cat =>
```

GPT-3 outputs "chat." No fine-tuning. No gradient updates. Just pattern matching in context.

The paper demonstrated this across dozens of tasks — translation, arithmetic, code generation, common sense reasoning. Performance scaled smoothly with model size on a log scale. The researchers coined the term **scaling laws**: predictable relationships between model size, dataset size, compute, and performance.

This was the moment the field realized that decoder-only transformers weren't just text generators — they were general-purpose reasoning engines that got better with scale in ways nobody had theorized.

![Timeline showing the evolution of transformer models from the 2017 paper through BERT, GPT-2, GPT-3, GPT-4, and Claude](/images/articles/transformers-part-5/model-evolution.svg)

## Why Decoder-Only Won

Both approaches — encoder-only (BERT) and decoder-only (GPT) — use the same fundamental mechanism (self-attention). So why did decoder-only become the dominant paradigm?

**Generation is harder and more general than understanding.** A model that can generate coherent text necessarily understands text. The reverse isn't true — BERT understands text well but can't generate it naturally.

**Fine-tuning doesn't scale.** BERT requires task-specific fine-tuning — a different model for sentiment, a different model for QA, a different model for NER. GPT-3 showed you could do all tasks with one model, just by changing the prompt. At enterprise scale, maintaining one model is vastly simpler than maintaining dozens.

**Scaling laws favor generation.** Encoder-only models hit diminishing returns faster. The pre-training objective (mask prediction) saturates — there's only so much you can learn from fill-in-the-blank. Next-token prediction on diverse internet text has a much higher ceiling because it implicitly requires world knowledge, reasoning, and style control.

**Instruction tuning and RLHF.** GPT-3.5 and ChatGPT added supervised fine-tuning on instruction-following data and Reinforcement Learning from Human Feedback (RLHF). This turned a next-token predictor into an assistant that follows instructions, refuses harmful requests, and admits uncertainty. BERT's architecture doesn't naturally accommodate this conversational interface.

## The GPT-4, Claude, and Beyond Era

GPT-4 (2023) and Claude 3 (2024) represent the current state of the art. The exact architectures are proprietary, but the foundation is the same transformer decoder with refinements:

- **Longer context windows**: the original transformer handled 512 tokens. GPT-4 handles 128K. Claude handles 200K+. Techniques like RoPE (Rotary Position Embeddings) and ALiBi replaced the original sinusoidal positional encoding.
- **Mixture of Experts (MoE)**: instead of one massive feed-forward network, use many smaller "expert" networks and route each token to the most relevant ones. This allows trillion-parameter models that only activate a fraction of parameters per token.
- **RLHF and Constitutional AI**: post-training alignment techniques that shape model behavior beyond raw language modeling.
- **Multimodal inputs**: vision transformers (ViT) process images as sequences of patches using the same attention mechanism. Modern models handle text, images, audio, and video.

But strip away the engineering refinements and it's still: embeddings → positional encoding → masked self-attention → feed-forward → repeat N times → predict next token. The 2017 paper is still the blueprint.

## What the Paper Got Right

1. **Attention is sufficient.** You genuinely don't need recurrence or convolution for sequence processing. The paper's title was not hype — it was a literal statement that turned out to be true far beyond the authors' expectations.

2. **Parallelization matters more than architectural cleverness.** The transformer's practical advantage — that it trains fast on GPUs — turned out to be more important than any theoretical property. The model that trains 10x faster can be 10x bigger on the same budget.

3. **The architecture is general.** Nothing about the transformer is specific to translation or even language. Attention over sequences works for any domain where relationships between elements matter.

## What It Didn't Anticipate

1. **Scaling laws.** The paper didn't predict that simply making the model bigger would unlock qualitatively new capabilities. Emergent abilities — arithmetic, chain-of-thought reasoning, in-context learning — were not foreseeable from the 2017 results.

2. **Decoder-only dominance.** The paper proposed an encoder-decoder architecture for translation. The field converged on decoder-only for almost everything. The encoder turned out to be unnecessary when you have enough data and parameters.

3. **Post-training as a distinct discipline.** RLHF, instruction tuning, Constitutional AI — the idea that a pre-trained model needs extensive additional training to be useful was not part of the 2017 vision. The paper was about training a model from scratch for a specific task. The pre-train → fine-tune → align pipeline that defines modern LLMs is a later innovation.

4. **The societal impact.** Eight researchers solved a translation problem. Nine years later, their architecture powers systems that write code, generate art, pass bar exams, and automate jobs. The gap between the paper's scope and its consequences is unlike anything in computer science history.

## The Paper Is 11 Pages. Read It.

"Attention Is All You Need" by Vaswani et al. is freely available on arXiv. It's 11 pages plus references. You now have the background to understand every section.

Here's what you'll find:

- Section 1: Introduction (the motivation we covered in Part 1)
- Section 3: Model architecture (Parts 2 and 3 of this series)
- Section 5: Training (Part 4)
- Section 6: Results (the BLEU scores I quoted)
- Table 3: Ablation studies showing which components matter most

The writing is dense but clear. The figures are some of the most reproduced in all of computer science. Figure 2 (the architecture diagram) has been cited, redrawn, and memed more than any other technical figure I can think of.

When I was building Luqman and needed to add temporal attention to the LSTM stack, understanding the original paper — not a blog post summary, not a YouTube video — is what made the implementation click. When I was selecting models for Tafkeer via OpenRouter, understanding the BERT vs. GPT lineage helped me pick the right model for each task type. The paper is the source. Everything else is a derivative.

Reading the original is a 45-minute investment. You've spent longer than that reading this series. Go read it.

## Series Recap

- **Part 1**: RNNs are slow and forgetful. Attention lets every word see every other word in parallel.
- **Part 2**: Self-attention is Q×K (find relevant words) → softmax (normalize) → ×V (extract information). Multi-head attention runs this 8 ways in parallel.
- **Part 3**: The full architecture is encoder (self-attention + FFN × 6) and decoder (masked self-attention + cross-attention + FFN × 6), held together by residual connections, layer norm, and positional encoding.
- **Part 4**: Training uses teacher forcing, BPE tokenization, cross-entropy loss with label smoothing, and a learning rate warmup schedule. The results beat every existing model while training faster.
- **Part 5**: The architecture generalized far beyond translation. Decoder-only models (GPT) won over encoder-only (BERT) because generation is more general than understanding, and scaling laws favor next-token prediction.

The entire modern AI industry runs on one mechanism: scaled dot-product attention. Now you understand it from the ground up.

<div style="display:flex;justify-content:flex-start;gap:1rem;margin-top:2rem">
  <a href="/articles/transformers-part-4-training">← Part 4: Training the Model</a>
</div>
