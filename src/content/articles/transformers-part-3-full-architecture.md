---
title: "Transformers from Scratch, Part 3: The Full Architecture"
date: "2026-02-27"
description: "Encoder, decoder, positional encoding, residual connections, layer normalization — every component of the transformer architecture explained and connected."
category: "ai"
tags: ["Transformers", "Architecture", "Deep Learning", "Encoder-Decoder", "PyTorch"]
readTime: "12 min read"
---

## Every Piece, Connected

In Part 1, you learned why transformers exist. In Part 2, you implemented self-attention from scratch. Now we assemble the full machine.

The original transformer has two halves — an encoder and a decoder — and each half is built from the same small set of components stacked on top of each other. Once you understand the five building blocks, the whole architecture is just Lego.

Here are the five blocks: self-attention, cross-attention, feed-forward network, layer normalization, and positional encoding. You already know the first one. Let's build the rest.

![Overview of the full transformer architecture showing encoder and decoder stacks with all components](/images/articles/transformers-part-3/transformer-architecture.svg)

## Positional Encoding: Teaching Order to a Parallel System

Self-attention has a problem. Run it on "dog bites man" and "man bites dog" — you get the same attention scores. The dot products between Q and K don't depend on word order. Every word can see every other word, but nobody knows where they are in the sequence.

This is like having a meeting where everyone can hear everyone else, but nobody knows who spoke first, second, or third. The words are all present, but the sentence structure is lost.

The fix: before feeding words into the transformer, add a positional signal to each word's embedding. The paper uses sine and cosine functions at different frequencies:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

Where `pos` is the word's position (0, 1, 2, ...) and `i` is the dimension index.

This looks intimidating. Here's the intuition: think of it like a clock. The seconds hand moves fast (high frequency), the minutes hand moves slower, and the hours hand moves slowest. Each position in the sequence gets a unique combination of fast-moving and slow-moving signals — like a timestamp.

Why sine and cosine specifically? Two reasons:

1. **Relative positions are learnable.** For any fixed offset k, PE(pos+k) can be expressed as a linear transformation of PE(pos). This means the model can learn "3 words apart" as a pattern, regardless of absolute position.
2. **Bounded values.** Sin and cos stay between -1 and 1, which keeps the numerical values stable.

```python
import torch
import math

class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 5000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model)
        )

        pe[:, 0::2] = torch.sin(position * div_term)  # even dimensions
        pe[:, 1::2] = torch.cos(position * div_term)  # odd dimensions

        pe = pe.unsqueeze(0)  # (1, max_len, d_model)
        self.register_buffer('pe', pe)

    def forward(self, x):
        # x: (batch, seq_len, d_model)
        return x + self.pe[:, :x.size(1), :]
```

The positional encoding is **added** to the word embedding, not concatenated. This means the model operates on vectors that carry both semantic meaning (from the embedding) and positional information (from the encoding) in the same space.

![Visualization of positional encoding showing sine and cosine waves at different frequencies encoding each position](/images/articles/transformers-part-3/positional-encoding.svg)

## The Feed-Forward Network: Thinking Locally

After attention lets every word gather context from other words, the feed-forward network (FFN) processes each word's representation independently. It's two linear transformations with a ReLU in between:

```python
class FeedForward(nn.Module):
    def __init__(self, d_model: int = 512, d_ff: int = 2048):
        super().__init__()
        self.linear1 = nn.Linear(d_model, d_ff)
        self.relu = nn.ReLU()
        self.linear2 = nn.Linear(d_ff, d_model)

    def forward(self, x):
        return self.linear2(self.relu(self.linear1(x)))
```

Notice d_ff = 2048, four times larger than d_model = 512. The network expands the representation into a higher-dimensional space, applies a non-linearity, and compresses back down. Think of it as: attention gathers relevant context, then the FFN processes that context to extract higher-level features.

The FFN is applied **independently** to each position. Word 3's FFN computation doesn't see word 7. All inter-word communication happens in the attention layers.

## Residual Connections and Layer Normalization

These two components are less glamorous but absolutely essential. Without them, deep transformers don't train.

