/* ===========================================================
   Rezo Stores — routeur et rendu
   Site statique : un seul document, navigation par hash.
   =========================================================== */

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------------- helpers catalogue ---------------- */

function allProduits(){
  const out = [];
  for (const [ck,c] of Object.entries(CAT))
    for (const f of c.familles)
      for (const p of f.produits) out.push({p,f,c,ck});
  return out;
}
const findProd = ref => allProduits().find(x => x.p.ref === ref) || null;
const countProduits = c => c.familles.reduce((a,f) => a + f.produits.length, 0);
const TOTAL = allProduits().length;

/* Les gammes stores portent une référence fabricant numérique ; les autres
   sont identifiées par un nom de modèle seul. */
const hasRef = ref => /^[0-9]/.test(ref);

/* ---------------- injection des coordonnées ---------------- */

function injectSociete(){
  $$('[data-tel]').forEach(a => {
    a.href = 'tel:' + SOCIETE.telHref;
    if (a.dataset.tel === 'href') return;          // le libellé du lien est conservé
    const lbl = a.querySelector('.lbl');
    if (lbl) lbl.textContent = SOCIETE.tel; else a.textContent = SOCIETE.tel;
  });
  $$('[data-mail]').forEach(a => {
    a.href = 'mailto:' + SOCIETE.mail;
    if (a.dataset.mail !== 'href') a.textContent = SOCIETE.mail;
  });
  $$('[data-adresse]').forEach(n => { n.innerHTML = SOCIETE.adresse.map(l => `<li>${esc(l)}</li>`).join(''); });
  $$('[data-horaires]').forEach(n => { n.innerHTML = SOCIETE.horaires.map(l => `<p>${esc(l)}</p>`).join(''); });
  $$('[data-total]').forEach(n => { n.textContent = TOTAL; });
  $$('[data-year]').forEach(n => { n.textContent = new Date().getFullYear(); });
}

/* ---------------- rendus statiques ---------------- */

function renderHome(){
  $('#home-cats').innerHTML = Object.entries(CAT).map(([k,c]) => `
    <a class="card" href="#/catalogue/${k}">
      <div class="ph">Visuel ${esc(c.court)}</div>
      <div class="body">
        <span class="ref">${countProduits(c)} modèles</span>
        <h3>${esc(c.label)}</h3>
        <p>${esc(c.desc)}</p>
      </div>
    </a>`).join('');

  $('#home-zones').innerHTML = ZONES.map(z => `<span>${esc(z)}</span>`).join('');

  $('#home-real').innerHTML = REALISATIONS.slice(0,3).map(r => `
    <a class="card" href="#/realisations">
      <div class="ph">Photo chantier</div>
      <div class="body">
        <span class="ref">${esc(r.commune)}</span>
        <h3>${esc(r.titre)}</h3>
        <p>${esc(r.txt)}</p>
      </div>
    </a>`).join('');
}

function renderMarques(){
  $('#marques-grid').innerHTML = MARQUES.map(m => `
    <div class="brand">
      <div class="name">${esc(m.nom)}</div>
      <div class="role">${esc(m.role)}</div>
      <p>${esc(m.txt)}</p>
    </div>`).join('');
}

function renderRealisations(){
  $('#real-grid').innerHTML = REALISATIONS.map(r => `
    <a class="card" href="#/devis">
      <div class="ph">Photo chantier</div>
      <div class="body">
        <span class="ref">${esc(r.commune)}</span>
        <h3>${esc(r.titre)}</h3>
        <p>${esc(r.txt)}</p>
      </div>
    </a>`).join('');
}

function renderDevisSelect(){
  const opts = Object.entries(CAT).map(([k,c]) =>
    `<optgroup label="${esc(c.label)}">` +
    c.familles.flatMap(f => f.produits.map(p =>
      `<option value="${esc(p.ref)}">${esc(f.nom)} — ${esc(p.nom)}</option>`)).join('') +
    `</optgroup>`).join('');
  $('#f-type').insertAdjacentHTML('beforeend', opts + `<option value="autre">Je ne sais pas encore / à conseiller</option>`);
}

