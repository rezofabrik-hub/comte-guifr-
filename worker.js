/**
 * PosterMaison — Cloudflare Worker
 *
 * Routes :
 *   POST /api/checkout  →  crée une session Stripe Checkout
 *   *                   →  sert les fichiers statiques (ASSETS)
 *
 * Variables d'environnement à configurer dans Cloudflare Dashboard :
 *   STRIPE_SECRET_KEY   → sk_live_... (clé secrète Stripe)
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return cors(null, 204);

    if (url.pathname === '/api/checkout' && request.method === 'POST') {
      return handleCheckout(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

/* ------------------------------------------------------------------ */

async function handleCheckout(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return cors({ error: 'Corps JSON invalide' }, 400); }

  const { items, returnUrl } = body;
  if (!items?.length) return cors({ error: 'Panier vide' }, 400);

  const origin = returnUrl || new URL(request.url).origin + '/boutique/';
  const params = new URLSearchParams({
    mode                                            : 'payment',
    success_url                                     : `${origin}?success=true`,
    cancel_url                                      : origin,
    'payment_method_types[0]'                       : 'card',
    'shipping_address_collection[allowed_countries][0]' : 'FR',
    'shipping_address_collection[allowed_countries][1]' : 'BE',
    'shipping_address_collection[allowed_countries][2]' : 'CH',
    'shipping_address_collection[allowed_countries][3]' : 'LU',
  });

  items.forEach((item, i) => {
    params.set(`line_items[${i}][price_data][currency]`,                  'eur');
    params.set(`line_items[${i}][price_data][unit_amount]`,               String(Math.round(item.price * 100)));
    params.set(`line_items[${i}][price_data][product_data][name]`,        String(item.name).slice(0, 250));
    params.set(`line_items[${i}][quantity]`,                              String(item.qty));
  });

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method  : 'POST',
    headers : {
      'Authorization'  : `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type'   : 'application/x-www-form-urlencoded',
      'Stripe-Version' : '2024-06-20',
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();

  if (!stripeRes.ok) {
    console.error('Stripe error:', JSON.stringify(session));
    return cors({ error: session.error?.message || 'Erreur Stripe' }, 400);
  }

  return cors({ url: session.url });
}

function cors(body, status = 200) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: {
      'Content-Type'                 : 'application/json',
      'Access-Control-Allow-Origin'  : '*',
      'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers' : 'Content-Type',
    },
  });
}
