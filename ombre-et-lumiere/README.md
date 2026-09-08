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

La page **Inspirations** (`#/galerie`) présente 18 de ces photos comme
exemples d'installations des modèles du catalogue, chaque vignette renvoyant
vers la fiche du modèle. Une mention explicite précise qu'il s'agit de photos
du fabricant et non de chantiers réalisés par Ombre et Lumière — c'est ce qui
permet d'illustrer le site sans rien s'attribuer.

Le jour où Patrick aura ses propres photos de chantier, elles méritent une
page à part, qui pourra elle porter le titre « Réalisations » : c'est le seul
contenu qui le distingue des autres revendeurs de la même gamme, et celui qui
fait remonter le site sur « store banne + commune ».

Pages : `#/` · `#/entreprise` · `#/catalogue` (+ `#/catalogue/<gamme>`) ·
`#/produit/<référence>` · `#/marques` · `#/galerie` · `#/devis`
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
- **`MARQUES`**, **`GALERIE`**, **`ZONES`** — les trois listes correspondantes.
  `GALERIE` associe une référence produit à une légende ; la photo est reprise
  automatiquement du modèle.

Les fiches produit affichent la référence fabricant uniquement quand elle est
numérique (gamme Stores) ; les autres gammes sont identifiées par leur nom de
modèle. C'est géré par `hasRef()` dans `app.js`.

## À compléter avant mise en ligne

1. **Installateur partenaire** — la page Entreprise contient un encadré
   « Qui fait quoi » où il faut inscrire le nom du partenaire et ses références
   d'assurance. C'est le seul point qui reste bloquant côté contenu.
2. **Photos** — les visuels produit viennent du fournisseur (voir la section
   « Visuels » ci-dessus) : faire confirmer le droit d'usage et récupérer le pack
   haute définition. Les photos de chantier de la page Réalisations restent à
   fournir par Patrick.
3. **Formulaire de devis** — il affiche aujourd'hui une confirmation locale sans
   rien envoyer (`$('#quote')` dans `app.js`). Pour le brancher, remplacer le
   gestionnaire `submit` par un `fetch()` vers un service d'envoi (Cloudflare
   Worker + Resend, comme le reste du dépôt, ou un formulaire hébergé).
4. **Mentions légales** — identité renseignée d'après l'attestation RNE du
   08/09/2026 (SIREN 323 165 589, SIRET 323 165 589 00041, entrepreneur
   individuel, APE 7021Z). Restent la mention de TVA (art. 293 B du CGI),
   l'hébergeur, et l'attestation de responsabilité civile professionnelle.
5. **Photos de chantier** — quand Patrick en aura, créer une vraie page
   Réalisations à côté de la galerie d'inspirations.

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

## Périmètre d'activité — à ne pas modifier à la légère

L'attestation d'immatriculation au RNE déclare deux activités :

1. apporteur d'affaires en publicité et communication (activité principale,
   APE 7021Z) ;
2. **achat-revente** de toiles de stores, stores, lambrequins lumineux et
   divers articles non réglementés, en clientèle.

**La pose n'est pas une activité déclarée.** Le site est donc rédigé sur le
registre « nous vendons, notre installateur partenaire pose » : conseil, prise
de cotes, commande et fourniture d'un côté ; installation sous l'assurance
décennale du partenaire de l'autre.

Ne pas réintroduire de formulations du type « nous posons », « pose par nos
soins », « notre équipe installe », « atelier » ou « showroom » : elles
sortiraient du périmètre déclaré, et la pose de protections solaires sur bâti
relève de l'assurance décennale obligatoire (art. L241-1 du Code des
assurances). Si Patrick ajoute un jour l'activité de pose à son
immatriculation et souscrit une décennale, ces formulations redeviendront
exactes — pas avant.

L'adresse du siège est un domicile : elle ne figure que dans les mentions
légales, où la loi l'impose. Partout ailleurs le site n'affiche que la commune.
