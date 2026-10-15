---
date: '10/15/2026'
headline: "Meta and Apple just buried the hatchet — 816B-parameter AI is coming to your desktop"
dek: "Meta's Muse Spark Open, its most capable U.S. open-weight model ever, runs locally on two Mac Studios. The two fiercest rivals in tech are now shipping together."
tags: ['Meta', 'Apple', 'AI', 'Open Source']
image: 'https://financialgurkha.com/news/meta-apple-muse-spark.jpg'
sources:
  - name: "WSJ — Meta and Apple, Longtime Foes, Team Up to Put Open-Weight AI on Macs (Oct 15, 2026)"
    url: "https://www.wsj.com/tech/ai/meta-and-apple-longtime-foes-team-up-to-put-open-weight-ai-on-macs-a28fde11"
  - name: "MacRumors — Meta and Apple Bring Muse Spark Open AI Model to Mac Studio (Oct 15, 2026)"
    url: "https://www.macrumors.com/2026/10/15/meta-muse-spark-open-mac-studio/"
  - name: "AppleInsider — Unlikely Apple-Meta team-up brings powerful local AI to Mac Studio (Oct 15, 2026)"
    url: "https://appleinsider.com/articles/26/10/15/unlikely-apple-meta-team-up-brings-powerful-local-ai-to-mac-studio"
---

## What happened

Meta released **Muse Spark Open** today — which it calls the most capable U.S. open-weight AI model to date — and announced it worked directly with **Apple** to make the model run locally on the desktop. Not in a data center. On a desk.

The specs are serious:

| Spec | Muse Spark Open |
|---|---|
| Total parameters | **816 billion** |
| Active parameters | 42 billion (mixture-of-experts) |
| Context window | **1 million tokens** |
| Modalities | Text, image, video, audio (native) |
| Built for | Coding + long-horizon agentic work |
| License | Free download, limited commercial use |

The trick is Apple's unified memory architecture. Each M5 Ultra chip lets its GPU address up to **512GB** of unified memory at **1.2 TB/s** of bandwidth — so two Mac Studios behave, in Meta's words, "like one supercomputer with a terabyte of unified memory." Apple's MLX framework distributes the workload across the machines over Thunderbolt 5 with RDMA. You need either two 512GB Mac Studios or four 256GB ones.

## The catch: it costs as much as a car

This is frontier-scale AI on a desk — but the desk is expensive. A single 256GB Mac Studio starts at **$10,799**, the 512GB version ships later this month, and a four-machine configuration runs past **$40,000**. The weights are free on Hugging Face (under Meta's Muse Model License); the hardware very much is not. API access is also available through Baseten, Fireworks AI, Groq, Modal, Nebius, OpenRouter, and Together AI.

## Why this is a big deal

Apple and Meta have spent years as public enemies — privacy, advertising, app-store policy. Today, Mark Zuckerberg publicly thanked Apple CEO John Ternus, who posted back congratulating the team. Meta's AI chief Alexandr Wang called it "an exciting moment for both companies."

The strategic read: this is the open-weight race going local. Chinese open models (Qwen, DeepSeek, Kimi) still lead on some coding benchmarks — Meta acknowledged as much — and the American answer is now a model you can run in your office without renting cloud compute for every query. Apple gets a marquee AI showcase for its newest silicon; Meta gets a flagship consumer stage for its open models.

## Our take

Two things are true at once. First, the engineering is genuinely impressive: an 816B-parameter model running on desktop hardware would have been absurd five years ago. Second, the price tag means this is a developer and enterprise story today, not a consumer one. The signal for investors: the local-AI stack — memory-rich silicon plus open weights — is becoming a real product category, and the two companies best positioned to own it just decided to share it.

*This is a news summary, not financial advice. Nothing here is a recommendation to buy, sell, or hold anything.*
