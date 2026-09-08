import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

// Singleton Prisma pour SvelteKit (hot reload)
import { building } from '$app/environment';

let _prisma: PrismaClient | undefined;
function getPrisma() {
  if (!_prisma) _prisma = new PrismaClient();
  return _prisma;
}

const HOSTNAME_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function escHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Rate limiting en mémoire : 5 req / 15 min par IP
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

export const POST: RequestHandler = async ({ request }) => {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return json({ error: 'Trop de requêtes. Réessayez dans 15 minutes.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Corps JSON invalide.' }, { status: 400 });

  const { slug, lodge_name, contact_email, custom_domain } = body;

  if (!slug || !lodge_name || !contact_email)
    return json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
  if (!/^[a-z0-9-]{3,40}$/.test(slug))
    return json({ error: 'Slug invalide.' }, { status: 400 });
  if (lodge_name.length < 3 || lodge_name.length > 120)
    return json({ error: 'Nom de loge invalide (3–120 caractères).' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))
    return json({ error: 'Email invalide.' }, { status: 400 });
  if (custom_domain && !HOSTNAME_RE.test(custom_domain))
    return json({ error: 'Domaine personnalisé invalide.' }, { status: 400 });

  const prisma = getPrisma();

  let existing;
  try {
    existing = await prisma.lodge.findUnique({ where: { slug } });
  } catch {
    return json({ error: 'Erreur base de données.' }, { status: 503 });
  }
  if (existing) return json({ error: `Slug "${slug}" déjà utilisé.` }, { status: 409 });

  const lodgeUrl = custom_domain ? `https://${custom_domain}` : `https://${slug}.fraternapp.com`;

  try {
    await prisma.lodge.create({
      data: { slug, name: lodge_name, contactEmail: contact_email, adminEmail: `${slug}@fraternapp.com`, customDomain: custom_domain || null, pagesUrl: lodgeUrl, status: 'PROVISIONING' },
    });
  } catch {
    return json({ error: 'Erreur lors de la création de la loge.' }, { status: 503 });
  }

  // Le mot de passe n'est PAS transmis à GitHub Actions
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/deploy-new-lodge.yml/dispatches`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json', 'User-Agent': 'FraternApp/1.0' },
      body: JSON.stringify({ ref: 'main', inputs: { slug, lodge_name, contact_email, custom_domain: custom_domain || '' } }),
    }).catch(e => console.error('GitHub error:', e.message));
  }

  return json({ ok: true, slug, url: lodgeUrl });
};
