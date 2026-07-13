# Sabe 🌍

**Vendor/Supplier Intelligence Agent for African Food-Tech Founders**

Sabe helps early-to-growth food-tech founders find and evaluate suppliers in seconds — no procurement team needed.

## What It Does

1. **Describe your need** — "I need 500kg of packaging film in Lagos"
2. **Get supplier shortlist** — 3-5 vetted suppliers with pricing and risk flags
3. **Follow up naturally** — "Compare the top 2" or "Find local-only options"
4. **Escalate when needed** — Talk to a human sourcing expert

## Features

- 🎯 **Smart Search** — Understands sourcing intent and finds relevant suppliers
- 📊 **Risk Scoring** — Flags reliability, FX exposure, and supply chain risks
- 💱 **Currency Intelligence** — Shows local vs USD pricing implications
- 🔄 **Conversational Follow-ups** — Refine results naturally
- 👥 **Human Escalation** — Connect with sourcing experts when needed

## Tech Stack

- **Frontend:** React + Vite + Tailwind
- **Agent:** Pi Coding AI Agent
- **Search:** Serper API (Google results)
- **Deploy:** Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Serper API key to .env

# Start development
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SERPER_API_KEY` | Yes | Serper API key for web search |

Get a free API key at [serper.dev](https://serper.dev)

## Project Structure

```
sabe/
├── src/
│   ├── components/     # UI components
│   │   ├── ChatInterface.tsx
│   │   ├── SupplierCard.tsx
│   │   ├── SupplierList.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── CurrencyBadge.tsx
│   │   └── HumanEscalation.tsx
│   ├── lib/            # Core logic
│   │   ├── agent.ts    # Agent orchestration
│   │   ├── search.ts   # Search integration
│   │   ├── risk.ts     # Risk scoring
│   │   ├── currency.ts # Currency analysis
│   │   └── types.ts    # Type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── CLAUDE.md
└── README.md
```

## Non-Goals (v1)

- ❌ Not a marketplace — no transactions
- ❌ Not compliance checking
- ❌ No audited guarantees — directional intelligence only
- ❌ No WhatsApp — web only for now

## License

MIT
