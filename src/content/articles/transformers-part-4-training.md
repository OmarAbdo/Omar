---
title: "Transformers from Scratch, Part 4: Training the Model"
date: "2026-03-08"
description: "Teacher forcing, tokenization, loss functions, and the learning rate schedule that made it all work — how the original transformer was actually trained."
category: "ai"
tags: ["Transformers", "Training", "Deep Learning", "Tokenization", "PyTorch"]
readTime: "10 min read"
---

## Architecture Means Nothing Without Training

You can design the most elegant neural network in history, but if you train it wrong, it's a random number generator. The transformer paper didn't just propose an architecture — it described a very specific training recipe, and some of the choices are non-obvious.

This is the part most explainers skip. They show you the attention mechanism, maybe the encoder-decoder diagram, and then hand-wave at "and then we train it." But the training details are where the real engineering lives.

## Tokenization: Why "Transformer" Becomes ["Trans", "former"]

Before anything else, we need to convert text into numbers. The naive approach — one integer per word — doesn't work because:

1. **Vocabulary explosion.** English has ~170,000 words in current use. Add proper nouns, technical terms, misspellings, and other languages, and you're looking at millions. Each word needs its own row in the embedding matrix, and a million-row matrix is prohibitively large.
2. **Unknown words.** Any word not in your vocabulary is a mystery. "Cryptocurrency" in 2015 would have been an unknown token.

The solution: **subword tokenization**. Instead of whole words, break text into frequent subword units. The paper used Byte-Pair Encoding (BPE), and here's how it works:

Start with individual characters as your vocabulary. Scan the training data and find the most frequent pair of adjacent tokens. Merge that pair into a single token. Repeat thousands of times.

```
Initial:  t h e _ c a t _ s a t
After merges:
  "th" is frequent → merge
  "the" is frequent → merge
  "at" is frequent → merge
  "the_" (the + space) → merge
  "cat" → merge
  "sat" → merge
  ...
```

After 37,000 merge operations (the number used in the paper), you get a vocabulary that includes common whole words ("the," "and," "is"), frequent subwords ("trans," "former," "tion"), and individual characters as fallback. Every possible string can be encoded — no unknowns.

The practical result:

```
"transformer" → ["trans", "former"]
"unhappiness" → ["un", "happiness"]
"GPT"         → ["G", "PT"]
"Tafkeer"     → ["T", "af", "ke", "er"]
```

This is elegant. Common words are single tokens (fast to process). Rare words decompose into meaningful subparts. The model can even handle words it's never seen before by understanding their parts.

![Illustration of Byte-Pair Encoding tokenization showing how words are split into subword tokens](/images/articles/transformers-part-4/tokenization.svg)

Modern variants like WordPiece (used by BERT) and SentencePiece (used by most current models) work on the same principle with slightly different merge strategies.

## Teacher Forcing: Feeding the Right Answer

During training, the decoder generates one word at a time. But wait — if the decoder gets word 3 wrong, and we feed that wrong word as input when generating word 4, we're building on a mistake. The errors compound, and the model spirals into nonsense.

**Teacher forcing** fixes this: during training, always feed the *correct* previous word, regardless of what the model predicted.

```
Target sentence: "Die Katze saß auf der Matte"

Without teacher forcing:
  Input: <start>
  Model predicts: "Die" ✓
  Input: "Die"
  Model predicts: "Hund" ✗ (should be "Katze")
  Input: "Hund"          ← feeding the mistake
  Model predicts: "lief" ✗ (now completely off track)

With teacher forcing:
  Input: <start>
  Model predicts: "Die" ✓
  Input: "Die"
  Model predicts: "Hund" ✗
  Input: "Katze"          ← feed correct word anyway
  Model predicts: "saß" ✓ (back on track)
```

Teacher forcing means the model always trains from a correct context, even when its predictions are wrong. This dramatically accelerates convergence.

The trade-off is **exposure bias** — during inference, the model doesn't have a teacher. It feeds its own predictions, and it's never practiced recovering from mistakes. In practice, this matters less than you'd expect because the model gets good enough that its predictions are usually close to correct.

And here's the key benefit for transformers specifically: with teacher forcing and masking, you can compute the loss for **all positions simultaneously**. You don't actually generate word by word during training — you feed the entire target sentence (shifted right by one position), apply the causal mask, and compute all predictions in one forward pass.

![Diagram of the transformer training loop showing teacher forcing, parallel loss computation, and gradient updates](/images/articles/transformers-part-4/training-loop.svg)

```python
def train_step(model, src, tgt, optimizer, criterion):
    # tgt_input: target shifted right (everything except last token)
    # tgt_output: target shifted left (everything except first token)
    tgt_input = tgt[:, :-1]   # "Die Katze saß auf der"
    tgt_output = tgt[:, 1:]   # "Katze saß auf der Matte"

    # Forward pass — all positions computed in parallel
    logits = model(src, tgt_input)  # (batch, seq_len, vocab_size)

    # Loss across all positions
    loss = criterion(
        logits.reshape(-1, logits.size(-1)),
        tgt_output.reshape(-1)
    )

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    return loss.item()
```

## The Loss Function: Cross-Entropy Over Vocabulary