function renderFilters(){
  $('#cat-filters').innerHTML =
    `<a class="chip" href="#/catalogue">Tout le catalogue</a>` +
    Object.entries(CAT).map(([k,c]) => `<a class="chip" href="#/catalogue/${k}">${esc(c.label)}</a>`).join('');
}

/* ---------------- catalogue ---------------- */

let currentCat = null;

function cardProduit(p, f){
  return `<a class="card" href="#/produit/${encodeURIComponent(p.ref)}">
    <div class="ph">${esc(p.nom)}</div>
    <div class="body">
      <span class="ref">${hasRef(p.ref) ? 'RÉF. ' + esc(p.ref) : esc(f.nom).toUpperCase()}</span>
      <h3>${esc(p.nom)}</h3>
      <p>${esc(p.pitch || f.nom)}</p>
    </div>
  </a>`;
}

function renderCat(key){
  currentCat = (key && CAT[key]) ? key : null;
  const c = currentCat ? CAT[currentCat] : null;

  $('#cat-title').textContent = c ? c.label : 'Toutes nos gammes';
  $('#cat-desc').textContent  = c ? c.desc :
    "Chaque produit est fabriqué sur mesure. Les dimensions maximales, coloris et motorisations disponibles sont précisés sur chaque fiche, et confirmés au métré.";

  $$('#cat-filters .chip').forEach(a =>
    a.classList.toggle('on', a.getAttribute('href') === (currentCat ? `#/catalogue/${currentCat}` : '#/catalogue')));

  renderCatBody();
}

function renderCatBody(){
  const q = ($('#cat-search').value || '').trim().toLowerCase();
  const keys = currentCat ? [currentCat] : Object.keys(CAT);
  let found = 0;

  const html = keys.map(k => CAT[k].familles.map(f => {
    const prods = f.produits.filter(p => !q ||
      p.nom.toLowerCase().includes(q) ||
      p.ref.toLowerCase().includes(q) ||
      (p.pitch || '').toLowerCase().includes(q) ||
      f.nom.toLowerCase().includes(q));
    if (!prods.length) return '';
    found += prods.length;
    return `
      <div class="famtitle">
        <h3>${esc(f.nom)}</h3>
        <span>${esc(f.note || '')}</span>
      </div>
      <div class="grid g4">${prods.map(p => cardProduit(p, f)).join('')}</div>`;
  }).join('')).join('');

  $('#cat-body').innerHTML = found ? html :
    `<div class="empty">Aucun modèle ne correspond à « ${esc(q)} ». Essayez une référence (ex. <b>5036</b>) ou un mot-clé (ex. <b>pergola</b>).</div>`;
  $('#cat-count').textContent = found + (found > 1 ? ' modèles affichés' : ' modèle affiché');
}

/* ---------------- fiche produit ---------------- */

