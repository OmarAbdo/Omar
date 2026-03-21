---
title: "Transformers from Scratch, Part 2: Self-Attention Explained"
date: "2026-02-18"
description: "Queries, Keys, and Values — the mechanism that makes transformers work. Explained with a library analogy, walked through with real numbers, and implemented in Python."
category: "ai"
tags: ["Transformers", "Self-Attention", "Deep Learning", "Python", "PyTorch"]
readTime: "11 min read"
---

## The Single Most Important Mechanism in Modern AI

If you understand self-attention, you understand 80% of what makes transformers work. Everything else — positional encoding, layer normalization, the encoder-decoder split — is scaffolding around this one idea.

In Part 1, I explained *why* attention exists: RNNs are too slow and too forgetful. Now I'll show you *how* it works. We'll start with intuition, move to real numbers, and end with working Python code.

## The Library Analogy

Imagine you're in a library looking for information about "machine learning optimization."

**Your Query (Q)**: "machine learning optimization" — what you're looking for.

**Each book's Key (K)**: the title and subject tags on each book's spine — what each book advertises itself as being about.

**Each book's Value (V)**: the actual content inside each book — the information you'd get if you chose it.

Here's how you search:

1. You compare your **Query** against every book's **Key** (scan the spines)
2. Books with keys that closely match your query get a high relevance score
3. You pull information from the **Values** of the most relevant books, weighted by those scores

Self-attention works identically, except every word in the sentence is simultaneously the searcher *and* a book on the shelf. Each word generates its own Query ("what am I looking for?"), its own Key ("what am I about?"), and its own Value ("what information do I contain?").

## Let's Do It with Real Numbers

Take the sentence: **"I love cold pizza"**

### Step 1: Start with Embeddings

Each word gets converted to a vector (a list of numbers). In reality these are 512-dimensional, but I'll use 4 dimensions to keep it readable:

```
"I"     → [1.0, 0.5, 0.3, 0.8]
"love"  → [0.7, 0.9, 0.1, 0.4]
"cold"  → [0.2, 0.3, 0.8, 0.6]
"pizza" → [0.5, 0.7, 0.6, 0.9]
```

### Step 2: Generate Q, K, V

Each word's embedding gets multiplied by three different weight matrices (W_Q, W_K, W_V) to produce its Query, Key, and Value vectors. These weight matrices are learned during training — the model figures out what makes a good query, key, and value.

For simplicity, let's say after this transformation:

```
       Query           Key             Value
"I"    [1.2, 0.8]     [0.9, 1.1]     [0.5, 0.3]
"love" [0.5, 1.3]     [1.0, 0.4]     [0.8, 0.7]
"cold" [0.9, 0.2]     [0.3, 0.8]     [0.2, 0.9]
"pizza"[0.7, 1.0]     [0.8, 0.9]     [0.6, 0.5]
```

### Step 3: Compute Attention Scores

Now each word compares its Query with every word's Key using a dot product. Let's compute the scores for the word "love" (its Query is [0.5, 1.3]):

```
love_Q · I_K     = (0.5)(0.9) + (1.3)(1.1) = 0.45 + 1.43 = 1.88
love_Q · love_K  = (0.5)(1.0) + (1.3)(0.4) = 0.50 + 0.52 = 1.02
love_Q · cold_K  = (0.5)(0.3) + (1.3)(0.8) = 0.15 + 1.04 = 1.19
love_Q · pizza_K = (0.5)(0.8) + (1.3)(0.9) = 0.40 + 1.17 = 1.57
```

Raw scores for "love": **[1.88, 1.02, 1.19, 1.57]**

### Step 4: Scale by √d_k

The raw scores get divided by the square root of the key dimension. Our keys have dimension 2, so we divide by √2 ≈ 1.41:

```
Scaled scores: [1.33, 0.72, 0.84, 1.11]
```

### Step 5: Softmax

Apply softmax to convert scores into probabilities that sum to 1:

```
Attention weights: [0.33, 0.18, 0.20, 0.27]
```

This means when processing "love," the model pays 33% attention to "I," 18% to itself, 20% to "cold," and 27% to "pizza." The word "love" is most influenced by "I" and "pizza" — which makes intuitive sense. "I love pizza" is the core meaning.

### Step 6: Weighted Sum of Values

Multiply each word's Value by its attention weight and sum:

```
output = 0.33 × [0.5, 0.3] + 0.18 × [0.8, 0.7] + 0.20 × [0.2, 0.9] + 0.27 × [0.6, 0.5]
       = [0.165, 0.099] + [0.144, 0.126] + [0.040, 0.180] + [0.162, 0.135]
       = [0.511, 0.540]
```

That final vector [0.511, 0.540] is the new representation of the word "love" — enriched with contextual information from all other words in the sentence. It no longer just means "love" in isolation; it means "love" as in "I love pizza."

![Diagram of the Query, Key, Value mechanism showing how each word generates Q, K, V vectors and computes attention scores](/images/articles/transformers-part-2/qkv-mechanism.svg)

## Why Divide by √d_k?

This is one of those details that seems arbitrary but is critical. Without the scaling, here's what happens:

When the key dimension d_k is large (like 64 in the real transformer), dot products produce large numbers. Feed large numbers into softmax, and you get outputs extremely close to 0 and 1 — the softmax saturates.

