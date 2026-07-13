# Sabe — CLAUDE.md

## 🎯 Overview
- **One-liner:** AI sourcing agent that helps African food-tech founders find and evaluate suppliers in seconds
- **Type:** AI Agent (Web2)
- **Status:** 🟢 Blueprint approved — building

## 🏗️ Tech Stack
- Language: TypeScript
- Frontend: React + Vite + Tailwind
- Agent: Pi-powered (logic in agent.ts)
- Search: Serper API
- Database: JSON/SQLite (MVP)
- Auth: None (v1)
- Hosting: Vercel

## 📁 Structure
```
sabe/
├── src/
│   ├── components/     # UI components
│   ├── lib/            # Core logic
│   ├── App.tsx
│   └── main.tsx
├── .env.example
└── CLAUDE.md
```

## 🧠 Architecture
- **Data flow:** User types need → Agent parses → Search APIs → Risk analysis → Supplier cards
- **Key modules:**
  1. `agent.ts` — Pi agent orchestration
  2. `search.ts` — Serper API integration
  3. `risk.ts` — Risk scoring logic
  4. `currency.ts` — Currency exposure logic

## ⚡ Build Order (1-Hour Speed)
- Phase 1 (0:00-0:10): Setup + scaffold + Tailwind
- Phase 2 (0:10-0:45): Core agent + UI
- Phase 3 (0:45-1:00): Quality + deploy

## 🔐 Security (NON-NEGOTIABLE)
1. NEVER commit .env
2. Validate ALL user inputs
3. No console.log in production
4. Handle loading/empty/error states
5. Rate-limit API calls

## ✅ Quality Gates Before Ship
- [ ] .env in .gitignore
- [ ] .env.example with all vars
- [ ] Input validation
- [ ] Error states handled
- [ ] README written
- [ ] Deployed

## 🚫 What NOT To Do
- Don't chase edge cases before core works
- Don't optimize prematurely
- Don't hardcode secrets
- Don't add features outside current phase
- **Don't block on anything — skip and move on if stuck**

## ⚠️ Speed Build Rules
- If dep fails → mock it or skip
- If task takes too long → move to next
- Ship ugly > ship never
- Working demo > perfect code