### Residual Connections (Skip Connections)

Instead of computing `output = SubLayer(x)`, you compute `output = x + SubLayer(x)`. The input skips over the sublayer and gets added to its output.

Why? In a deep network with 6+ layers, gradients need to flow backward through every layer during training. Each layer is a potential point where the gradient shrinks toward zero (vanishes) or explodes toward infinity. Residual connections provide a highway for gradients to flow directly from later layers to earlier layers, bypassing the transformations in between.

It's the same principle as the LSTM cell state highway I described in Part 1 — except here it's between layers rather than between timesteps.

### Layer Normalization

After the residual connection, the values get normalized:

```python
class LayerNorm(nn.Module):
    def __init__(self, d_model: int, eps: float = 1e-6):
        super().__init__()
        self.gamma = nn.Parameter(torch.ones(d_model))
        self.beta = nn.Parameter(torch.zeros(d_model))
        self.eps = eps

    def forward(self, x):
        mean = x.mean(-1, keepdim=True)
        std = x.std(-1, keepdim=True)
        return self.gamma * (x - mean) / (std + self.eps) + self.beta
```

Layer norm computes the mean and standard deviation across the feature dimension for each position independently, then normalizes. This prevents the values from drifting too high or too low as they pass through multiple layers — keeping the network numerically stable.

The paper uses the pattern: **SubLayer → Residual Add → Layer Norm** at every step.

## The Encoder Stack

Now we can build the encoder. Each encoder layer does:

1. Multi-head self-attention (every word attends to every other word)
2. Add & normalize (residual connection + layer norm)
3. Feed-forward network (each word processed independently)
4. Add & normalize

Stack 6 of these layers on top of each other. The output of layer 1 feeds into layer 2, and so on.

```python
class EncoderLayer(nn.Module):
    def __init__(self, d_model: int = 512, n_heads: int = 8, d_ff: int = 2048, dropout: float = 0.1):
        super().__init__()
        self.self_attn = MultiHeadSelfAttention(d_model, n_heads)
        self.ff = FeedForward(d_model, d_ff)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # Self-attention with residual + norm
        attn_output = self.self_attn(x, mask)
        x = self.norm1(x + self.dropout(attn_output))

        # Feed-forward with residual + norm
        ff_output = self.ff(x)
        x = self.norm2(x + self.dropout(ff_output))

        return x

class Encoder(nn.Module):
    def __init__(self, n_layers: int = 6, d_model: int = 512, n_heads: int = 8, d_ff: int = 2048):
        super().__init__()
        self.layers = nn.ModuleList([
            EncoderLayer(d_model, n_heads, d_ff) for _ in range(n_layers)
        ])

    def forward(self, x, mask=None):
        for layer in self.layers:
            x = layer(x, mask)
        return x
```

After 6 layers, each word's representation has been enriched with deep contextual information from all other words. Word 1's output vector doesn't just represent word 1 — it represents word 1 in the context of the entire sentence, processed through 6 rounds of increasingly sophisticated attention.

## The Decoder Stack

The decoder is where things get interesting. It has the same structure as the encoder but with one crucial addition: **cross-attention**.

Each decoder layer does:

