#!/usr/bin/env node
/**
 * PosterMaison — Générateur de catalogue automatique
 *
 * Usage : node boutique/generate-catalog.js
 *
 * Scanne le dossier boutique/images/ et génère boutique/products.json
 * Structure attendue :
 *   boutique/images/
 *     vintage/    ← catégorie "Vintage"
 *       affiche1.jpg
 *     nature/     ← catégorie "Nature"
 *       affiche2.jpg
 */

const fs   = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;
const IMG_DIR    = path.join(SCRIPT_DIR, 'images');
const OUT_FILE   = path.join(SCRIPT_DIR, 'products.json');
const IMG_EXTS   = /\.(jpg|jpeg|png|webp|avif|gif)$/i;

// Crée le dossier images/ s'il n'existe pas
if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log('📁 Dossier boutique/images/ créé.');
}

// Lecture des sous-dossiers (= catégories)
const catDirs = fs.readdirSync(IMG_DIR)
  .filter(name => {
    try { return fs.statSync(path.join(IMG_DIR, name)).isDirectory() && !name.startsWith('.'); }
    catch { return false; }
  })
  .sort();

if (!catDirs.length) {
  console.log('⚠️  Aucune catégorie trouvée dans boutique/images/');
  console.log('   Crée des sous-dossiers (ex: boutique/images/vintage/) et relance le script.');
  process.exit(0);
}

const products  = [];
const cats      = [];
let   counter   = 1;

for (const dir of catDirs) {
  const dirPath  = path.join(IMG_DIR, dir);
  const catLabel = toTitleCase(dir);
  cats.push(catLabel);

  const files = fs.readdirSync(dirPath)
    .filter(f => IMG_EXTS.test(f) && !f.startsWith('.'))
    .sort();

  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    const name = toTitleCase(base.replace(/[-_]/g, ' '));

    products.push({
      id       : `${dir}-${String(counter++).padStart(4, '0')}`,
      name,
      category : catLabel,
      image    : `images/${dir}/${file}`,
    });
  }
}

const catalog = {
  generated  : new Date().toISOString(),
  total      : products.length,
  categories : cats,
  products,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(catalog, null, 2), 'utf8');

console.log('');
console.log('✅  Catalogue mis à jour :');
console.log(`   📁  ${cats.length} catégorie${cats.length !== 1 ? 's' : ''}  →  ${cats.join(', ')}`);
console.log(`   🖼   ${products.length} affiche${products.length !== 1 ? 's' : ''}`);
console.log(`   📄  boutique/products.json`);
console.log('');

function toTitleCase(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}
