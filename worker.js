// Cloudflare Worker — sert les assets statiques + proxy /api/claude
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy vers l'API Anthropic — la clé vient du secret Cloudflare CLAUDE_API_KEY
    if (url.pathname === '/api/claude' && request.method === 'POST') {
      const apiKey = env.CLAUDE_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: { message: 'Clé API non configurée sur le serveur' } }), {
          status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      try {
        const body = await request.json();
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const data = await resp.text();
        return new Response(data, {
          status: resp.status,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: { message: e.message } }), {
          status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' }
      });
    }

    // Tout le reste → assets statiques
    return env.ASSETS.fetch(request);
  }
};
