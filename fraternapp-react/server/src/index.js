import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/provision', async (req, res) => {
  const { slug, lodge_name, contact_email, initial_password, custom_domain } = req.body;

  if (!slug || !lodge_name || !contact_email || !initial_password)
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  if (!/^[a-z0-9-]{3,40}$/.test(slug))
    return res.status(400).json({ error: 'Slug invalide.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))
    return res.status(400).json({ error: 'Email invalide.' });
  if (initial_password.length < 8)
    return res.status(400).json({ error: 'Mot de passe trop court.' });

  const existing = await prisma.lodge.findUnique({ where: { slug } });
  if (existing) return res.status(409).json({ error: `Slug "${slug}" déjà utilisé.` });

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

  res.json({ ok: true, slug, url: lodgeUrl });
});

app.get('/api/lodges', async (_req, res) => {
  const lodges = await prisma.lodge.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(lodges);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API ready on :${PORT}`));
