// Cloudflare Worker — sert les assets statiques + proxy /api/claude + auth membres
const FB_API_KEY = 'AIzaSyA4IGmEv_bPt4Q5dnxjT2FIySP3JvAhQ20';
const FB_PROJECT = 'site-cg51';
const LOGE_APP_ID = 'site-cg51';
const JSON_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

async function fbSignIn(email, password) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FB_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  return r.json();
}

async function fsGet(path, idToken) {
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/${path}`, {
    headers: { 'Authorization': `Bearer ${idToken}` },
  });
  return r.ok ? r.json() : null;
}

async function fsGetAllDocs(path, idToken) {
  let docs = [];
  let pageToken = null;
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/${path}?pageSize=300${pageToken ? '&pageToken=' + pageToken : ''}`;
    const r = await fetch(url, { headers: { 'Authorization': `Bearer ${idToken}` } });
    if (!r.ok) break;
    const data = await r.json();
    if (data.documents) docs = docs.concat(data.documents);
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  return docs;
}

async function fsAddDoc(collectionPath, data, idToken) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) fields[k] = { stringValue: String(v) };
  const r = await fetch(
    `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/${collectionPath}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }, body: JSON.stringify({ fields }) }
  );
  return r.ok;
}

async function fsUpdate(path, fields, idToken) {
  const fieldPaths = Object.keys(fields).join(',');
  const body = { fields: {} };
  for (const [k, v] of Object.entries(fields)) body.fields[k] = { stringValue: v };
  const r = await fetch(
    `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/${path}?updateMask.fieldPaths=${fieldPaths}`,
    { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }, body: JSON.stringify(body) }
  );
  return r.ok;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redirection www → non-www
    if (url.hostname === 'www.lcg51.fr') {
      url.hostname = 'lcg51.fr';
      return Response.redirect(url.toString(), 301);
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' }
      });
    }

    // ── Proxy Claude API ──────────────────────────────────────────────────────
    if (url.pathname === '/api/claude' && request.method === 'POST') {
      const apiKey = env.CLAUDE_API_KEY;
      if (!apiKey) return new Response(JSON.stringify({ error: { message: 'Clé API non configurée' } }), { status: 500, headers: JSON_HEADERS });
      try {
        const body = await request.json();
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        return new Response(await resp.text(), { status: resp.status, headers: JSON_HEADERS });
      } catch (e) {
        return new Response(JSON.stringify({ error: { message: e.message } }), { status: 500, headers: JSON_HEADERS });
      }
    }

    // ── Vérification mot de passe membre + retour mot de passe de grade ───────
    if (url.pathname === '/api/member-login' && request.method === 'POST') {
      const workerEmail = env.FIREBASE_WORKER_EMAIL;
      const workerPwd = env.FIREBASE_WORKER_PASSWORD;
      if (!workerEmail || !workerPwd) {
        return new Response(JSON.stringify({ error: 'Worker non configuré' }), { status: 500, headers: JSON_HEADERS });
      }
      try {
        const { name, gradeKey, memberPassword } = await request.json();

        // Signer en tant que compte worker
        const auth = await fbSignIn(workerEmail, workerPwd);
        if (!auth.idToken) return new Response(JSON.stringify({ ok: false, reason: 'worker_auth' }), { headers: JSON_HEADERS });

        const idToken = auth.idToken;

        // Lire les membres
        const docs = await fsGetAllDocs(`artifacts/${LOGE_APP_ID}/public/data/members`, idToken);
        if (docs.length === 0) return new Response(JSON.stringify({ ok: false, reason: 'no_members' }), { headers: JSON_HEADERS });
        const words = n => (n || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z]+/).filter(w => w.length > 0);
        const found = docs.find(doc => {
          const docName = doc.fields?.name?.stringValue || '';
          const dw = words(docName);
          const nw = words(name);
          return nw.every(w => dw.some(d => d.includes(w) || w.includes(d))) ||
                 dw.every(w => nw.some(n => n.includes(w) || w.includes(n)));
        });

        if (!found) return new Response(JSON.stringify({ ok: false, reason: 'not_found' }), { headers: JSON_HEADERS });

        const fields = found.fields || {};
        const storedPwd = fields.accountPwd?.stringValue || '';
        if (!storedPwd || storedPwd !== memberPassword) {
          return new Response(JSON.stringify({ ok: false, reason: 'wrong_pwd' }), { headers: JSON_HEADERS });
        }

        // Mot de passe OK — récupérer le mot de passe de grade
        const pwdsDoc = await fsGet(`artifacts/${LOGE_APP_ID}/public/data/settings/gradesPasswords`, idToken);
        const gradePwd = pwdsDoc?.fields?.[gradeKey]?.stringValue || null;

        // Enregistrer la connexion (silencieux si échec)
        try {
          await fsAddDoc(`artifacts/${LOGE_APP_ID}/public/data/connexions`, {
            nom: fields.name?.stringValue || name,
            grade: gradeKey,
            date: new Date().toISOString(),
            ip: request.headers.get('CF-Connecting-IP') || 'unknown',
          }, idToken);
        } catch (_) {}

        return new Response(JSON.stringify({
          ok: true,
          gradePwd,
          memberName: fields.name?.stringValue || name,
          memberRole: fields.role?.stringValue || '',
          memberGenre: fields.genre?.stringValue || 'frere',
        }), { headers: JSON_HEADERS });

      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reason: e.message }), { status: 500, headers: JSON_HEADERS });
      }
    }

    // ── Changement mot de passe membre (par l'Architecte) ────────────────────
    if (url.pathname === '/api/member-pwd' && request.method === 'POST') {
      const workerEmail = env.FIREBASE_WORKER_EMAIL;
      const workerPwd = env.FIREBASE_WORKER_PASSWORD;
      if (!workerEmail || !workerPwd) {
        return new Response(JSON.stringify({ error: 'Worker non configuré' }), { status: 500, headers: JSON_HEADERS });
      }
      try {
        const { memberId, newPwd, architecteToken } = await request.json();
        if (!architecteToken) return new Response(JSON.stringify({ ok: false, reason: 'no_auth' }), { status: 401, headers: JSON_HEADERS });

        // Utiliser le token de l'Architecte pour la mise à jour (il a les droits Firestore)
        const ok = await fsUpdate(`artifacts/${LOGE_APP_ID}/public/data/members/${memberId}`, { accountPwd: newPwd }, architecteToken);
        return new Response(JSON.stringify({ ok }), { headers: JSON_HEADERS });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reason: e.message }), { status: 500, headers: JSON_HEADERS });
      }
    }

    // ── Cotisation membre : montant payé à ce jour pour l'année en cours ─────
    if (url.pathname === '/api/member-payment' && request.method === 'POST') {
      const workerEmail = env.FIREBASE_WORKER_EMAIL;
      const workerPwd = env.FIREBASE_WORKER_PASSWORD;
      if (!workerEmail || !workerPwd) {
        return new Response(JSON.stringify({ error: 'Worker non configuré' }), { status: 500, headers: JSON_HEADERS });
      }
      try {
        const { name, gradeKey } = await request.json();
        if (!name) return new Response(JSON.stringify({ ok: false, reason: 'no_name' }), { headers: JSON_HEADERS });

        const auth = await fbSignIn(workerEmail, workerPwd);
        if (!auth.idToken) return new Response(JSON.stringify({ ok: false, reason: 'worker_auth' }), { headers: JSON_HEADERS });
        const idToken = auth.idToken;

        // Trouver le membre par nom
        const memberDocs = await fsGetAllDocs(`artifacts/${LOGE_APP_ID}/public/data/members`, idToken);
        const words = n => (n || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z]+/).filter(w => w.length > 0);
        const found = memberDocs.find(doc => {
          const docName = doc.fields?.name?.stringValue || '';
          const dw = words(docName); const nw = words(name);
          return nw.every(w => dw.some(d => d.includes(w) || w.includes(d)));
        });
        if (!found) return new Response(JSON.stringify({ ok: true, totalPaye: 0, montantCotis: 0, annee: new Date().getFullYear(), reason: 'not_found' }), { headers: JSON_HEADERS });

        const memberId = found.name.split('/').pop();
        const annee = new Date().getFullYear() + 1;

        // Lire les cotisations de ce membre pour l'année en cours
        const cotisDocs = await fsGetAllDocs(`artifacts/${LOGE_APP_ID}/public/data/tresor_cotisations`, idToken);
        const totalPaye = cotisDocs
          .filter(d => d.fields?.membreId?.stringValue === memberId && parseInt(d.fields?.annee?.integerValue || d.fields?.annee?.doubleValue || 0) === annee)
          .reduce((s, d) => s + parseFloat(d.fields?.montant?.doubleValue || d.fields?.montant?.integerValue || 0), 0);

        // Lire le montant de capitation dans settings/capitation (configurateur Architecte)
        const capDoc = await fsGet(`artifacts/${LOGE_APP_ID}/public/data/settings/capitation`, idToken);
        const capFields = capDoc?.fields || {};
        const fv = f => parseFloat(capFields[f]?.doubleValue || capFields[f]?.integerValue || capFields[f]?.stringValue || 0);
        // Grade du membre : prendre le grade spécifique, sinon la base
        const gradeNorm = (gradeKey || '').toLowerCase().replace('maître','maitre').replace('maître','maitre');
        const montantGrade = fv(gradeNorm) || fv('maitre');
        const montantBase = fv('base');
        const montantCotis = montantGrade || montantBase || 0;

        return new Response(JSON.stringify({ ok: true, totalPaye, montantCotis, annee }), { headers: JSON_HEADERS });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reason: e.message }), { status: 500, headers: JSON_HEADERS });
      }
    }

    // ── Suppression connexions (par l'Architecte) ────────────────────────────
    if (url.pathname === '/api/delete-connexions' && request.method === 'POST') {
      const workerEmail = env.FIREBASE_WORKER_EMAIL;
      const workerPwd = env.FIREBASE_WORKER_PASSWORD;
      if (!workerEmail || !workerPwd) {
        return new Response(JSON.stringify({ error: 'Worker non configuré' }), { status: 500, headers: JSON_HEADERS });
      }
      try {
        const { ids } = await request.json();
        if (!ids || !ids.length) return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
        const auth = await fbSignIn(workerEmail, workerPwd);
        if (!auth.idToken) return new Response(JSON.stringify({ ok: false, reason: 'worker_auth' }), { headers: JSON_HEADERS });
        const idToken = auth.idToken;
        await Promise.all(ids.map(id =>
          fetch(`https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/artifacts/${LOGE_APP_ID}/public/data/connexions/${id}`,
            { method: 'DELETE', headers: { 'Authorization': `Bearer ${idToken}` } })
        ));
        return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reason: e.message }), { status: 500, headers: JSON_HEADERS });
      }
    }

    // ── Sauvegarde capitation (par l'Architecte) ──────────────────────────────
    if (url.pathname === '/api/save-capitation' && request.method === 'POST') {
      const workerEmail = env.FIREBASE_WORKER_EMAIL;
      const workerPwd = env.FIREBASE_WORKER_PASSWORD;
      if (!workerEmail || !workerPwd) {
        return new Response(JSON.stringify({ error: 'Worker non configuré' }), { status: 500, headers: JSON_HEADERS });
      }
      try {
        const cap = await request.json();
        const auth = await fbSignIn(workerEmail, workerPwd);
        if (!auth.idToken) return new Response(JSON.stringify({ ok: false, reason: 'worker_auth' }), { headers: JSON_HEADERS });
        const idToken = auth.idToken;
        const fields = {};
        for (const [k, v] of Object.entries(cap)) {
          const num = parseFloat(v);
          if (!isNaN(num)) fields[k] = { doubleValue: num };
        }
        const r = await fetch(
          `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/artifacts/${LOGE_APP_ID}/public/data/settings/capitation`,
          { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }, body: JSON.stringify({ fields }) }
        );
        return new Response(JSON.stringify({ ok: r.ok }), { headers: JSON_HEADERS });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, reason: e.message }), { status: 500, headers: JSON_HEADERS });
      }
    }

    // Tout le reste → assets statiques
    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env) {
    await sendBirthdayEmails(env);
  }
};

async function sendBirthdayEmails(env) {
  try {
    const workerEmail = env.FIREBASE_WORKER_EMAIL;
    const workerPwd = env.FIREBASE_WORKER_PASSWORD;
    if (!workerEmail || !workerPwd) return;

    const auth = await fbSignIn(workerEmail, workerPwd);
    if (!auth.idToken) return;
    const idToken = auth.idToken;

    // Récupérer la config email
    const configDoc = await fsGet(`artifacts/${LOGE_APP_ID}/public/data/settings/emailConfig`, idToken);
    if (!configDoc?.fields) return;
    const resendKey = configDoc.fields.resendKey?.stringValue || '';
    const vmEmail = configDoc.fields.vmEmail?.stringValue || '';
    const nomLoge = configDoc.fields.nomLoge?.stringValue || 'La Loge';
    if (!resendKey) return;

    // Récupérer tous les membres
    const memberDocs = await fsGetAllDocs(`artifacts/${LOGE_APP_ID}/public/data/members`, idToken);

    // Date du jour (DD/MM)
    const now = new Date();
    const todayMM = String(now.getMonth() + 1).padStart(2, '0');
    const todayDD = String(now.getDate()).padStart(2, '0');
    const todayKey = `${todayMM}-${todayDD}`;

    const birthdayMembers = [];
    const initiationMembers = [];

    for (const doc of memberDocs) {
      const f = doc.fields || {};
      const name = f.name?.stringValue || '';
      const email = f.email?.stringValue || '';
      const genre = f.genre?.stringValue || 'frere';
      const grade = f.grade?.stringValue || '';
      if (!name) continue;

      // Anniversaire civil (format YYYY-MM-DD)
      const dn = f.dateNaissance?.stringValue || '';
      if (dn && dn.length >= 7) {
        const parts = dn.split('-');
        const mm = parts[1], dd = parts[2]?.slice(0,2);
        if (mm && dd && `${mm}-${dd}` === todayKey) birthdayMembers.push({ name, email, genre, grade });
      }

      // Anniversaire d'initiation
      const di = f.dateInitiation?.stringValue || '';
      if (di && di.length >= 7) {
        const parts = di.split('-');
        const mm = parts[1], dd = parts[2]?.slice(0,2);
        if (mm && dd && `${mm}-${dd}` === todayKey) initiationMembers.push({ name, email, genre, grade });
      }
    }

    const titre = g => g === 'soeur' ? 'Sœur' : 'Frère';
    const allEmails = [...memberDocs.map(d => d.fields?.email?.stringValue).filter(e => e && e.includes('@'))];

    // ── Anniversaires civils ──
    for (const m of birthdayMembers) {
      const displayName = m.name.replace(/^(fr[eè]re|s[oœ]eur|f[∴.]\s*|s[∴.]\s*)/i, '').trim();
      const t = titre(m.genre);

      // Email au membre
      if (m.email) {
        await sendEmail(resendKey, {
          to: m.email,
          subject: `🎂 Joyeux anniversaire, ${t} ${displayName} !`,
          html: birthdayHtmlMember(displayName, t, nomLoge),
        });
      }

      // Email à tous les membres + VM
      const recipients = [...new Set([...allEmails, vmEmail])].filter(e => e && e !== m.email);
      for (const to of recipients) {
        await sendEmail(resendKey, {
          to,
          subject: `🎂 Anniversaire — ${t} ${displayName}`,
          html: birthdayHtmlAll(displayName, t, nomLoge),
        });
      }
    }

    // ── Anniversaires d'initiation ──
    for (const m of initiationMembers) {
      const displayName = m.name.replace(/^(fr[eè]re|s[oœ]eur|f[∴.]\s*|s[∴.]\s*)/i, '').trim();
      const t = titre(m.genre);
      const years = new Date().getFullYear() - parseInt((m.email ? (memberDocs.find(d => d.fields?.email?.stringValue === m.email)?.fields?.dateInitiation?.stringValue||'').split('-')[0] : '0')) || null;

      if (m.email) {
        await sendEmail(resendKey, {
          to: m.email,
          subject: `⚒️ Anniversaire maçonnique, ${t} ${displayName} !`,
          html: initiationHtmlMember(displayName, t, nomLoge),
        });
      }

      const recipients = [...new Set([...allEmails, vmEmail])].filter(e => e && e !== m.email);
      for (const to of recipients) {
        await sendEmail(resendKey, {
          to,
          subject: `⚒️ Anniversaire d'initiation — ${t} ${displayName}`,
          html: initiationHtmlAll(displayName, t, nomLoge),
        });
      }
    }
  } catch(e) {
    console.error('sendBirthdayEmails error:', e);
  }
}

