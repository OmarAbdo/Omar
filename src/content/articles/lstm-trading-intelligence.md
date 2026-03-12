---
title: "Deep Learning for Market Prediction: A Hybrid LSTM/GRU/CNN Architecture"
date: "2025-11-08"
description: "How I built Luqman — a trading intelligence system that combines LSTM, GRU, and CNN layers with temporal attention to predict short-horizon equity price movements."
category: "computerScience"
tags: ["Deep Learning", "LSTM", "Finance", "Python", "PyTorch", "Time Series"]
readTime: "11 min read"
---

## Why Neural Networks for Trading?

Traditional quant strategies — momentum, mean reversion, factor models — are transparent and explainable. But markets are adversarial systems. The moment an edge becomes well-known, it arbitrages away.

Deep learning doesn't guarantee alpha, but it offers something rule-based systems can't: the ability to learn latent representations from raw price/volume/sentiment data without hand-crafting features.

Luqman is my exploration of this space.

## The Architecture

The model is a hybrid stack that processes time series data through three sequential stages:

### Stage 1 — CNN Feature Extraction

A 1D convolutional layer extracts local patterns from the raw OHLCV input sequence. Think of it as detecting candlestick-like patterns automatically:

```python
class CNNBlock(nn.Module):
    def __init__(self, in_channels: int, out_channels: int, kernel_size: int = 3):
        super().__init__()
        self.conv = nn.Conv1d(in_channels, out_channels, kernel_size, padding=kernel_size // 2)
        self.bn = nn.BatchNorm1d(out_channels)
        self.relu = nn.ReLU()

    def forward(self, x):  # x: (batch, channels, seq_len)
        return self.relu(self.bn(self.conv(x)))
```

### Stage 2 — Bidirectional LSTM + GRU

The CNN output feeds into a bidirectional LSTM layer for long-range dependency capture, followed by a GRU layer that's lighter computationally and handles shorter-term patterns:

```python
self.lstm = nn.LSTM(
    input_size=cnn_out_channels,
    hidden_size=hidden_size,
    num_layers=2,
    batch_first=True,
    bidirectional=True,
    dropout=0.2
)
self.gru = nn.GRU(
    input_size=hidden_size * 2,  # bidirectional doubles the size
    hidden_size=hidden_size,
    batch_first=True,
)
```

### Stage 3 — Temporal Attention

The attention mechanism allows the model to weight different timesteps differently when making predictions. Critical near-term events (earnings, macro announcements) get upweighted automatically:

```python
class TemporalAttention(nn.Module):
    def __init__(self, hidden_size: int):
        super().__init__()
        self.attention = nn.Linear(hidden_size, 1)

    def forward(self, lstm_output):  # (batch, seq_len, hidden)
        scores = self.attention(lstm_output).squeeze(-1)  # (batch, seq_len)
        weights = torch.softmax(scores, dim=1)
        context = (lstm_output * weights.unsqueeze(-1)).sum(dim=1)
        return context, weights
```

## Training Setup

- **Dataset**: 10 years of daily OHLCV for S&P 500 constituents + macro features (VIX, yield spread, DXY)
- **Sequence length**: 60 trading days
- **Target**: Next-day direction (binary classification) + magnitude (regression)
- **Loss**: Combined cross-entropy + Huber loss
- **Optimizer**: AdamW with cosine annealing

## Results and Honest Caveats

On held-out test data (2023–2024), the model achieves ~57% directional accuracy. That sounds modest, but in trading, 53%+ directional accuracy with good Sharpe is actionable.

**The honest caveats:**
- Backtest results look better than live results (always)
- Transaction costs eat alpha at higher frequencies
- The model has no awareness of news or earnings events
- Past performance is not indicative of future results

This is research, not financial advice.

## Open Source

The full architecture, training scripts, and evaluation notebooks are available on [GitHub](https://github.com/OmarAbdo/luqman). Contributions and critiques welcome.
