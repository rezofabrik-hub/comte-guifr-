import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Validation hostname strict
const HOSTNAME_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Rate limiting en mémoire (remplacer par Redis en prod multi-instance)
const ipHits = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.reset < now) {
    ipHits.set(ip, { count: 1, reset: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans 15 minutes.' }, { status: 429 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  const { slug, lodge_name, contact_email, custom_domain } = body;

  // Validation
  if (!slug || !lodge_name || !contact_email) {
    return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
  }
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide : minuscules, chiffres et tirets, 3–40 caractères.' }, { status: 400 });
  }
  if (lodge_name.length < 3 || lodge_name.length > 120) {
    return NextResponse.json({ error: 'Nom de loge invalide (3–120 caractères).' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }
  if (custom_domain && !HOSTNAME_RE.test(custom_domain)) {
    return NextResponse.json({ error: 'Domaine personnalisé invalide (ex: loge.votre-domaine.fr).' }, { status: 400 });
  }

  try {
    const existing = await prisma.lodge.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: `L'identifiant "${slug}" est déjà utilisé.` }, { status: 409 });
    }
  } catch {
    return NextResponse.json({ error: 'Erreur base de données.' }, { status: 503 });
  }

  const lodgeUrl = custom_domain ? `https://${custom_domain}` : `https://${slug}.fraternapp.com`;

  try {
    await prisma.lodge.create({
      data: {
        slug,
        name: lodge_name,
        contactEmail: contact_email,
        adminEmail: `${slug}@fraternapp.com`,
        customDomain: custom_domain || null,
        pagesUrl: lodgeUrl,
        status: 'PROVISIONING',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la création de la loge.' }, { status: 503 });
  }

  // Déclenche GitHub Actions — le mot de passe n'est PAS transmis ici
  // Le workflow génère un mot de passe aléatoire et envoie un lien de reset Firebase
  const ghToken = process.env.GITHUB_TOKEN;
  const ghRepo = process.env.GITHUB_REPO;

  if (ghToken && ghRepo) {
    const ghRes = await fetch(
      `https://api.github.com/repos/${ghRepo}/actions/workflows/deploy-new-lodge.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ghToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'FraternApp/1.0',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: { slug, lodge_name, contact_email, custom_domain: custom_domain || '' },
        }),
      }
    );

    if (ghRes.status !== 204) {
      console.error(`GitHub API error ${ghRes.status}: ${await ghRes.text()}`);
    }
  } else {
    console.warn('GITHUB_TOKEN ou GITHUB_REPO non configurés.');
  }

  if (process.env.RESEND_API_KEY) {
    await sendEmail(contact_email, lodge_name, slug, lodgeUrl).catch(e =>
      console.error('Email non envoyé :', e.message)
    );
  }

  return NextResponse.json({ ok: true, slug, url: lodgeUrl });
}

async function sendEmail(to: string, lodgeName: string, slug: string, lodgeUrl: string) {
  const safeName = escHtml(lodgeName);
  const safeUrl  = escHtml(lodgeUrl);
  const safeSlug = escHtml(slug);

  const html = `
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#222;">
  <h1 style="font-size:24px;color:#b8860b;">Votre loge est en cours de déploiement !</h1>
  <p>Félicitations ! Votre espace <strong>${safeName}</strong> sera actif dans ~2 minutes.</p>
  <div style="background:#f5f3ef;border-radius:8px;padding:24px;margin:24px 0;text-align:center;">
    <a href="${safeUrl}" style="font-size:20px;font-weight:bold;color:#b8860b;">${safeUrl}</a>
  </div>
  <p>Identifiant admin : <strong>${safeSlug}@fraternapp.com</strong></p>
  <p>Un email avec votre lien de connexion vous sera envoyé une fois le déploiement terminé.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
  <p style="font-size:12px;color:#999;">30 jours d'essai gratuit · FraternApp</p>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'FraternApp <bonjour@fraternapp.com>',
      to: [to],
      subject: `Votre loge "${lodgeName}" est en cours de déploiement`,
      html,
    }),
  });

  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
