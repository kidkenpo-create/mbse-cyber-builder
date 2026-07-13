// Vercel Serverless Function — POST /api/generate
// Holds the Anthropic API key SERVER-SIDE. The browser never sees it.
// Env vars (set these in the Vercel dashboard, NOT in the repo):
//   ANTHROPIC_API_KEY   (required)  your Anthropic key, e.g. sk-ant-...
//   ANTHROPIC_MODEL     (optional)  defaults below; set to any model your key can use
//   ACCESS_PASSWORD     (optional)  if set, callers must send a matching password

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) {
    res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY env var" });
    return;
  }

  // Optional password gate to protect your billing on a public deployment.
  const GATE = process.env.ACCESS_PASSWORD;
  const body = req.body || {};
  if (GATE && body.password !== GATE) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Request body must include a non-empty 'messages' array" });
    return;
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model, max_tokens: 4000, messages }),
    });

    const data = await upstream.json();
    // Pass Anthropic's status + payload straight through so the client can react.
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(502).json({ error: "Upstream request failed: " + (e && e.message ? e.message : String(e)) });
  }
}
