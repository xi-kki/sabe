# 🏗️ Sabe — Vendor/Supplier Intelligence Agent

**Blueprint v1.0** | Generated: July 13, 2026

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Project Name** | Sabe |
| **One-Liner** | AI sourcing agent that helps African food-tech founders find and evaluate suppliers in seconds, not weeks |
| **Type** | AI Agent (Web2) |
| **Problem** | Founders waste time/money on manual sourcing via WhatsApp groups, cold calls, word-of-mouth — with zero risk intelligence |
| **Solution** | Pi-powered agent accepts ingredient/packaging needs, returns 3-5 vetted suppliers with pricing signals and risk flags |
| **Target Users** | Early-to-growth African food-tech founders (pre-seed → Series A) without procurement teams |
| **Timeline** | 1 hour (speed build) |
| **Architecture Style** | Agent-first monolith |

---

## 2. Product Requirements

```
MVP (Must Have — v1)
├── Web chat interface (describe sourcing need)
├── Pi-powered agent logic (parse intent, search, analyze)
├── Search pipeline (web search + trade data)
├── Supplier shortlist output (3-5 suppliers, structured)
├── Risk scoring (confidence + flags)
├── Currency exposure display
├── Follow-up conversation handling
└── Human escalation option

Phase 2 (Later)
├── WhatsApp integration
├── PDF export
├── Supplier database persistence
└── User accounts / history

Phase 3 (Future)
├── Transaction facilitation (marketplace)
├── Compliance/certification checks
└── Multi-language support
```

---

## 3. User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         FOUNDER                                  │
│                  (Web app — mobile-first)                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SABE WEB APP                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Chat Interface                                         │    │
│  │  "I need 500kg of packaging film in Lagos"              │    │
│  └─────────────────────┬───────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PI AGENT (Sabe Core)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ Intent Parse │→ │ Search+Enrich│→ │ Risk/Currency Logic │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ Web Search   │  │ Trade Data   │  │ Social/Listings     │   │
│  │ (Serper)     │  │ (APIs)       │  │ (Scrapers)          │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OUTPUT                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Supplier Cards (3-5)                                    │   │
│  │  ┌─────────┬──────────┬─────────┬────────┬────────────┐ │   │
│  │  │ Name    │ Location │ Price   │ Risk   │ Confidence │ │   │
│  │  ├─────────┼──────────┼─────────┼────────┼────────────┤ │   │
│  │  │ Supplier│ Country  │ Range   │ Flags  │ High/Med/Low│ │   │
│  │  └─────────┴──────────┴─────────┴────────┴────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼ (if needed)
                  ┌──────────────┐
                  │ Human Escal. │
                  └──────────────┘
```

---

## 4. Tech Stack

| Layer | Choice | Justification |
|-------|--------|---------------|
| **Frontend** | React + Vite + Tailwind | Fast to ship, mobile-first |
| **Agent Core** | Pi Coding AI Agent | Primary platform for dev + runtime |
| **Search** | Serper API | Google results, agent-friendly |
| **Database** | JSON/SQLite (MVP) | Supplier cache, no setup friction |
| **Auth** | None (v1) | Anonymous usage, reduce friction |
| **Deploy** | Vercel | Fast, free tier, instant |
| **Language** | TypeScript | Type-safe, AI-friendly |

---

## 5. Project Structure

```
sabe/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── SupplierCard.tsx
│   │   ├── SupplierList.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── CurrencyBadge.tsx
│   │   └── HumanEscalation.tsx
│   ├── lib/
│   │   ├── agent.ts          # Pi agent orchestration
│   │   ├── search.ts         # Serper API integration
│   │   ├── risk.ts           # Risk scoring logic
│   │   ├── currency.ts       # Currency exposure logic
│   │   └── types.ts          # Type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env.example
├── .gitignore
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 6. Output Format (Per Supplier)

| Field | Description |
|-------|-------------|
| **Supplier name** | Name & entity |
| **Location** | Country/region + contact |
| **Category fit** | Matched item |
| **Price signal** | Range / tier |
| **Import dependency** | Local vs imported |
| **Currency exposure** | USD / local / mixed |
| **Risk note** | 1-2 line flags |
| **Confidence** | High / Medium / Low |

---

## 7. Skills Map

| Phase | Skills |
|-------|--------|
| **Foundation** | `senior-engineer` |
| **Core Build** | `senior-engineer` → `claude-api` (for Pi agent patterns) |
| **Quality** | `security_scan`, `eslint` |
| **Ship** | `fast-deploy` |

---

## 8. Implementation Roadmap (1-Hour Speed Build)

```
PHASE 1: Foundation (10 min)
  [ ] Project scaffold created
  [ ] Dependencies installed
  [ ] CLAUDE.md written
  [ ] .env.example + .gitignore
  [ ] Tailwind configured

PHASE 2: Core Build (35 min)
  [ ] Chat interface (input + messages)
  [ ] Agent logic (intent parsing)
  [ ] Search integration (Serper)
  [ ] Risk scoring logic
  [ ] Currency logic
  [ ] Supplier card component
  [ ] Supplier list display
  [ ] Follow-up handling

PHASE 3: Quality + Ship (15 min)
  [ ] Security scan
  [ ] TypeScript strict
  [ ] Error states
  [ ] Deploy to Vercel
  [ ] README complete

⏱️ TOTAL: 60 minutes
```

---

## 9. Non-Goals (v1)

| Non-Goal | Reason |
|----------|--------|
| Not a marketplace | No transactions |
| Not compliance checker | Out of scope |
| Not audited guarantees | Directional intelligence only |
| No WhatsApp | v2 feature |
| No user accounts | Reduce friction |

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Weekly active queries | Track usage |
| Follow-up engagement rate | Depth of conversation |
| Human consult conversion | AI-to-human handoff rate |
| Founder time-saved feedback | Core value prop validation |

---

## ⚠️ Speed Build Caveat

**If dependencies fail to install or any task takes too long:**
1. Skip the failing dependency — use alternatives or mock
2. Move to next task immediately
3. Come back to fix later if time permits
4. Never block on one thing — parallelize or substitute
5. Ship ugly > ship never

**Priority:** Working demo > perfect code > comprehensive tests

---

*Blueprint generated. Ready to build.* 🚀
