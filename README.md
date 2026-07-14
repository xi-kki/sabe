# Sabe — Supplier Intelligence Agent

> AI sourcing agent that helps African food-tech founders find and evaluate suppliers in seconds, not weeks.

## What it does

- **Natural language sourcing** — describe what you need in plain English
- **Supplier shortlist** — returns 3-5 vetted suppliers with structured data
- **Risk scoring** — flags import dependency, FX exposure, and quality concerns
- **Currency intelligence** — shows local vs USD pricing with hedging suggestions
- **Human escalation** — hand off to a sourcing expert when needed
- **Mobile-first** — works great on phones, tablets, and desktop
- **Accessible** — WCAG-compliant with keyboard nav, screen reader support, and reduced motion

## Demo

```
"I need 500kg of packaging film in Lagos"
→ Returns 3 suppliers with risk scores, currency badges, and hedging tips
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (mobile-first) |
| Search | Serper API (Google results) |
| Logic | Intent parsing + risk/currency analysis |
| Deploy | Vercel / any static host |

## Getting Started

```bash
# Clone & install
git clone <repo-url> && cd sabe
npm install

# Environment
cp .env.example .env
# Add your Serper API key (free tier available at serper.dev)

# Dev server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SERPER_API_KEY` | Yes | [Serper.dev](https://serper.dev) API key for search |

> **No API key?** The app falls back to mock supplier data so you can still demo it.

## Usage

Type your sourcing need in natural language:

- "I need 500kg of packaging film in Lagos"
- "Find garri suppliers in West Africa"
- "Looking for palm oil bulk suppliers in Nigeria"
- "Find rice suppliers in Kenya"

Then ask follow-ups:
- "Compare the top suppliers"
- "Show me local-only options"
- "Talk to a human expert"

## Project Structure

```
sabe/
├── src/
│   ├── components/         # UI components
│   │   ├── ChatInterface.tsx
│   │   ├── SupplierCard.tsx
│   │   ├── SupplierList.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── CurrencyBadge.tsx
│   │   └── HumanEscalation.tsx
│   ├── lib/                # Core logic
│   │   ├── agent.ts        # Intent parsing + orchestration
│   │   ├── search.ts       # Serper API integration
│   │   ├── risk.ts         # Risk scoring
│   │   ├── currency.ts     # Currency exposure analysis
│   │   └── types.ts        # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── CLAUDE.md               # AI context doc
├── BLUEPRINT.md            # Architecture spec
└── TODO.md                 # Development phases
```

## License

MIT