At each position, the model outputs a probability distribution over the entire vocabulary (37,000 tokens for the paper's BPE). The loss function is **cross-entropy** — it measures how surprised the model is by the correct answer.

If the model assigns 90% probability to the correct next word, the loss is low (-log(0.9) ≈ 0.105). If it assigns 1% probability, the loss is high (-log(0.01) ≈ 4.6).

The total loss is the average cross-entropy across all positions in all sentences in the batch:

```python
criterion = nn.CrossEntropyLoss(
    ignore_index=PAD_TOKEN,  # don't penalize padding positions
    label_smoothing=0.1      # the paper uses label smoothing
)
```

**Label smoothing** is a subtle but important detail from the paper. Instead of training the model to assign 100% probability to the correct word and 0% to everything else, label smoothing targets 90% for the correct word and distributes 10% across all other words.

Why? It prevents the model from becoming overconfident. An overconfident model produces very peaked probability distributions, which hurts two things: generalization (the model becomes brittle) and beam search (the search can't explore alternatives). Label smoothing costs about 0.5 BLEU in perplexity but gains about 1 BLEU in actual translation quality. The paper's authors traded a metric nobody cares about for one everybody cares about.

## The Learning Rate Schedule: Warmup Is Not Optional

This is one of the paper's most specific and important implementation details. The learning rate follows this formula:

```
lr = d_model^(-0.5) × min(step^(-0.5), step × warmup_steps^(-1.5))
```

In practice:

```python
class TransformerScheduler:
    def __init__(self, optimizer, d_model: int = 512, warmup_steps: int = 4000):
        self.optimizer = optimizer
        self.d_model = d_model
        self.warmup_steps = warmup_steps
        self.step_num = 0

    def step(self):
        self.step_num += 1
        lr = self.d_model ** (-0.5) * min(
            self.step_num ** (-0.5),
            self.step_num * self.warmup_steps ** (-1.5)
        )
        for param_group in self.optimizer.param_groups:
            param_group['lr'] = lr
        return lr
```

The schedule has two phases:

1. **Warmup** (steps 1–4000): learning rate increases linearly from near-zero to its peak
2. **Decay** (steps 4000+): learning rate decreases proportionally to 1/√step

Why warmup? At initialization, the model's weights are random. Attention scores are basically noise. If you hit random weights with a large learning rate, the gradients are huge and unstable — the model diverges. Warmup lets the model find a reasonable region of the loss landscape before you start making large updates.

I've seen this firsthand — skip warmup on a transformer, and training loss either explodes to infinity or oscillates wildly for thousands of steps before settling. With warmup, loss decreases smoothly from step 1.

## The Training Data

The paper trained on two translation tasks:

- **WMT 2014 English-German**: 4.5 million sentence pairs
- **WMT 2014 English-French**: 36 million sentence pairs

Sentences were encoded using BPE with a shared source-target vocabulary of ~37,000 tokens. Batches were formed by approximate sequence length — sentences of similar length grouped together to minimize padding waste.

Training hardware: 8 NVIDIA P100 GPUs. The base model (65M parameters) trained for 100,000 steps over 12 hours. The big model (213M parameters) trained for 300,000 steps over 3.5 days.

## The Results That Shocked the Field

English-to-German: **28.4 BLEU** — beating the previous best (including ensembles of models) by over 2 BLEU points. In machine translation, 1 BLEU point is a significant improvement. 2+ points from a single model against ensembles was unprecedented.

English-to-French: **41.0 BLEU** — new state of the art, achieved at **1/4 the training cost** of the previous best system.

But the real shock wasn't the raw numbers. It was the efficiency. Previous state-of-the-art models took weeks to train on similar hardware. The transformer matched or beat them in days. And because the architecture is fully parallelizable, scaling to more GPUs gave near-linear speedup.

The paper's Table 3 shows something remarkable: they systematically varied the architecture (number of heads, dimensions, layers) and showed that the design choices were robust. The model wasn't fragile — it worked well across a range of hyperparameters.

## Regularization: Three Techniques

The paper used three regularization strategies to prevent overfitting:

1. **Dropout** (rate 0.1): applied to sublayer outputs, attention weights, and embeddings
2. **Label smoothing** (value 0.1): as described above
3. **Weight sharing**: the embedding matrix is shared between the encoder input, decoder input, and the final output projection (transposed). This single trick reduces parameter count by ~30% while improving performance

Weight sharing deserves emphasis. The output projection converts the decoder's 512-dimensional output to a 37,000-dimensional vocabulary distribution. Without sharing, that's a 512 × 37,000 = 19 million parameter matrix. With sharing, it's free — you reuse the embedding matrix. And it makes conceptual sense: a word's embedding and its prediction weights should live in the same space.

## Putting It Together

Here's the full training loop structure:

```python
model = Transformer(
    src_vocab=37000, tgt_vocab=37000,
    d_model=512, n_heads=8, n_layers=6, d_ff=2048
)

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0, betas=(0.9, 0.98), eps=1e-9  # lr managed by scheduler
)
scheduler = TransformerScheduler(optimizer, d_model=512, warmup_steps=4000)
criterion = nn.CrossEntropyLoss(ignore_index=PAD, label_smoothing=0.1)

for epoch in range(num_epochs):
    for src_batch, tgt_batch in dataloader:
        loss = train_step(model, src_batch, tgt_batch, optimizer, criterion)
        scheduler.step()
```

The Adam optimizer uses non-standard betas: β1 = 0.9, β2 = 0.98 (normally 0.999). The lower β2 means the model adapts faster to recent gradient magnitudes, which pairs well with the changing learning rate schedule.

Every detail matters. The paper's authors didn't stumble onto these settings — they ran extensive ablation studies. The architecture and the training recipe are inseparable. A transformer trained with the wrong schedule or wrong regularization is a different (worse) model.

In Part 5, we'll zoom out from the paper itself and trace how this 2017 translation model became the foundation for GPT, BERT, and the entire modern AI landscape.

<div style="display:flex;justify-content:space-between;gap:1rem;margin-top:2rem">
  <a href="/articles/transformers-part-3-full-architecture">← Part 3: The Full Architecture</a>
  <a href="/articles/transformers-part-5-paper-to-gpt">Part 5: From Paper to GPT →</a>
</div>
