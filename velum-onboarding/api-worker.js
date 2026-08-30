/**
 * Velum Onboarding — API Worker
 * POST /api/provision  → déclenche le workflow GitHub "deploy-new-lodge.yml"
 *
 * Secrets Cloudflare requis (jamais dans le code) :
 *   GITHUB_TOKEN   — Personal Access Token avec permission Actions:write sur le repo
 *   GITHUB_REPO    — ex: rezofabrik-hub/comte-guifr-
 *
 * Ces secrets sont configurés via :
 *   wrangler secret put GITHUB_TOKEN
 *   wrangler secret put GITHUB_REPO
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    // Route unique : POST /api/provision
    if (request.method === 'POST' && url.pathname === '/api/provision') {
      return handleProvision(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handleProvision(request, env) {
  // ── Parse body ──────────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Corps JSON invalide.', 400);
  }

  const { slug, lodge_name, contact_email, initial_password, custom_domain } = body;

  // ── Validation ──────────────────────────────────────────────────────────
  if (!slug || !lodge_name || !contact_email || !initial_password) {
    return jsonError('Champs obligatoires manquants : slug, lodge_name, contact_email, initial_password.', 400);
  }
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return jsonError('Slug invalide : minuscules, chiffres et tirets uniquement, 3–40 caractères.', 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
    return jsonError('Adresse email invalide.', 400);
  }
  if (initial_password.length < 8) {
    return jsonError('Mot de passe trop court (minimum 8 caractères).', 400);
  }

  // ── Vérification secrets ────────────────────────────────────────────────
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
    console.error('Secrets manquants : GITHUB_TOKEN ou GITHUB_REPO non configurés.');
    return jsonError('Configuration serveur incomplète. Contactez l\'administrateur.', 500);
  }

  // ── Déclenche le workflow GitHub Actions ────────────────────────────────
  const workflowFile = 'deploy-new-lodge.yml';
  const apiUrl = `https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/${workflowFile}/dispatches`;

  const ghResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Velum-Onboarding-Worker/1.0',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        slug,
        lodge_name,
        initial_password,
        custom_domain: custom_domain || '',
      }
    })
  });

  // GitHub renvoie 204 No Content en cas de succès
  if (ghResponse.status !== 204) {
    const ghBody = await ghResponse.text();
    console.error(`GitHub API error ${ghResponse.status}: ${ghBody}`);
    const msg = ghResponse.status === 401
      ? 'Token GitHub invalide ou expiré.'
      : ghResponse.status === 404
        ? 'Workflow introuvable. Vérifiez le nom du fichier workflow.'
        : `Erreur GitHub (${ghResponse.status}). Réessayez dans un instant.`;
    return jsonError(msg, 502);
  }

  // ── Succès ──────────────────────────────────────────────────────────────
  const url = custom_domain
    ? `https://${custom_domain}`
    : `https://${slug}.velum.fr`;

  return new Response(JSON.stringify({
    ok: true,
    slug,
    url,
    message: `Déploiement lancé pour ${lodge_name}. Accessible sur ${url} dans ~2 minutes.`
  }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' }
  });
}

function jsonError(message, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' }
  });
}
