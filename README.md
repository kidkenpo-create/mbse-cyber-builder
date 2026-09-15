# CYB-5620V · MBSE Cyber Scenario Builder

> **War-U / DAU** · Secure Cyber Resilient Engineering (SCRE) · Powered by Claude AI

An AI-powered MBSE scenario generation tool for classroom use across Modules 2–8 of CYB-5620V. Students configure a threat scenario, select MBSE artifacts, and generate grounded STPA-Sec analyses, Mermaid diagrams, MITRE ATT&CK mappings, SysML exports, and security requirements — all ready to import into Cameo Systems Modeler.

---

## 🚀 Quick Start (Local Dev)

```bash
# 1. Clone the repo
git clone https://github.com/kidkenpo-4814/mbse-cyber-builder.git
cd mbse-cyber-builder

# 2. Install dependencies
npm install

# 3. Start dev server (runs on http://localhost:3000)
npm run dev
```

> The app calls the Anthropic API directly from the browser via the Claude.ai proxy — no backend required when running inside Claude.ai artifacts. For standalone hosting, see the API Key section below.

---

## 🏗️ Project Structure

```
mbse-cyber-builder/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx          ← React entry point
│   └── App.jsx           ← Full application (single-file component)
├── .github/
│   └── workflows/
│       └── deploy.yml    ← GitHub Actions → Vercel auto-deploy
├── .env.example          ← API key template (never commit .env.local)
├── .gitignore
├── index.html            ← Vite HTML shell
├── package.json
├── vercel.json           ← Vercel deployment config
├── vite.config.js
└── README.md
```

---

## ☁️ Vercel Deployment

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
vercel        # follow prompts — links to your Vercel project
vercel --prod # deploy to production
```

### Option B — GitHub → Vercel Auto-Deploy
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Vercel auto-detects Vite — no configuration needed
4. Add secrets in **Project → Settings → Environment Variables** (see below)
5. Every push to `main` triggers a production deploy automatically via `.github/workflows/deploy.yml`

### GitHub Actions Secrets Required
| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after first `vercel` CLI link |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after first `vercel` CLI link |

---

## 🔑 API Key Configuration

This app uses the **Anthropic Claude API** (`claude-sonnet-4-6`).

### When running inside Claude.ai (default classroom use)
No key needed — the platform proxy handles authentication automatically.

### When self-hosting (standalone Vercel deployment)
1. Copy `.env.example` → `.env.local`
2. Set your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. In `src/App.jsx`, update the fetch headers:
   ```js
   headers: {
     "Content-Type": "application/json",
     "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
     "anthropic-version": "2023-06-01",
     "anthropic-dangerous-direct-browser-access": "true",
   },
   ```
4. Add the same key in Vercel → Project → Settings → Environment Variables

> ⚠️ **Security note:** Browser-accessible API keys are visible in network traffic. For production classroom use, consider a lightweight proxy (Vercel Edge Function or Cloudflare Worker) that keeps the key server-side.

---

## 📚 Modules Covered

| Module | Topic | Day |
|---|---|---|
| M2 | ICS Threats & Adversaries | Day 1 AM |
| M3 | SCRE Policy & Acquisition | Day 1 |
| M4 | SCRE Approaches & Building Blocks | Day 1 PM |
| M5 | Pipeline ICS Case Study | Day 1 PM |
| M6 | Silverfish UGV — STPA-Sec & Assurance Cases | Day 2 AM |
| M7 | Silverfish SDAD — Sentinel & Resilience | Day 2 PM |
| M8 | Guardian UAV (GAVIN) — Full CRRM + Contracting | Day 2 PM |

---

## 🔧 Generated Artifacts

- **Scenario Narrative** — grounded in module slides, CVEs, DoDI citations
- **STPA-Sec Analysis** — Losses, Hazards, Control Structure, HCAs, Loss Scenarios
- **Use Case Diagram** — Mermaid flowchart (right-click → Copy Image → PowerPoint)
- **Attack Sequence Diagram** — Mermaid sequenceDiagram
- **Block Definition Diagram** — SysML BDD (ASCII)
- **MITRE ATT&CK Mapping** — ICS + Enterprise techniques with application notes
- **Security Requirements** — SHALL statements with NIST 800-53 + DoDI traceability
- **Courses of Action** — SCRE-specific defensive TTPs
- **Cameo / MagicDraw Export** — XMI download (import into Cameo) + CSV requirements download

---

## 🐛 Bug Fixes (v1.0.1)

- **STPA-Sec tab stuck / blank** — Fixed section header mismatch between prompt (`===STPA-SEC ANALYSIS===`) and parser regex. Parser now accepts both `STPA SEC` and `STPA-SEC` via `STPA[- ]SEC ANALYSIS` pattern.
- **Model string** — Updated from `claude-sonnet-4-5` to `claude-sonnet-4-6`.

---

## 🏫 Classroom Deployment Notes

- **Online (graded work):** Use the Vercel-hosted cloud version — higher output quality via Claude Sonnet
- **Air-gapped / lab:** Use `mbse-cyber-builder-offline-ollama.html` served via `python3 -m http.server 8080` with Ollama (`llama3.1:8b`)
- **Cameo integration:** Download XMI from the Cameo Export tab → File → Import → Import XMI in Cameo Systems Modeler 2021x+
- **Requirements import:** Download CSV → MagicDraw Tools → Data Import → map columns

---

*CYB-5620V Secure Cyber Resilient Engineering · War-U / Defense Acquisition University*