1. **Masked self-attention** (attend to previous output words only)
2. Add & normalize
3. **Cross-attention** (attend to the encoder's output)
4. Add & normalize
5. Feed-forward network
6. Add & normalize

### Masked Self-Attention: No Peeking

During translation, the decoder generates one word at a time. When generating word 5, it should only see words 1–4 (the words it's already generated), not words 6, 7, 8 (the future).

The mask is a triangular matrix that sets future positions to negative infinity before the softmax, effectively zeroing out those attention weights:

```python
def create_causal_mask(seq_len: int) -> torch.Tensor:
    """Lower triangular mask: position i can attend to positions 0..i"""
    mask = torch.tril(torch.ones(seq_len, seq_len)).unsqueeze(0).unsqueeze(0)
    return mask  # (1, 1, seq_len, seq_len)
```

Position 0 can only see position 0. Position 3 can see positions 0, 1, 2, 3. Position 7 can see positions 0 through 7. This is how the model maintains the autoregressive property — generating left to right without seeing the future.

### Cross-Attention: Reading the Source

Cross-attention is the bridge between encoder and decoder. It works exactly like self-attention, but the **Keys and Values come from the encoder's output**, while the **Queries come from the decoder**.

Think of it this way: the decoder is asking "what parts of the input sentence are relevant for generating the next output word?" The Query is the decoder's current state, and it searches over the encoder's Keys to find the most relevant source words, then pulls their Values.

For translation, this is the mechanism that lets the model look at the right part of the English sentence when generating each German word. When outputting the German verb, the cross-attention heads attend strongly to the English verb.

```python
class DecoderLayer(nn.Module):
    def __init__(self, d_model: int = 512, n_heads: int = 8, d_ff: int = 2048, dropout: float = 0.1):
        super().__init__()
        self.self_attn = MultiHeadSelfAttention(d_model, n_heads)
        self.cross_attn = MultiHeadSelfAttention(d_model, n_heads)
        self.ff = FeedForward(d_model, d_ff)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.norm3 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, encoder_output, src_mask=None, tgt_mask=None):
        # Masked self-attention
        attn_output = self.self_attn(x, tgt_mask)
        x = self.norm1(x + self.dropout(attn_output))

        # Cross-attention: Q from decoder, K/V from encoder
        # (in practice, cross_attn takes separate Q, K, V sources)
        cross_output = self.cross_attn.cross_forward(x, encoder_output, src_mask)
        x = self.norm2(x + self.dropout(cross_output))

        # Feed-forward
        ff_output = self.ff(x)
        x = self.norm3(x + self.dropout(ff_output))

        return x
```

## The Complete Picture

Here's how data flows through the full transformer for a translation task:

**Encoder side (processes input sentence once):**
1. English words → embeddings → add positional encoding
2. Pass through 6 encoder layers (self-attention → FFN, each with residual + norm)
3. Output: rich contextual representations of each English word

**Decoder side (generates output word by word):**
1. Previously generated German words → embeddings → add positional encoding
2. Masked self-attention (only see past outputs)
3. Cross-attention (look at encoder output to find relevant English words)
4. FFN → repeat for 6 layers
5. Final linear layer + softmax → probability distribution over German vocabulary
6. Pick the most probable word, add it to the sequence, repeat

During training, the decoder sees the entire correct German translation at once (with masking to prevent cheating). During inference, it genuinely generates one word at a time, feeding each new word back as input.

## The Numbers from the Paper

The original transformer's dimensions:

| Component | Value |
|---|---|
| d_model (embedding dimension) | 512 |
| n_heads (attention heads) | 8 |
| d_k (dimension per head) | 64 |
| d_ff (feed-forward inner dimension) | 2048 |
| Encoder layers | 6 |
| Decoder layers | 6 |
| Total parameters | ~65 million |

65 million parameters. GPT-4 is estimated at over a trillion. But the architecture is fundamentally the same — just scaled up with more layers, wider dimensions, and longer context windows.

## Why This Design Works

Every component serves a clear purpose:

- **Self-attention**: lets every word see every other word (global context)
- **Feed-forward**: processes each position's gathered context (local computation)
- **Residual connections**: ensures gradients flow through deep stacks
- **Layer norm**: keeps numerical values stable across layers
- **Positional encoding**: preserves word order without sequential processing
- **Cross-attention**: connects encoder and decoder (source informs target)
- **Masking**: prevents decoder from seeing future tokens

Remove any one of these and the model either won't train or won't perform well. The paper's genius wasn't any single component — attention existed before, residual connections existed before, layer norm existed before. The genius was assembling them into this specific configuration and proving that you don't need recurrence at all.

In Part 4, we'll look at how this architecture actually gets trained — the loss function, tokenization, the clever learning rate schedule, and the results that shocked the field.

<div style="display:flex;justify-content:space-between;gap:1rem;margin-top:2rem">
  <a href="/articles/transformers-part-2-self-attention">← Part 2: Self-Attention</a>
  <a href="/articles/transformers-part-4-training">Part 4: Training the Model →</a>
</div>