Why is saturation bad? Because the gradients of softmax near 0 and 1 are essentially zero. The model can't learn. It's like trying to steer a car whose steering wheel is locked — the wheel is technically turnable, but the force required is impractical.

Dividing by √d_k keeps the dot products in a range where softmax has healthy gradients. The paper's authors worked this out by noting that if Q and K entries are independent random variables with mean 0 and variance 1, then the dot product has variance d_k. Dividing by √d_k normalizes it back to variance 1.

Simple fix, massive impact.

## Multi-Head Attention: Why One Perspective Isn't Enough

Consider the sentence: "The cat sat on the mat because it was tired."

A single attention computation gives each word one way to relate to other words. But language has many simultaneous relationship types:

- **Syntactic**: "it" is a pronoun that should link to "cat" (its grammatical antecedent)
- **Semantic**: "tired" relates to "cat" (living things get tired)
- **Positional**: "sat" relates to "on" (verb-preposition pair)

Asking one set of Q/K/V to capture all these relationships simultaneously is asking too much. It's like asking a single camera to simultaneously capture wide-angle, macro, and infrared views.

The solution: **multi-head attention**. Instead of one set of Q/K/V matrices, use 8 (or however many heads you want). Each head has its own W_Q, W_K, W_V, and computes attention independently. Then concatenate all the outputs and project back down.

```
Head 1 might learn: syntactic relationships (subject-verb agreement)
Head 2 might learn: coreference (what does "it" refer to?)
Head 3 might learn: semantic similarity (which words are topically related?)
Head 4 might learn: positional patterns (adjacent word relationships)
... and so on for all 8 heads
```

Nobody designs what each head learns — they self-organize during training. When researchers visualize trained attention heads, they consistently find heads that specialize in different linguistic phenomena. The model discovers useful relationship types on its own.

The computational cost is identical to single-head attention. If your model dimension is 512 and you use 8 heads, each head operates on 512/8 = 64 dimensions. Eight parallel 64-d attentions cost the same as one 512-d attention.

![Diagram showing multi-head attention with multiple parallel attention heads each capturing different relationship types](/images/articles/transformers-part-2/multi-head-attention.svg)

## The Full Equation

The paper's attention formula, which you now understand completely:

**Attention(Q, K, V) = softmax(QK^T / √d_k) V**

That's it. Matrix multiply Q by K-transposed, scale, softmax, multiply by V. Three matrix multiplications and a softmax. This is the mechanism that powers GPT, Claude, Gemini, and every other modern language model.

## Implementation from Scratch

Here's self-attention in PyTorch. Not a simplified toy version — this is the real mechanism:

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadSelfAttention(nn.Module):
    def __init__(self, d_model: int = 512, n_heads: int = 8):
        super().__init__()
        assert d_model % n_heads == 0, "d_model must be divisible by n_heads"

        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads  # dimension per head

        # Q, K, V projections — all in one matrix for efficiency
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)

        # Final projection after concatenating heads
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, x: torch.Tensor, mask: torch.Tensor = None):
        batch_size, seq_len, _ = x.shape

        # Project to Q, K, V
        Q = self.W_q(x)  # (batch, seq_len, d_model)
        K = self.W_k(x)
        V = self.W_v(x)

        # Reshape to (batch, n_heads, seq_len, d_k)
        Q = Q.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        K = K.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        V = V.view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)

        # Scaled dot-product attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)

        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))

        weights = F.softmax(scores, dim=-1)  # (batch, n_heads, seq_len, seq_len)

        # Weighted sum of values
        context = torch.matmul(weights, V)  # (batch, n_heads, seq_len, d_k)

        # Concatenate heads and project
        context = context.transpose(1, 2).contiguous().view(batch_size, seq_len, self.d_model)
        output = self.W_o(context)

        return output

# Quick test
attn = MultiHeadSelfAttention(d_model=512, n_heads=8)
x = torch.randn(2, 10, 512)  # batch of 2 sentences, 10 words each
out = attn(x)
print(out.shape)  # torch.Size([2, 10, 512])
```

Walk through the key moves:

1. **Three linear projections** create Q, K, V from the input
2. **Reshape and transpose** splits d_model into n_heads parallel streams
3. **Scaled dot-product** computes attention scores
4. **Masking** (optional) hides certain positions — we'll use this in the decoder
5. **Softmax** normalizes scores to weights
6. **Matrix multiply with V** produces context-aware representations
7. **Concatenate and project** merges all heads back together

The mask parameter will become important in Part 3 when we build the decoder — it prevents the model from cheating by looking at future tokens during generation.

## What Just Happened

Each word started as an isolated vector. After self-attention, each word's vector has been enriched with information from every other word, weighted by relevance. The word "love" went from meaning "love in general" to meaning "the specific love relationship between I and pizza in this sentence."

And this happens in one parallel operation. No sequential processing. No information bottleneck. Every word talks to every other word directly.

In Part 3, we'll zoom out and see how self-attention fits into the full transformer architecture — the encoder stack, the decoder stack, positional encoding, and all the other components that make it work end to end.

<div style="display:flex;justify-content:space-between;gap:1rem;margin-top:2rem">
  <a href="/articles/transformers-part-1-why-they-exist">← Part 1: Why They Exist</a>
  <a href="/articles/transformers-part-3-full-architecture">Part 3: The Full Architecture →</a>
</div>
