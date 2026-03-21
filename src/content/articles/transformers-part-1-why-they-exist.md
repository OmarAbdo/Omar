---
title: "Transformers from Scratch, Part 1: Why They Exist"
date: "2026-02-10"
description: "Before you understand transformers, you need to understand the problem they solved. A developer's guide to sequence models, their limitations, and why attention changed everything."
category: "ai"
tags: ["Transformers", "AI", "Deep Learning", "NLP", "Attention"]
readTime: "9 min read"
---

## You Don't Need to Know ML to Understand This

Most transformer explainers start with the math. That's backwards. You wouldn't explain a database by starting with B-tree rebalancing — you'd start with "we need to store and retrieve data fast."

Transformers solve a specific problem. Once you understand that problem viscerally, the architecture becomes obvious. This is part 1 of a 5-part series where I'll walk through the entire "Attention Is All You Need" paper. You need to know programming. You don't need to know ML. By part 5, you'll understand every component of the architecture that powers GPT, Claude, and every modern AI system.

Let's start with the problem.

## What Sequence Models Actually Do

Language is sequential. "The dog bit the man" and "The man bit the dog" use identical words — the order is the meaning. Any model that processes language needs to understand order.

The tasks we care about all involve sequences:

- **Translation**: input sequence in English → output sequence in German
- **Summarization**: long input sequence → short output sequence
- **Text generation**: prompt sequence → continuation sequence
- **Sentiment analysis**: review sequence → positive/negative

Before 2017, the dominant approach was recurrent neural networks. And they had a fundamental flaw.

## RNNs: One Word at a Time

Picture a factory assembly line. A conveyor belt moves words through a machine one at a time. The machine has a small notebook where it scribbles notes about what it's seen so far. When it reads word 1, it writes some notes. When word 2 arrives, it reads the notes, processes the new word, and updates the notebook.

That's an RNN. The "notebook" is called the hidden state — a vector of numbers that gets updated at every timestep. The hidden state is the model's entire memory of everything it's read so far.

Here's the critical problem: the notebook has a fixed size.

By the time you've processed 50 words, the notes about word 3 have been overwritten, smudged, diluted. The hidden state is a fixed-size vector, and you're asking it to compress an increasingly long history into the same small space. Information from early in the sequence gets crushed.

This is called the **vanishing gradient problem** in technical terms, but the intuition is simpler: RNNs have bad long-term memory. They're like reading a book by looking through a keyhole that moves forward one word at a time — you can see what's in front of you, but the beginning of the chapter is a blur.

## The Bottleneck Problem

It gets worse for translation. In an RNN-based translation system (called sequence-to-sequence or seq2seq), you have two RNNs:

1. **Encoder RNN**: reads the entire English sentence, one word at a time, producing a final hidden state
2. **Decoder RNN**: takes that final hidden state and generates the German translation, one word at a time

The entire meaning of a 40-word English sentence gets compressed into a single vector — the last hidden state of the encoder. That vector is the **bottleneck**. Every nuance, every relationship between words, every grammatical structure — all squeezed through one fixed-size pipe.

Imagine someone reads an entire paragraph, then summarizes it to you in exactly 10 words, and you have to reconstruct the original from those 10 words alone. That's what we were asking these models to do.

![Diagram showing how RNNs compress an entire sentence into a single fixed-size vector, creating an information bottleneck](/images/articles/transformers-part-1/rnn-bottleneck.svg)

Results? Decent for short sentences, terrible for long ones. Translation quality would fall off a cliff past 20-30 words.

## LSTMs: A Better Notebook

In 1997, Hochreiter and Schmidhuber proposed Long Short-Term Memory networks — LSTMs. The core idea: give the model a more sophisticated notebook.

Instead of one hidden state that gets overwritten every step, LSTMs add a **cell state** — a separate memory lane that runs through the entire sequence. Think of it as a highway that information can travel along without being forced through the bottleneck at every step.

LSTMs use three "gates" to manage this memory:

- **Forget gate**: decide what to erase from the cell state ("this word was just an article, I can forget it")
- **Input gate**: decide what new information to write ("this is the subject of the sentence, important")
- **Output gate**: decide what to actually use from memory right now ("I'm generating a verb, I need the subject")

This was a genuine breakthrough. LSTMs could handle longer sequences. They became the backbone of Google Translate, Siri's language understanding, and most NLP systems from 2014 to 2017.

But they inherited RNNs' other critical flaw.

## The Sequential Bottleneck

