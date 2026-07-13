// Vercel Edge Function — POST /api/generate
// Runs on Vercel Edge Runtime (no timeout for streaming responses).
// Proxies Anthropic's SSE stream directly to the browser — tokens arrive
// progressively and the connection never idles long enough to time out.
//
// Env vars (set in Vercel dashboard, NOT in the repo):
//   ANTHROPIC_API_KEY  (required)
//   ANTHROPIC_MODEL    (optional, defaults below)
//   ACCESS_PASSWORD    (optional password gate)

export const config = { runtime: 'edge' };

export default async function handler(req) {
    if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                  status: 405,
                  headers: { 'Content-Type': 'application/json' },
          });
    }

  const KEY = process.env.ANTHROPIC_API_KEY;
    if (!KEY) {
          return new Response(JSON.stringify({ error: 'Server missing ANTHROPIC_API_KEY env var' }), {
                  status: 500,
                  headers: { 'Content-Type': 'application/json' },
          });
    }

  let body;
    try { body = await req.json(); } catch (_) { body = {}; }

  const GATE = process.env.ACCESS_PASSWORD;
    if (GATE && body.password !== GATE) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                  status: 401,
                  headers: { 'Content-Type': 'application/json' },
          });
    }

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(JSON.stringify({ error: 'messages array required' }), {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
          });
    }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
                'x-api-key': KEY,
                'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ model, max_tokens: 4000, stream: true, messages }),
  });

  if (!upstream.ok) {
        const errBody = await upstream.text();
        return new Response(errBody, {
                status: upstream.status,
                headers: { 'Content-Type': 'application/json' },
        });
  }

  // Pipe Anthropic's SSE stream straight to the browser.
  // Edge Runtime keeps this connection open as long as data is flowing —
  // no wall-clock timeout applies to streaming Edge responses.
  return new Response(upstream.body, {
        headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'X-Accel-Buffering': 'no',
        },
  });
}