function renderProd(ref){
  const hit = findProd(ref);
  if (!hit) { location.hash = '#/catalogue'; return false; }
  const {p, f, c, ck} = hit;

  $('#p-crumb').innerHTML =
    `<a href="#/">Accueil</a> › <a href="#/catalogue">Catalogue</a> › ` +
    `<a href="#/catalogue/${ck}">${esc(c.label)}</a> › ${esc(p.nom)}`;
  $('#p-fam').textContent  = f.nom;
  $('#p-name').textContent = p.nom;
  $('#p-ref').textContent  = hasRef(p.ref) ? 'Référence fabricant ' + p.ref : '';
  $('#p-hero').textContent = 'Visuel ' + p.nom;
  $('#p-pitch').textContent = p.pitch || '';

  $('#p-checks').innerHTML = p.checks
    ? `<ul class="checks">${p.checks.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';

  const specs = Object.assign(
    hasRef(p.ref) ? {"Référence fabricant": p.ref, "Famille": f.nom} : {"Famille": f.nom},
    p.specs || {});
  $('#p-spec').innerHTML = Object.entries(specs)
    .map(([k,v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');

  $('#p-colors').innerHTML = p.couleurs
    ? `<p class="sw-label" style="margin-top:22px;font-weight:700;color:var(--ink)">Coloris de structure</p>
       <div class="swatches">${p.couleurs.map(([n,h]) =>
         `<div class="sw" style="background:${esc(h)}" title="${esc(n)}"></div>`).join('')}</div>
       <p class="sw-label">Autres teintes RAL sur demande. Le nuancier des toiles est présenté lors du métré.</p>`
    : `<p class="sw-label" style="margin-top:22px">Coloris de structure et nuancier des toiles présentés lors du métré.</p>`;

  $('#p-devis').href = `#/devis?p=${encodeURIComponent(p.ref)}`;

  const voisins = f.produits.filter(x => x.ref !== p.ref).slice(0,4);
  $('#p-related').innerHTML = voisins.length
    ? `<div class="famtitle"><h3>Autres modèles ${esc(f.nom.toLowerCase())}</h3></div>
       <div class="grid g4">${voisins.map(x => cardProduit(x, f)).join('')}</div>` : '';

  document.title = hasRef(p.ref)
    ? `${p.nom} (réf. ${p.ref}) — ${f.nom} · Rezo Stores`
    : `${p.nom} — ${f.nom} · Rezo Stores`;
  return true;
}

/* ---------------- routeur ---------------- */

const TITRES = {
  '':          "Rezo Stores — Stores bannes, pergolas et protection solaire · Perpignan (66)",
  'entreprise':"L'entreprise — Rezo Stores",
  'catalogue': "Catalogue — Rezo Stores",
  'marques':   "Nos marques partenaires — Rezo Stores",
  'realisations':"Réalisations dans les P.-O. — Rezo Stores",
  'devis':     "Demande de devis gratuit — Rezo Stores",
  'contact':   "Contact & atelier — Rezo Stores",
  'mentions':  "Mentions légales — Rezo Stores"
};

const VUES = {
  '':'#v-home', 'entreprise':'#v-entreprise', 'catalogue':'#v-cat', 'produit':'#v-prod',
  'marques':'#v-marques', 'realisations':'#v-real', 'devis':'#v-devis',
  'contact':'#v-contact', 'mentions':'#v-mentions'
};

function route(){
  const h = (location.hash || '#/').slice(2);
  const [path, qs] = h.split('?');
  const seg = path.split('/').filter(Boolean);
  const key = seg[0] || '';

  $$('.view').forEach(v => v.classList.remove('on'));
  $('#nav').classList.remove('open');

  if (key === 'catalogue')       renderCat(seg[1]);
  else if (key === 'produit')  { if (!renderProd(decodeURIComponent(seg[1] || ''))) return; }
  else if (key === 'devis')    {
    const ref = new URLSearchParams(qs || '').get('p');
    if (ref) $('#f-type').value = ref;
  }

  const vue = VUES[key] || VUES[''];
  $(vue).classList.add('on');
  if (key !== 'produit') document.title = TITRES[key] || TITRES[''];

  const base = '#/' + (key ? key : '');
  $$('nav.main a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('on', href === base || href === location.hash);
  });

  window.scrollTo({top:0, behavior:'instant'});
}

/* ---------------- initialisation ---------------- */

injectSociete();
renderHome();
renderMarques();
renderRealisations();
renderFilters();
renderDevisSelect();

$('#burger').onclick = () => $('#nav').classList.toggle('open');
$('#cat-search').addEventListener('input', renderCatBody);
$('#cat-clear').addEventListener('click', () => { $('#cat-search').value = ''; renderCatBody(); });

$('#quote').addEventListener('submit', e => {
  e.preventDefault();
  $('#quote-ok').style.display = 'block';
  $('#quote-ok').scrollIntoView({behavior:'smooth', block:'center'});
});

window.addEventListener('hashchange', route);
route();
