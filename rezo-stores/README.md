# Rezo Stores — site vitrine

Site statique (HTML/CSS/JS, sans build ni dépendance) pour l'activité protection
solaire de RezoFabrik : stores bannes, coffres, pergolas bioclimatiques, stores
enrouleurs, motorisation et accessoires.

## Origine du contenu

L'arborescence du catalogue (catégories, familles, références des modèles) reprend
la gamme du fabricant **MecanoToldo** — `mecanotoldo.com` — dont ce site présente
les produits en tant que revendeur-poseur. À noter : le domaine `mecano-toldo.fr`
n'existe pas, le site officiel est bien `mecanotoldo.com`.

Tous les textes descriptifs, les arguments et les pages éditoriales sont rédigés
pour Rezo Stores ; aucun contenu n'est recopié du site du fabricant.

## Structure

```
rezo-stores/
├── index.html          toutes les vues (navigation par hash, pas de rechargement)
├── favicon.svg
└── assets/
    ├── style.css       palette sable / terracotta, responsive
    ├── data.js         coordonnées, catalogue, marques, réalisations, zones
    └── app.js          routeur, rendu du catalogue, recherche, formulaire
```

Pages : `#/` · `#/entreprise` · `#/catalogue` (+ `#/catalogue/<gamme>`) ·
`#/produit/<référence>` · `#/marques` · `#/realisations` · `#/devis`
(+ `#/devis?p=<référence>` pour présélectionner un modèle) · `#/contact` ·
`#/mentions`.

## Modifier le contenu

Presque tout se pilote depuis `assets/data.js`, sans toucher au HTML :

- **`SOCIETE`** — téléphone, e-mail, adresse, horaires. Ces valeurs sont injectées
  automatiquement dans l'en-tête, le pied de page, la page contact et le formulaire.
- **`CAT`** — le catalogue. Une gamme contient des familles, une famille contient
  des produits. Un produit accepte : `ref`, `nom`, `pitch`, et en option `specs`
  (tableau de caractéristiques), `checks` (liste à puces) et `couleurs`
  (nuancier). Ajouter un produit le fait apparaître dans le catalogue, la
  recherche, le sélecteur du formulaire de devis et le compteur de la page d'accueil.
- **`MARQUES`**, **`REALISATIONS`**, **`ZONES`** — les trois listes correspondantes.

## À faire avant mise en ligne

1. **Coordonnées réelles** — le téléphone `04 68 00 00 00` et l'e-mail sont des
   valeurs de démonstration (`SOCIETE` dans `data.js`).
2. **Photos** — tous les visuels sont des blocs gris marqués « visuel à fournir ».
   Les photos de chantier de la page Réalisations sont le contenu qui différencie
   le site des autres revendeurs de la même gamme.
3. **Formulaire de devis** — il affiche aujourd'hui une confirmation locale sans
   rien envoyer (`$('#quote')` dans `app.js`). Pour le brancher, remplacer le
   gestionnaire `submit` par un `fetch()` vers un service d'envoi (Cloudflare
   Worker + Resend, comme le reste du dépôt, ou un formulaire hébergé).
4. **Mentions légales** — la page `#/mentions` liste en italique les éléments
   obligatoires restant à compléter (SIREN, RCS, TVA, hébergeur, assurance
   décennale).

## Développement local

```bash
python3 -m http.server 8777      # depuis la racine du dépôt
# puis http://localhost:8777/rezo-stores/
```

Aucune étape de build : les fichiers servis sont les fichiers sources.
