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
  }
};