LSTMs still process one word at a time. Word 1, then word 2, then word 3. You cannot process word 50 until you've processed words 1 through 49.

This means two things:

**Training is slow.** You can't parallelize across time steps. If your sentence is 100 words, you need 100 sequential operations. GPUs are massively parallel processors — thousands of cores sitting idle while you process one word at a time. It's like having a 1000-lane highway and only using one lane.

**Long-range dependencies are still hard.** Even with the cell state highway, information from word 5 has to survive passing through 45 gates to influence the processing of word 50. Each gate is a potential point of information loss. LSTMs are better than vanilla RNNs, but they still struggle with dependencies that span more than ~50-100 tokens in practice.

I experienced this firsthand building Luqman, my trading prediction system. The LSTM layers could capture patterns within a few weeks of price data, but asking them to remember a pattern from 6 months ago? The signal was gone. That's why the architecture uses temporal attention on top of the LSTM — to compensate for exactly this weakness.

## The 2017 Insight

In June 2017, eight researchers at Google published a paper with what might be the most understated title in the history of computer science: "Attention Is All You Need."

Their insight was radical: **what if you didn't process words sequentially at all?**

What if, instead of reading a sentence word by word like an assembly line, you could look at every word simultaneously? What if word 50 could directly interact with word 3 without going through 47 intermediate steps?

This is like the difference between sending a message through a chain of 47 people (each one whispering to the next) versus just... walking across the room and talking to the person directly.

The mechanism that makes this possible is called **attention**.

## How Your Brain Already Does This

Read this sentence:

> "The cat sat on the mat because **it** was tired."

What does "it" refer to? You instantly know it's "the cat." Not "the mat." How?

You didn't process this sentence left to right, keeping a running hidden state. Your brain did something far more sophisticated — it looked at the word "it," scanned backward and forward across the entire sentence, and computed which other words are most relevant. "Tired" is a property of living things, "cat" is alive, "mat" is not — therefore "it" = "cat."

That's attention. It's a mechanism that lets each word look at every other word in the sentence and decide which ones matter for understanding its meaning in context.

![Illustration of attention intuition showing how the word "it" attends to "cat" rather than "mat" based on contextual relevance](/images/articles/transformers-part-1/attention-intuition.svg)

Now consider a harder example:

> "The animal didn't cross the street because **it** was too wide."

Here "it" = "the street." Same sentence structure, but the word "wide" changes which noun "it" refers to. An attention mechanism needs to capture this — and it does, because "wide" attends strongly to "street" and weakly to "animal."

## What Attention Gives You

Attention solves both problems that plagued RNNs and LSTMs:

**No more information bottleneck.** Every word can directly access every other word. Word 50 doesn't need to hope that information about word 3 survived 47 steps of processing — it can look at word 3 directly. The path length between any two words is 1, not N.

**Full parallelization.** Since every word can attend to every other word simultaneously, you can compute all these relationships in parallel. Instead of 100 sequential steps for a 100-word sentence, you do it in one step (well, one matrix multiplication). GPUs light up. Training that took weeks takes days.

The 2017 paper demonstrated this concretely: their transformer model achieved state-of-the-art translation quality while training in a fraction of the time. The English-to-German model trained in 3.5 days on 8 GPUs. The previous best models needed weeks.

## The Catch

There is a cost to looking at everything simultaneously: **quadratic complexity**. If your sequence has N words, each word attends to all N others, so you compute N² attention scores. Double the sequence length, quadruple the compute.

For a 100-word sentence, that's 10,000 attention scores — trivial. For a 10,000-token document, it's 100 million. For a 100,000-token book, it's 10 billion. This is why language models have context length limits, and why extending them is an active area of research.

But for the sequence lengths that mattered in 2017 — sentences and paragraphs — the quadratic cost was a bargain compared to the sequential bottleneck of RNNs.

## What's Coming Next

This part gave you the why. The transformer exists because sequential processing was too slow and too forgetful, and attention lets you process everything in parallel while maintaining direct connections between distant words.

In Part 2, I'll open the hood on the attention mechanism itself. You'll learn what Queries, Keys, and Values actually are, walk through the math with real numbers, and implement self-attention from scratch in Python.

The math is simpler than you think. It's three matrix multiplications and a softmax. That's it. That's the mechanism that powers every modern AI system.

<div style="display:flex;justify-content:flex-end;gap:1rem;margin-top:2rem">
  <a href="/articles/transformers-part-2-self-attention">Part 2: Self-Attention Explained →</a>
</div>
