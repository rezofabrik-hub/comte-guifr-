import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// CORS strict — CLIENT_URL obligatoire en production
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '16kb' }));

// Validation hostname
const HOSTNAME_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Rate limiting en mémoire : 5 req / 15 min par IP
const ipHits = new Map();
function checkRateLimit(ip) {
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

// Middleware auth admin — protège les routes internes
function requireAdmin(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return res.status(503).json({ error: 'ADMIN_SECRET non configuré.' });
  const provided = req.headers['x-admin-secret'];
  if (provided !== secret) return res.status(401).json({ error: 'Non autorisé.' });
  next();
}

// Gestionnaire d'erreur global Prisma
async function withDb(fn, res) {
  try {
    return await fn();
  } catch (e) {
    console.error('DB error:', e.message);
    return res.status(503).json({ error: 'Erreur base de données.' });
  }
}

app.post('/api/provision', async (req, res) => {
  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans 15 minutes.' });
  }

  const { slug, lodge_name, contact_email, custom_domain } = req.body;

  if (!slug || !lodge_name || !contact_email)
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  if (!/^[a-z0-9-]{3,40}$/.test(slug))
    return res.status(400).json({ error: 'Slug invalide.' });
  if (lodge_name.length < 3 || lodge_name.length > 120)
    return res.status(400).json({ error: 'Nom de loge invalide (3–120 caractères).' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))
    return res.status(400).json({ error: 'Email invalide.' });
  if (custom_domain && !HOSTNAME_RE.test(custom_domain))
    return res.status(400).json({ error: 'Domaine personnalisé invalide.' });

  return withDb(async () => {
    const existing = await prisma.lodge.findUnique({ where: { slug } });
    if (existing) return res.status(409).json({ error: `Slug "${slug}" déjà utilisé.` });

    const lodgeUrl = custom_domain ? `https://${custom_domain}` : `https://${slug}.fraternapp.com`;

    await prisma.lodge.create({
      data: { slug, name: lodge_name, contactEmail: contact_email, adminEmail: `${slug}@fraternapp.com`, customDomain: custom_domain || null, pagesUrl: lodgeUrl, status: 'PROVISIONING' },
    });

    // Le mot de passe n'est PAS transmis à GitHub Actions
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/deploy-new-lodge.yml/dispatches`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json', 'User-Agent': 'FraternApp/1.0' },
        body: JSON.stringify({ ref: 'main', inputs: { slug, lodge_name, contact_email, custom_domain: custom_domain || '' } }),
      }).catch(e => console.error('GitHub error:', e.message));
    }

    res.json({ ok: true, slug, url: lodgeUrl });
  }, res);
});

// Route admin — protégée par ADMIN_SECRET
app.get('/api/lodges', requireAdmin, async (_req, res) => {
  return withDb(async () => {
    const lodges = await prisma.lodge.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(lodges);
  }, res);
});

// Nettoyage périodique du rate limiter en mémoire (toutes les heures)
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of ipHits) {
    if (val.reset < now) ipHits.delete(key);
  }
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API ready on :${PORT}`));
