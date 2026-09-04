import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Corps JSON invalide.' }, { status: 400 });

  const { slug, lodge_name, contact_email, initial_password, custom_domain } = body;

  if (!slug || !lodge_name || !contact_email || !initial_password)
    return json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
  if (!/^[a-z0-9-]{3,40}$/.test(slug))
    return json({ error: 'Slug invalide.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))
    return json({ error: 'Email invalide.' }, { status: 400 });
  if (initial_password.length < 8)
    return json({ error: 'Mot de passe trop court.' }, { status: 400 });

  const existing = await prisma.lodge.findUnique({ where: { slug } });
  if (existing) return json({ error: `Slug "${slug}" déjà utilisé.` }, { status: 409 });

  const lodgeUrl = custom_domain ? `https://${custom_domain}` : `https://${slug}.fraternapp.com`;

  await prisma.lodge.create({
    data: { slug, name: lodge_name, contactEmail: contact_email, adminEmail: `${slug}@fraternapp.com`, customDomain: custom_domain || null, pagesUrl: lodgeUrl, status: 'PROVISIONING' },
  });

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/deploy-new-lodge.yml/dispatches`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json', 'User-Agent': 'FraternApp/1.0' },
      body: JSON.stringify({ ref: 'main', inputs: { slug, lodge_name, initial_password, custom_domain: custom_domain || '' } }),
    }).catch(e => console.error('GitHub error:', e.message));
  }

  return json({ ok: true, slug, url: lodgeUrl });
};
