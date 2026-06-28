// Social-Miroir — Cloudflare Worker proxy
// Secrets à définir via : wrangler secret put DISCORD_WEBHOOK
//                          wrangler secret put AIRTABLE_TOKEN
// Variables à définir dans wrangler.toml : AIRTABLE_BASE_ID, AIRTABLE_TABLE

const ALLOWED_ORIGINS = [
  'https://social-miroir.fr',
  'https://www.social-miroir.fr',
  'https://rezofabrik-hub.github.io',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    if (url.pathname === '/discord') {
      const body = await request.formData();
      const res = await fetch(env.DISCORD_WEBHOOK, { method: 'POST', body });
      return new Response(res.ok ? 'ok' : 'error', {
        status: res.ok ? 200 : 502,
        headers: corsHeaders(origin),
      });
    }

    if (url.pathname === '/airtable') {
      const payload = await request.json();
      const res = await fetch(
        `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
