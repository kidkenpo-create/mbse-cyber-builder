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
    // Use streaming so Vercel never times out waiting for a complete response.
    // We collect the full text server-side and return it as a standard JSON
    // response once complete — the stream just keeps the connection alive.
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "messages-2023-12-15",
      },
      body: JSON.stringify({ model, max_tokens: 4000, stream: true, messages }),
    });

    if (!upstream.ok) {
      // Error from Anthropic — forward it as JSON
      let errBody;
      try { errBody = await upstream.json(); } catch (_) { errBody = { error: await upstream.text() }; }
      res.status(upstream.status).json(errBody);
      return;
    }

    // Read the SSE stream and accumulate the full text
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let inputTokens = 0;
    let outputTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") break;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
            fullText += ev.delta.text;
          }
          if (ev.type === "message_start" && ev.message?.usage) {
            inputTokens = ev.message.usage.input_tokens || 0;
          }
          if (ev.type === "message_delta" && ev.usage) {
            outputTokens = ev.usage.output_tokens || 0;
          }
        } catch (_) { /* skip malformed lines */ }
      }
    }

    // Return in the same shape as a non-streaming Anthropic response
    // so the client code doesn't need to change.
    res.status(200).json({
      model,
      content: [{ type: "text", text: fullText }],
      usage: { input_tokens: inputTokens, output_tokens: outputTokens },
    });
  } catch (e) {
    res.status(502).json({ error: "Upstream request failed: " + (e && e.message ? e.message : String(e)) });
  }
}
