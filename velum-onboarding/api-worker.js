/**
 * Velum Onboarding — API Worker
 * POST /api/provision  → déclenche le workflow GitHub "deploy-new-lodge.yml"
 *
 * Secrets Cloudflare requis :
 *   GITHUB_TOKEN   — PAT avec permission Actions:write
 *   GITHUB_REPO    — ex: rezofabrik-hub/comte-guifr-
 *   RESEND_API_KEY — clé API Resend
 *
 * KV binding requis : LODGES (pour le rate limiting par IP)
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Validation hostname strict : lettres, chiffres, tirets, points — pas de protocole, pas de chemin
const HOSTNAME_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

// Échappe les caractères HTML pour prévenir l'injection dans les emails
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/provision') {
      return handleProvision(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};

// ── Rate limiting : 5 requêtes / 15 minutes par IP ────────────────────────
async function checkRateLimit(env, ip) {
  if (!env.LODGES) return true; // KV non configuré → pas de limite (ne bloque pas)
  const key = `rl:${ip}`;
  const raw = await env.LODGES.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= 5) return false;
  await env.LODGES.put(key, String(count + 1), { expirationTtl: 900 }); // 15 min
  return true;
}

async function handleProvision(request, env) {
  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const allowed = await checkRateLimit(env, ip);
  if (!allowed) {
    return jsonError('Trop de requêtes. Réessayez dans 15 minutes.', 429);
  }

  // ── Parse body ───────────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Corps JSON invalide.', 400);
  }

  const { slug, lodge_name, contact_email, custom_domain } = body;

  // ── Validation ───────────────────────────────────────────────────────────
  if (!slug || !lodge_name || !contact_email) {
    return jsonError('Champs obligatoires manquants : slug, lodge_name, contact_email.', 400);
  }
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return jsonError('Slug invalide : minuscules, chiffres et tirets uniquement, 3–40 caractères.', 400);
  }
  if (lodge_name.length < 3 || lodge_name.length > 120) {
    return jsonError('Nom de loge invalide (3–120 caractères).', 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
    return jsonError('Adresse email invalide.', 400);
  }
  if (custom_domain && !HOSTNAME_RE.test(custom_domain)) {
    return jsonError('Domaine personnalisé invalide (ex: loge.votre-domaine.fr).', 400);
  }

  // ── Vérification secrets ─────────────────────────────────────────────────
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
    console.error('Secrets manquants : GITHUB_TOKEN ou GITHUB_REPO.');
    return jsonError('Configuration serveur incomplète.', 500);
  }

  // ── Déclenche le workflow GitHub Actions ─────────────────────────────────
  // Le mot de passe initial N'EST PAS transmis ici.
  // Le workflow génère un mot de passe aléatoire et envoie un lien de reset Firebase.
  const ghResponse = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/deploy-new-lodge.yml/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Velum-Onboarding-Worker/1.0',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          slug,
          lodge_name,
          contact_email,
          custom_domain: custom_domain || '',
        },
      }),
    }
  );

  if (ghResponse.status !== 204) {
    const ghBody = await ghResponse.text();
    console.error(`GitHub API error ${ghResponse.status}: ${ghBody}`);
    const msg =
      ghResponse.status === 401 ? 'Token GitHub invalide ou expiré.' :
      ghResponse.status === 404 ? 'Workflow introuvable.' :
      `Erreur GitHub (${ghResponse.status}).`;
    return jsonError(msg, 502);
  }

  // ── Succès ───────────────────────────────────────────────────────────────
  const lodgeUrl = custom_domain
    ? `https://${custom_domain}`
    : `https://${slug}.fraternapp.com`;

  await sendConfirmationEmail(contact_email, lodge_name, slug, lodgeUrl, env).catch(e =>
    console.error('Email non envoyé :', e.message)
  );

  return new Response(
    JSON.stringify({
      ok: true,
      slug,
      url: lodgeUrl,
      message: `Déploiement lancé pour ${lodge_name}. Vous recevrez un email avec votre lien d'accès.`,
    }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
  );
}

async function sendConfirmationEmail(to, lodgeName, slug, lodgeUrl, env) {
  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY manquant — email non envoyé.');
    return;
  }

  // Toutes les valeurs dynamiques sont échappées avant injection dans le HTML
  const safeName = escHtml(lodgeName);
  const safeUrl  = escHtml(lodgeUrl);
  const safeSlug = escHtml(slug);

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#222;">
  <h1 style="font-size:24px;margin-bottom:8px;">Votre loge est en cours de déploiement !</h1>
  <p style="color:#555;">Félicitations ! Votre espace privé <strong>${safeName}</strong> sera prêt dans ~2 minutes.</p>

  <div style="background:#f5f3ef;border-radius:8px;padding:24px;margin:24px 0;text-align:center;">
    <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;">Votre lien d'accès</p>
    <a href="${safeUrl}" style="font-size:20px;font-weight:bold;color:#b8860b;text-decoration:none;">${safeUrl}</a>
  </div>

  <p style="color:#555;">Un <strong>email séparé</strong> avec votre lien de connexion vous sera envoyé dès que le déploiement est terminé.</p>
  <p style="color:#555;">Identifiant administrateur : <strong>${safeSlug}@fraternapp.com</strong></p>

  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
  <p style="font-size:12px;color:#999;">30 jours d'essai gratuit, sans carte bancaire. · FraternApp</p>
</body>
</html>`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'FraternApp <bonjour@fraternapp.com>',
      to: [to],
      subject: `Votre loge "${lodgeName}" est en cours de déploiement`,
      html,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Resend error ${resp.status}: ${err}`);
  }
}

function jsonError(message, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
