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
├── build-artifact.py   compile le tout en un HTML unique (images en data: URI)
└── assets/
    ├── style.css       palette bleu → blanc, responsive
    ├── data.js         coordonnées, catalogue, marques, réalisations, zones
    ├── images.js       GÉNÉRÉ — association référence → visuels
    ├── app.js          routeur, rendu du catalogue, recherche, formulaire
    └── img/            visuels produit (800 × 600) et vignettes (300 × 300)
```

## Visuels

Les photos produit proviennent du catalogue en ligne du fournisseur
**MecanoToldo**, redimensionnées et recompressées pour le web. 44 modèles ont
leur propre visuel ; les autres affichent le visuel de leur gamme
(`assets/img/gamme-*.jpg`).

⚠️ **Ces photos appartiennent à MecanoToldo.** Leur usage par un revendeur est
l'arrangement habituel, mais il faut le faire confirmer par le fournisseur avant
la mise en ligne publique — et lui demander par la même occasion le pack haute
définition de son espace professionnel, qui sera de meilleure qualité que ce qui
est récupérable depuis le site.

Pour remplacer un visuel par une photo maison : écraser le fichier
correspondant dans `assets/img/` en gardant le même nom. Aucune autre
modification n'est nécessaire.

Les photos de la page **Réalisations** sont volontairement laissées vides :
ce sont les chantiers de Patrick, et c'est le seul contenu qui le distingue
des autres revendeurs de la même gamme.

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
   - `tel` / `telHref` : renseignés (06 62 18 14 01) ;
   - `mail` : `contact@ombre-et-lumiere.fr` est à confirmer ;
   - `adresse` : seule la commune (66300 Thuir) est renseignée, la rue manque.
2. **Photos** — les visuels produit viennent du fournisseur (voir la section
   « Visuels » ci-dessus) : faire confirmer le droit d'usage et récupérer le pack
   haute définition. Les photos de chantier de la page Réalisations restent à
   fournir par Patrick.
3. **Formulaire de devis** — il affiche aujourd'hui une confirmation locale sans
   rien envoyer (`$('#quote')` dans `app.js`). Pour le brancher, remplacer le
   gestionnaire `submit` par un `fetch()` vers un service d'envoi (Cloudflare
   Worker + Resend, comme le reste du dépôt, ou un formulaire hébergé).
4. **Mentions légales** — Patrick est auto-entrepreneur ; la page `#/mentions`
   liste en italique les éléments obligatoires restant à fournir (SIREN,
   répertoire des métiers, mention de TVA au titre de l'article 293 B du CGI,
   hébergeur, et surtout l'assurance décennale).
5. **Réalisations** — les six chantiers listés dans `REALISATIONS` sont des
   exemples plausibles, à remplacer par de vrais chantiers.

## Développement local

```bash
python3 -m http.server 8777      # depuis la racine du dépôt
# puis http://localhost:8777/ombre-et-lumiere/
```

Aucune étape de build : les fichiers servis sont les fichiers sources.

## Version partageable en un fichier

```bash
python3 build-artifact.py /chemin/ombre-et-lumiere.html
```

Produit un HTML autonome (~6 Mo) avec CSS, JS et images intégrés, à ouvrir
directement ou à publier tel quel.
