# Ombre et Lumière — site vitrine

Site statique (HTML/CSS/JS, sans build ni dépendance) pour **Ombre et Lumière**,
Patrick Thais, à Thuir (66300) : vente, pose et SAV de stores bannes, stores
coffre, pergolas bioclimatiques, stores enrouleurs, motorisation et accessoires
dans les Pyrénées-Orientales.

## Origine du catalogue

L'arborescence, les **références** et les **caractéristiques techniques**
(dimensions maximales, type de bras, classement au vent EN 13561, matériaux,
manœuvre) reprennent la gamme du fournisseur **MecanoToldo** —
<https://www.mecanotoldo.com> — dont l'entreprise est revendeur-poseur.

La gamme **Stores est intégrale** : les 31 modèles des 7 familles du fournisseur
sont présents, chacun avec ses cotes maxi et son classement au vent réels. Les
autres catégories (Outdoor, Stores rouleurs, Motorisation, Compléments) reprennent
elles aussi la totalité des familles et des modèles du catalogue fournisseur.

Les textes de présentation, les arguments commerciaux et les pages éditoriales
sont rédigés pour Ombre et Lumière ; aucun contenu n'est recopié du site du
fournisseur.

## Structure

```
ombre-et-lumiere/
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

- **`SOCIETE`** — nom, gérant, téléphone, e-mail, adresse, horaires. Ces valeurs
  sont injectées automatiquement dans l'en-tête, le pied de page, la page contact,
  les mentions légales et le formulaire.
- **`CAT`** — le catalogue. Une gamme contient des familles, une famille contient
  des produits. Un produit accepte : `ref`, `nom`, `pitch`, et en option `specs`
  (tableau de caractéristiques), `checks` (liste à puces) et `couleurs`
  (nuancier). Ajouter un produit le fait apparaître dans le catalogue, la
  recherche, le sélecteur du formulaire de devis et les compteurs du site.
- **`RAL_BASE` / `RAL_STD`** — le nuancier de structure du fournisseur.
- **`MARQUES`**, **`REALISATIONS`**, **`ZONES`** — les trois listes correspondantes.

Les fiches produit affichent la référence fabricant uniquement quand elle est
numérique (gamme Stores) ; les autres gammes sont identifiées par leur nom de
modèle. C'est géré par `hasRef()` dans `app.js`.

## À compléter avant mise en ligne

1. **Coordonnées réelles** — dans `SOCIETE` (`assets/data.js`) :
   - `tel` / `telHref` : `04 68 00 00 00` est un numéro de démonstration ;
   - `mail` : `contact@ombre-et-lumiere.fr` est à confirmer ;
   - `adresse` : seule la commune (66300 Thuir) est renseignée, la rue manque.
2. **Photos** — tous les visuels sont des blocs gris marqués « visuel à fournir ».
   Les photos de chantier de la page Réalisations sont le contenu qui différencie
   le site des autres revendeurs de la même gamme.
3. **Formulaire de devis** — il affiche aujourd'hui une confirmation locale sans
   rien envoyer (`$('#quote')` dans `app.js`). Pour le brancher, remplacer le
   gestionnaire `submit` par un `fetch()` vers un service d'envoi (Cloudflare
   Worker + Resend, comme le reste du dépôt, ou un formulaire hébergé).
4. **Mentions légales** — la page `#/mentions` liste en italique les éléments
   obligatoires restant à fournir (SIREN, RCS ou répertoire des métiers, TVA,
   hébergeur, assurance décennale).
5. **Réalisations** — les six chantiers listés dans `REALISATIONS` sont des
   exemples plausibles, à remplacer par de vrais chantiers.

## Développement local

```bash
python3 -m http.server 8777      # depuis la racine du dépôt
# puis http://localhost:8777/ombre-et-lumiere/
```

Aucune étape de build : les fichiers servis sont les fichiers sources.
