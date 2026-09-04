import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  const { slug, lodge_name, contact_email, initial_password, custom_domain } = body;

  if (!slug || !lodge_name || !contact_email || !initial_password) {
    return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
  }
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide : minuscules, chiffres et tirets, 3–40 caractères.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }
  if (initial_password.length < 8) {
    return NextResponse.json({ error: 'Mot de passe trop court (minimum 8 caractères).' }, { status: 400 });
  }

  // Vérifie que le slug n'est pas déjà pris
  const existing = await prisma.lodge.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: `L'identifiant "${slug}" est déjà utilisé.` }, { status: 409 });
  }

  const lodgeUrl = custom_domain ? `https://${custom_domain}` : `https://${slug}.fraternapp.com`;

  // Enregistre la loge en base
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

  // Déclenche le workflow GitHub Actions
  const ghToken = process.env.GITHUB_TOKEN;
  const ghRepo = process.env.GITHUB_REPO;

  if (ghToken && ghRepo) {
    const ghRes = await fetch(`https://api.github.com/repos/${ghRepo}/actions/workflows/deploy-new-lodge.yml/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'FraternApp-Dev/1.0',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: { slug, lodge_name, initial_password, custom_domain: custom_domain || '' },
      }),
    });

    if (ghRes.status !== 204) {
      const ghBody = await ghRes.text();
      console.error(`GitHub API error ${ghRes.status}: ${ghBody}`);
    }
  } else {
    console.warn('GITHUB_TOKEN ou GITHUB_REPO non configurés — workflow non déclenché.');
  }

  // Email de confirmation
  if (process.env.RESEND_API_KEY) {
    await sendEmail(contact_email, lodge_name, slug, lodgeUrl).catch(e =>
      console.error('Email non envoyé :', e.message)
    );
  }

  return NextResponse.json({ ok: true, slug, url: lodgeUrl, message: `Déploiement lancé pour ${lodge_name}.` });
}

async function sendEmail(to: string, lodgeName: string, slug: string, lodgeUrl: string) {
  const html = `
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#222;">
  <h1 style="font-size:24px;color:#b8860b;">Votre loge est prête !</h1>
  <p>Félicitations ! Votre espace <strong>${lodgeName}</strong> vient d'être déployé.</p>
  <div style="background:#f5f3ef;border-radius:8px;padding:24px;margin:24px 0;text-align:center;">
    <a href="${lodgeUrl}" style="font-size:20px;font-weight:bold;color:#b8860b;">${lodgeUrl}</a>
  </div>
  <p>Identifiant admin : <strong>${slug}@fraternapp.com</strong></p>
  <p>Actif dans <strong>~2 minutes</strong>.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
  <p style="font-size:12px;color:#999;">30 jours d'essai gratuit · FraternApp</p>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'FraternApp <bonjour@fraternapp.com>',
      to: [to],
      subject: `Votre loge "${lodgeName}" est déployée`,
      html,
    }),
  });

  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