async function sendEmail(apiKey, { to, subject, html }) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Loge <noreply@resend.dev>', to, subject, html }),
    });
  } catch(e) {}
}

function birthdayHtmlMember(name, titre, loge) {
  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#fdf6e3;margin:0;padding:0">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px #0001">
  <div style="background:#1e293b;padding:32px;text-align:center">
    <div style="font-size:48px;margin-bottom:8px">∴</div>
    <h1 style="color:#f59e0b;font-family:Georgia,serif;margin:0;font-size:22px;letter-spacing:3px;text-transform:uppercase">À la Gloire du Grand Architecte</h1>
  </div>
  <div style="padding:40px 32px;text-align:center">
    <p style="font-size:32px;margin:0 0 8px">🎂</p>
    <h2 style="color:#1e293b;font-family:Georgia,serif;font-size:26px;margin:0 0 24px">Joyeux Anniversaire, ${titre} ${name} !</h2>
    <p style="color:#475569;font-size:16px;line-height:1.7;margin:0 0 20px">En ce jour particulier, la Loge <strong>${loge}</strong> s'unit dans la joie et la fraternité pour vous souhaiter un très heureux anniversaire.</p>
    <p style="color:#475569;font-size:16px;line-height:1.7;margin:0 0 20px">Que cette nouvelle année vous apporte lumière, sagesse et bonheur, dans vos travaux de l'Ordre comme dans votre vie profane.</p>
    <div style="background:#fdf6e3;border-left:4px solid #f59e0b;padding:16px 20px;margin:28px 0;text-align:left;border-radius:0 8px 8px 0">
      <p style="color:#92400e;font-style:italic;margin:0;font-size:15px">"La Franc-Maçonnerie est un voyage intérieur dont chaque anniversaire marque une étape de plus vers la lumière."</p>
    </div>
    <p style="color:#475569;font-size:15px">Vos Frères et Sœurs de la Loge <strong>${loge}</strong> vous embrassent fraternellement. ⚒️</p>
  </div>
  <div style="background:#1e293b;padding:16px;text-align:center">
    <p style="color:#64748b;font-size:11px;margin:0;letter-spacing:1px">LIBERTÉ · ÉGALITÉ · FRATERNITÉ</p>
  </div>
</div></body></html>`;
}

function birthdayHtmlAll(name, titre, loge) {
  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#fdf6e3;margin:0;padding:0">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px #0001">
  <div style="background:#1e293b;padding:32px;text-align:center">
    <div style="font-size:48px;margin-bottom:8px">∴</div>
    <h1 style="color:#f59e0b;font-family:Georgia,serif;margin:0;font-size:22px;letter-spacing:3px;text-transform:uppercase">${loge}</h1>
  </div>
  <div style="padding:40px 32px;text-align:center">
    <p style="font-size:40px;margin:0 0 12px">🎂</p>
    <h2 style="color:#1e293b;font-family:Georgia,serif;font-size:22px;margin:0 0 20px">Anniversaire en Loge</h2>
    <p style="color:#475569;font-size:16px;line-height:1.7">Chers Frères et Sœurs,</p>
    <p style="color:#475569;font-size:16px;line-height:1.7">Aujourd'hui, c'est le jour d'anniversaire de notre ${titre} <strong>${name}</strong>.</p>
    <p style="color:#475569;font-size:16px;line-height:1.7">N'hésitez pas à lui transmettre vos vœux fraternels !</p>
    <div style="background:#fdf6e3;border:2px solid #f59e0b;border-radius:8px;padding:20px;margin:28px 0;display:inline-block">
      <p style="color:#92400e;font-size:20px;font-weight:bold;margin:0">🎉 ${titre} ${name}</p>
    </div>
  </div>
  <div style="background:#1e293b;padding:16px;text-align:center">
    <p style="color:#64748b;font-size:11px;margin:0;letter-spacing:1px">LIBERTÉ · ÉGALITÉ · FRATERNITÉ</p>
  </div>
</div></body></html>`;
}

