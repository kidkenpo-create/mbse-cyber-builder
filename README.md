# MBSE Cyber Scenario Builder — CYB-5620V (SCRE)

A Model-Based Systems Engineering scenario generator for the Secure Cyber Resilient
Engineering course. Generates STPA-Sec analyses, MITRE ATT&CK mappings, SysML diagrams,
security requirements, and Cameo/MagicDraw XMI + CSV exports across Modules 2–8.

This version is packaged as a **Vite + React** web app with a **serverless proxy** so it
can be deployed to Vercel. The proxy holds your Anthropic API key server-side — the key
never reaches the browser and there are no CORS problems.

---

## Architecture

```
Browser (React app)  →  POST /api/generate  →  Anthropic API
                         (holds your key,       (returns scenario)
                          picks the model)
```

- `src/App.jsx` — the builder UI (calls `/api/generate`, never Anthropic directly)
- `api/generate.js` — Vercel serverless function; holds the key, forwards the request
- Env vars live in **Vercel's dashboard**, never in the repo

---

## Step 1 — Put this on GitHub

You need [git](https://git-scm.com/) and a GitHub account.

1. On GitHub, click **New repository**. Name it `mbse-cyber-builder`. Public is fine —
   **the API key is NOT in this repo**, so publishing the code is safe. Do NOT check
   "Add a README" (this folder already has one). Click **Create repository**.
2. In this folder, run:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: MBSE Cyber Scenario Builder"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/mbse-cyber-builder.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME`. If prompted to authenticate, use a
   [personal access token](https://github.com/settings/tokens) as the password.

---

## Step 2 — Get an Anthropic API key

1. Go to <https://console.anthropic.com>, sign in, open **API Keys**, create one.
2. Copy it (starts with `sk-ant-`). Usage is billed to your account.

---

## Step 3 — Deploy on Vercel

1. Go to <https://vercel.com>, sign in with GitHub.
2. Click **Add New… → Project**, then **Import** your `mbse-cyber-builder` repo.
3. Vercel auto-detects Vite — leave the build settings as-is.
4. Before deploying, open **Environment Variables** and add:

   | Name                | Value                              | Required |
   |---------------------|------------------------------------|----------|
   | `ANTHROPIC_API_KEY` | your `sk-ant-...` key              | Yes      |
   | `ANTHROPIC_MODEL`   | e.g. `claude-sonnet-4-20250514`    | Optional |
   | `ACCESS_PASSWORD`   | a shared password (see below)      | Optional |

5. Click **Deploy**. After ~1 minute you'll get a live URL.

---

## IMPORTANT — protect your billing on a public deploy

Because the site is public, anyone with the URL can trigger generations that bill to
**your** key. To stop that:

- Set the `ACCESS_PASSWORD` env var to any phrase. The app will then prompt each user
  for it once per session and refuse to generate without it.
- Alternatively, keep the Vercel deployment private / behind Vercel's own access
  controls, or only share the URL with your class.

The key is never exposed either way — this is only about who can *spend* it.

---

## Model string

The proxy defaults to `claude-sonnet-4-20250514`. If your key doesn't have access to that
exact model, set `ANTHROPIC_MODEL` to one it does. Verify with a single test generation
after deploying — if you see an error mentioning the model, that's the fix.

---

## Run it locally (optional)

```bash
npm install
npm run dev        # UI only — /api/generate won't work without the Vercel runtime
```

To test the proxy locally, install the Vercel CLI and use `vercel dev`, with a
`.env.local` file based on `.env.example`.

---

## Notes

- Diagrams render in-browser via Mermaid (loaded from CDN at runtime).
- Cameo/MagicDraw XMI export is a **scaffold** — packages, blocks, requirements, and
  deriveReqt traces import into the containment tree; you apply final stereotypes in Cameo.
- For educational use in CYB-5620V.