function initiationHtmlMember(name, titre, loge) {
  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#1e293b;margin:0;padding:0">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px #0003">
  <div style="background:#1e293b;padding:32px;text-align:center">
    <div style="font-size:48px;margin-bottom:8px">⚒️</div>
    <h1 style="color:#f59e0b;font-family:Georgia,serif;margin:0;font-size:22px;letter-spacing:3px;text-transform:uppercase">Anniversaire Maçonnique</h1>
  </div>
  <div style="padding:40px 32px;text-align:center">
    <h2 style="color:#1e293b;font-family:Georgia,serif;font-size:24px;margin:0 0 24px">${titre} ${name},</h2>
    <p style="color:#475569;font-size:16px;line-height:1.7">En ce jour, la Loge <strong>${loge}</strong> commémore avec vous l'anniversaire de votre initiation à nos Mystères.</p>
    <p style="color:#475569;font-size:16px;line-height:1.7">Depuis ce moment fondateur, vous avez cheminé sur la voie de la perfection, pierre après pierre, degré après degré.</p>
    <div style="background:#fdf6e3;border-left:4px solid #f59e0b;padding:16px 20px;margin:28px 0;text-align:left;border-radius:0 8px 8px 0">
      <p style="color:#92400e;font-style:italic;margin:0;font-size:15px">"La vraie initiation n'est pas un instant, c'est un chemin que l'on emprunte chaque jour avec courage et humilité."</p>
    </div>
    <p style="color:#475569;font-size:15px">Vos Frères et Sœurs vous adressent leurs vœux fraternels les plus sincères. Que la Lumière continue de guider vos pas. ∴</p>
  </div>
  <div style="background:#1e293b;padding:16px;text-align:center">
    <p style="color:#64748b;font-size:11px;margin:0;letter-spacing:1px">LIBERTÉ · ÉGALITÉ · FRATERNITÉ</p>
  </div>
</div></body></html>`;
}

function initiationHtmlAll(name, titre, loge) {
  return `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#fdf6e3;margin:0;padding:0">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px #0001">
  <div style="background:#1e293b;padding:32px;text-align:center">
    <div style="font-size:48px;margin-bottom:8px">⚒️</div>
    <h1 style="color:#f59e0b;font-family:Georgia,serif;margin:0;font-size:22px;letter-spacing:3px;text-transform:uppercase">${loge}</h1>
  </div>
  <div style="padding:40px 32px;text-align:center">
    <p style="font-size:40px;margin:0 0 12px">∴</p>
    <h2 style="color:#1e293b;font-family:Georgia,serif;font-size:22px;margin:0 0 20px">Anniversaire d'Initiation</h2>
    <p style="color:#475569;font-size:16px;line-height:1.7">Chers Frères et Sœurs,</p>
    <p style="color:#475569;font-size:16px;line-height:1.7">Aujourd'hui marque l'anniversaire de l'initiation de notre ${titre} <strong>${name}</strong>.</p>
    <p style="color:#475569;font-size:16px;line-height:1.7">Unissons-nous fraternellement pour lui adresser nos plus chaleureux vœux maçonniques !</p>
    <div style="background:#1e293b;border-radius:8px;padding:20px;margin:28px 0;display:inline-block">
      <p style="color:#f59e0b;font-size:20px;font-weight:bold;margin:0">⚒️ ${titre} ${name} ∴</p>
    </div>
  </div>
  <div style="background:#1e293b;padding:16px;text-align:center">
    <p style="color:#64748b;font-size:11px;margin:0;letter-spacing:1px">LIBERTÉ · ÉGALITÉ · FRATERNITÉ</p>
  </div>
</div></body></html>`;
}
