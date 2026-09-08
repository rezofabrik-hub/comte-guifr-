/* ===========================================================
   Ombre et Lumière — Patrick Thais · Thuir (66)
   Données du catalogue.

   L'arborescence, les références et les caractéristiques
   techniques reprennent la gamme du fournisseur MecanoToldo
   (mecanotoldo.com), dont l'entreprise est revendeur-poseur.
   Les textes de présentation sont rédigés pour Ombre et Lumière.
   =========================================================== */

const SOCIETE = {
  nom:"Ombre et Lumière",
  baseline:"Patrick Thais · Thuir",
  gerant:"Patrick Thais",
  statut:"Auto-entrepreneur (entreprise individuelle)",
  tel:"06 62 18 14 01",
  telHref:"+33662181401",
  mail:"contact@ombre-et-lumiere.fr",
  adresse:["66300 Thuir","Pyrénées-Orientales"],
  horaires:[
    "Lundi – vendredi : 8 h 30 – 12 h / 14 h – 18 h",
    "Samedi : sur rendez-vous",
    "Métré à domicile sur toute la semaine"
  ]
};

/* Nuancier de structure du fournisseur.
   Teintes de base, livrées sans supplément sur la plupart des modèles. */
const RAL_BASE = [
  ["Blanc","#F1EFE7"],
  ["RAL 1013 ivoire","#E3D9C6"],
  ["RAL 7016 anthracite","#383E42"],
  ["RAL 7016 texturé","#3B4145"],
  ["Noir texturé","#14140F"],
  ["Argent texturé","#A9ABAC"],
  ["Bronze texturé","#6B5847"],
  ["RAL 8014 texturé","#4A3526"]
];
/* Teintes standard, disponibles sur commande. */
const RAL_STD = RAL_BASE.concat([
  ["RAL 3005 rouge vin","#59191F"],
  ["RAL 6009 vert sapin","#27352A"],
  ["RAL 7035 gris clair","#D2D3D1"],
  ["RAL 8017 brun chocolat","#442F29"],
  ["RAL 8019 brun gris","#3D3635"],
  ["RAL 7022 gris ombre","#4C4A43"],
  ["Inox","#C7C9CA"]
]);

/* Raccourcis de caractéristiques revenant sur toute la gamme */
const MOT_OPT  = "Manuelle, ou moteur IO, RTS ou LT en option";
const MOT_SEUL = "Motorisée uniquement — moteur IO, RTS ou LT";
const POSE_FP  = "Façade ou plafond";
const POSE_FPM = "Façade, plafond ou entre murs";

const CAT = {

  /* ══════════════════════════════════════════ STORES ══════════ */
  "stores":{
    label:"Stores bannes & coffres",
    court:"Stores",
    desc:"Le cœur du métier : 31 modèles de protection solaire extérieure, du store de balcon à l'abri de terrasse de 10 mètres. Bannes traditionnelles, monoblocs, stores coffre, descentes verticales, stores de terrasse et de véranda — toute la gamme, sans exception.",
    familles:[

      /* ---------------------------------------- coffres */
      {slug:"coffre",nom:"Stores coffre",note:"Toile et bras intégralement protégés une fois le coffre fermé — la solution qui vieillit le mieux.",produits:[
        {ref:"5036",nom:"Coffre Conceptbox",
         pitch:"Notre référence sur les grandes terrasses : coffre intégral compact, bras à chaîne acier inox et canal d'éclairage LED intégré dans le bras.",
         specs:{
           "Dimensions maxi":"6,00 m de largeur × 3,50 m d'avancée",
           "Bras":"Bras à chaîne acier inox, avec canal pour éclairage LED",
           "Structure":"Profils et supports aluminium, visserie Geomet",
           "Pose":POSE_FP,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — résistance au vent 38 km/h"
         },
         checks:[
           "Toile et bras totalement protégés coffre fermé",
           "Compatible avec tous les automatismes du marché",
           "Éclairage LED intégrable dans les bras",
           "Le meilleur compromis dimensions / protection de la gamme"
         ],
         couleurs:RAL_STD},

        {ref:"5026",nom:"Coffre Indie",
         pitch:"Coffre compact pour les petites et moyennes largeurs : balcon, fenêtre large, façade étroite.",
         specs:{
           "Dimensions maxi":"4,50 m × 2,50 m",
           "Bras":"Bras à chaîne acier inox",
           "Structure":"Supports aluminium, visserie Geomet",
           "Pose":POSE_FP,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Protection totale de la toile par le coffre","Encombrement réduit une fois replié"],
         couleurs:RAL_STD},

        {ref:"5066",nom:"Coffre Kyma",
         pitch:"Le plus large de la gamme coffre : jusqu'à 10 mètres en un seul store, avec canal LED dans les bras.",
         specs:{
           "Dimensions maxi":"10,00 m × 3,50 m",
           "Bras":"Bras à chaîne acier inox, avec canal LED",
           "Structure":"Profils et supports aluminium, visserie Geomet",
           "Pose":POSE_FP,
           "Manœuvre":"Moteur IO, RTS ou LT",
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Jusqu'à 10 m de largeur sans raccord","Couvre une terrasse entière en une seule toile","Éclairage LED intégré aux bras"],
         couleurs:RAL_STD},

        {ref:"5076",nom:"Coffre Aland",
         pitch:"Ligne carrée contemporaine, dans l'esprit des maisons récentes et des façades en enduit clair.",
         specs:{
           "Dimensions maxi":"6,00 m × 3,50 m",
           "Bras":"Bras à chaîne acier inox, avec canal LED",
           "Structure":"Supports aluminium, visserie Geomet 321, profils aluminium",
           "Pose":POSE_FP,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe I (EN 13561) — 28 km/h"
         },
         checks:["Coffre à profil carré, très discret replié","Canal LED dans le coffre et les bras"],
         couleurs:RAL_STD},

        {ref:"5092",nom:"Coffre Arko",
         pitch:"La plus grande avancée de la gamme coffre — 4 mètres — grâce aux bras Arko à sangle.",
         specs:{
           "Dimensions maxi":"6,00 m × 4,00 m",
           "Bras":"Bras Arko à sangle textile",
           "Structure":"Profils et supports aluminium, visserie Geomet 321",
           "Pose":POSE_FP,
           "Manœuvre":"Manuelle, ou moteur IO, RTS ou LT avec fermeture par pression",
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["4 m d'avancée : ombre une grande profondeur de terrasse","Canal LED prévu dans le profil du coffre"],
         couleurs:RAL_STD}
      ]},

      /* ---------------------------------------- bannes */
      {slug:"bannes",nom:"Bannes traditionnelles",note:"Le classique à bras articulés : le meilleur rapport surface ombragée / budget.",produits:[
        {ref:"2026",nom:"Store banne Smart",
         pitch:"Bras invisibles à chaîne inox et classement au vent Classe III : la banne la plus résistante de la gamme sur les formats courants.",
         specs:{
           "Dimensions maxi":"4,50 m × 2,50 m",
           "Bras":"Bras invisibles à chaîne acier inox",
           "Structure":"Supports aluminium, visserie Geomet 321, profil de charge aluminium",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:[
           "Classe III : le meilleur classement au vent de la gamme banne",
           "Bras invisibles, esthétique très épurée",
           "Pose possible entre deux murs",
           "Toile remplaçable sans changer la structure"
         ],
         couleurs:RAL_STD},

        {ref:"2036",nom:"Store banne Concept",
         pitch:"La grande banne : 6 mètres de large, ou 5 mètres avec 3,50 m d'avancée, bras à chaîne inox et canal LED.",
         specs:{
           "Dimensions maxi":"6,00 m × 3,00 m, ou 5,00 m × 3,50 m",
           "Bras":"Bras à chaîne acier inox, avec canal LED",
           "Structure":"Supports aluminium, visserie Geomet, profil porteur aluminium",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Deux configurations maxi selon la profondeur voulue","Éclairage LED intégrable dans les bras"],
         couleurs:RAL_STD}
      ]},

      /* ---------------------------------------- monobloc */
      {slug:"monobloc",nom:"Stores monobloc",note:"Bras et enrouleur prémontés sur une barre porteuse : pose rapide, alignement parfait, peu de points de fixation.",produits:[
        {ref:"3046",nom:"Monobloc Concept",
         pitch:"7 mètres de large sur une barre carrée 40 × 40 : la solution quand la façade ne peut pas recevoir de nombreux points de fixation.",
         specs:{
           "Dimensions maxi":"7,00 m × 3,50 m",
           "Barre porteuse":"Barre carrée fer 40 × 40 (aluminium en option)",
           "Bras":"Bras à chaîne acier inox, avec canal LED",
           "Structure":"Supports aluminium, visserie inox, profil porteur aluminium",
           "Pose":POSE_FP,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:[
           "Les efforts sont repris par la barre, pas par la façade",
           "Plusieurs points de fixation intégrés dans la barre carrée",
           "Idéal en rénovation sur mur fragile ou isolé par l'extérieur"
         ],
         couleurs:RAL_STD},

        {ref:"3092",nom:"Monobloc M1 Arko",
         pitch:"Le plus grand store de la gamme : 10 m × 4 m, conçu pour les terrasses de bars et de restaurants.",
         specs:{
           "Dimensions maxi":"10,00 m × 4,00 m",
           "Barre porteuse":"Barre carrée fer 50 × 50 × 3",
           "Bras":"Bras aluminium à sangle",
           "Structure":"Supports aluminium, visserie inox, profil porteur aluminium avec possibilité d'éclairage LED",
           "Pose":POSE_FP,
           "Manœuvre":MOT_SEUL,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:[
           "40 m² d'ombre en un seul store",
           "Pensé pour l'usage professionnel : CHR, hôtellerie",
           "Éclairage LED intégrable au profil porteur"
         ],
         couleurs:RAL_STD}
      ]},

      /* ---------------------------------------- vertical */
      {slug:"vertical",nom:"Stores à descente verticale",note:"Fenêtres, balcons, fermeture et coupe-vent de terrasse. Le guidage détermine la tenue au vent.",produits:[
        {ref:"1010",nom:"Store vertical 1010 / 1011",
         pitch:"Descente verticale simple à barre de charge : la solution la plus directe pour ombrer une fenêtre ou un balcon.",
         specs:{
           "Dimensions maxi":"5,00 m × 3,00 m",
           "Barre de charge":"Fer (modèle 1010) ou aluminium (modèle 1011)",
           "Fixation":"Mousquetons sur pattes rabattables",
           "Structure":"Supports aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Sans guidage latéral : à réserver aux emplacements abrités","Barre de charge fer ou aluminium au choix"],
         couleurs:RAL_STD},

        {ref:"1013",nom:"Vertical avec guides",
         pitch:"Guides aluminium 120 × 40 mm : la toile reste tendue et ne bat pas au premier coup de vent.",
         specs:{
           "Dimensions maxi":"5,00 m × 3,50 m",
           "Guidage":"Guides aluminium 120 × 40 mm",
           "Fixation":"Fixation par sangle",
           "Structure":"Supports aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["La plus grande hauteur de la famille : 3,50 m","Guidage latéral rigide, toile tendue en permanence"],
         couleurs:RAL_STD},

        {ref:"1018",nom:"Vertical Nimbus",
         pitch:"Vertical à guidage par câble 3 mm ou tige 10 mm, avec coffre de protection de la toile.",
         specs:{
           "Dimensions maxi":"5,00 m × 3,00 m",
           "Guidage":"Câble Ø 3 mm, ou tiges Ø 10 mm fixées par vis papillon",
           "Structure":"Supports en aluminium extrudé, visserie Geomet",
           "Pose":POSE_FP,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Deux types de guidage au choix selon l'exposition","Toile protégée lorsqu'elle est remontée"],
         couleurs:RAL_STD},

        {ref:"4003",nom:"Vertical Nexus 80",
         pitch:"Guidage ZIP à crémaillère et classement Classe III : la toile reste plaquée dans les coulisses, sans jour latéral.",
         specs:{
           "Dimensions maxi":"2,00 m × 2,00 m",
           "Guidage":"Système ZIP à crémaillère",
           "Protection toile":"Semi-coffre",
           "Structure":"Structure aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_SEUL,
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:["Guidage ZIP : aucun jour entre la toile et la coulisse","Classe III, adapté aux façades exposées","Format compact, pour fenêtre ou petite baie"],
         couleurs:RAL_STD},

        {ref:"4005",nom:"Vertical Nexus 100",
         pitch:"Le format le plus courant en habitat : 4 m de large en guidage ZIP, motorisé.",
         specs:{
           "Dimensions maxi":"4,00 m × 3,00 m",
           "Guidage":"Système ZIP à crémaillère",
           "Protection toile":"Semi-coffre",
           "Structure":"Structure aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_SEUL,
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:["Ferme un côté de terrasse sans jour latéral","Classe III : tient à la tramontane établie"],
         couleurs:RAL_STD},

        {ref:"4006",nom:"Vertical Nexus 130",
         pitch:"Le grand format ZIP : 5 mètres de large, pour les baies vitrées et les terrasses à fermer entièrement.",
         specs:{
           "Dimensions maxi":"5,00 m × 3,00 m",
           "Guidage":"Système ZIP à crémaillère",
           "Protection toile":"Semi-coffre",
           "Structure":"Structure aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_SEUL,
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:["5 m en une seule toile, sans montant intermédiaire","Guidage ZIP, Classe III"],
         couleurs:RAL_STD},

        {ref:"4009",nom:"Vertical Igloo",
         pitch:"Guidage par tiges de 10 mm dans les coulisses et éclairage LED possible sur les coulisses.",
         specs:{
           "Dimensions maxi":"5,00 m × 3,00 m",
           "Guidage":"Tiges Ø 10 mm dans les coulisses",
           "Protection toile":"Semi-coffre",
           "Structure":"Structure aluminium, visserie Geomet",
           "Pose":"Façade ou entre murs",
           "Manœuvre":MOT_SEUL,
           "Options":"Éclairage LED sur les coulisses",
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:["Éclairage LED intégrable dans les coulisses","Classe III","À ne pas piloter par automatisme vent"],
         couleurs:RAL_STD},

        {ref:"4016",nom:"Vertical Paravento",
         pitch:"Le coupe-vent de terrasse : ferme un côté exposé et prolonge l'usage de la terrasse à la mi-saison.",
         specs:{
           "Dimensions maxi":"5,00 m × 3,00 m",
           "Guidage":"Guides aluminium 120 × 40 mm",
           "Fixation":"Fixation par sangle",
           "Structure":"Structure en aluminium extrudé, supports aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Conçu pour couper le vent, pas seulement le soleil","Manœuvre manuelle possible, contrairement aux Nexus"],
         couleurs:RAL_STD}
      ]},

      /* ---------------------------------------- terrasse */
      {slug:"terrasse",nom:"Stores et abris de terrasse",note:"Structures autoportantes, toiles coulissantes et abris : quand la façade ne peut rien reprendre, ou qu'il n'y a pas de façade du tout.",produits:[
        {ref:"6021",nom:"Structure pour stores",
         pitch:"Structure fer 80 × 80 fabriquée à la cote, sur laquelle vient se poser n'importe quel store de la gamme.",
         specs:{
           "Structure":"Fer 80 × 80, réalisée selon les mesures du chantier",
           "Visserie":"Acier inoxydable",
           "Embases":"Carrée, rectangulaire, à sceller ou jardinière",
           "Compatibilité":"Tous les stores de la gamme",
           "Options":"Auvent de protection",
           "Finition":"Toutes teintes RAL"
         },
         checks:[
           "Couvre de grandes surfaces en une seule pièce",
           "Quatre types d'embases selon le sol",
           "La réponse aux façades qui ne peuvent pas reprendre les efforts"
         ],
         couleurs:RAL_STD},

        {ref:"6036",nom:"Structure UVE",
         pitch:"Structure autoportante en U : ombre un espace détaché de la maison, îlot de terrasse ou coin repas.",
         specs:{
           "Type":"Structure autoportante en U",
           "Marquage":"CE",
           "Finition":"Teintes de base et teintes standard"
         },
         checks:["Ne s'appuie sur aucun mur","Se pose au milieu d'un jardin ou d'une cour"],
         couleurs:RAL_STD},

        {ref:"6050",nom:"Abri de terrasse Gemini",
         pitch:"Abri à double pente sur pieds : couvre une grande surface avec évacuation de l'eau des deux côtés.",
         specs:{
           "Dimensions maxi":"6,00 × 3,50 × 3,50 m",
           "Bras":"Bras à chaîne acier inox, avec canal LED",
           "Structure":"Profils et supports aluminium, visserie Geomet",
           "Pose":"Sur pieds",
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Double pente : l'eau part des deux côtés","Protection totale par coffre","Éclairage LED intégrable"],
         couleurs:RAL_STD},

        {ref:"7010",nom:"Coulissant",
         pitch:"Toile coulissante sur rails, repliage en accordéon : elle s'ouvre et se ferme en quelques secondes.",
         specs:{
           "Dimensions maxi":"Module de 5,50 × 5,50 m",
           "Structure":"Profils en aluminium extrudé, supports aluminium",
           "Visserie":"Acier inoxydable",
           "Manœuvre":"Manuelle par cordes, moteur IO, RTS ou LT en option",
           "Pose":"Mur à mur, mur à piliers ou pilier à pilier",
           "Classement CE":"Pas de classification EN 13561"
         },
         checks:["Se replie complètement, la terrasse redevient ouverte","Trois configurations de pose","S'adapte à une pergola ou un patio existant"],
         couleurs:RAL_STD},

        {ref:"7010-15P",nom:"Coulissant Plus",
         pitch:"La version grande portée du coulissant : jusqu'à 7 × 7 mètres par module.",
         specs:{
           "Dimensions maxi":"Module de 7,00 × 7,00 m",
           "Structure":"Profils en aluminium extrudé, supports aluminium",
           "Visserie":"Acier inoxydable",
           "Manœuvre":"Manuelle par cordes"
         },
         checks:["49 m² couverts par module","Patios et cours intérieures de grande dimension"],
         couleurs:RAL_STD},

        {ref:"7015",nom:"Store coulissant",
         pitch:"Coulissant à guidage renforcé pour les longues portées entre murs.",
         specs:{
           "Dimensions maxi":"Module de 5,50 × 5,50 m",
           "Structure":"Profils en aluminium extrudé, supports aluminium",
           "Visserie":"Acier inoxydable",
           "Manœuvre":"Manuelle par cordes",
           "Classement CE":"Pas de classification EN 13561"
         },
         checks:["Guidage renforcé pour les longues portées entre murs","Manœuvre par cordes, sans motorisation"],
         couleurs:RAL_STD}
      ]},

      /* ---------------------------------------- véranda */
      {slug:"veranda",nom:"Stores de véranda",note:"Protection des toitures vitrées, là où la chaleur s'accumule le plus vite.",produits:[
        {ref:"7030",nom:"Véranda 7030",
         pitch:"Store de toiture compact pour verrière : c'est le seul moyen efficace de faire baisser la température sous verre.",
         specs:{
           "Dimensions maxi":"4,50 × 4,25 m",
           "Structure":"Profils aluminium",
           "Visserie":"Acier inoxydable",
           "Tension":"Tension de la toile par cordes",
           "Pose":"Sur structure",
           "Manœuvre":MOT_SEUL,
           "Classement CE":"Pas de classification EN 13561"
         },
         checks:["Se pose au-dessus du vitrage, là où la chaleur est arrêtée","Système compact pour couverture horizontale"],
         couleurs:RAL_STD},

        {ref:"7035-36",nom:"Véranda 7035 / 7036",
         pitch:"Tension par guides à piston et semi-coffre, en deux formats : 4 × 3 m ou 5,50 × 5 m.",
         specs:{
           "Dimensions maxi":"7035 : 4,00 × 3,00 m — 7036 : 5,50 × 5,00 m",
           "Structure":"Aluminium extrudé, supports aluminium",
           "Visserie":"Acier inoxydable",
           "Tension":"Système de tension par guides avec piston",
           "Protection toile":"Semi-coffre",
           "Manœuvre":MOT_SEUL,
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:["Classe III : tient sur une toiture exposée","La tension par piston évite la poche d'eau","Deux formats selon la surface vitrée"],
         couleurs:RAL_STD},

        {ref:"7046",nom:"Véranda avec piliers",
         pitch:"Version avec piliers de reprise, quand la structure existante ne peut pas porter le store.",
         specs:{
           "Dimensions maxi":"5,50 × 5,00 m",
           "Structure":"Aluminium extrudé, supports aluminium",
           "Visserie":"Acier inoxydable",
           "Tension":"Système de tension par guides avec piston",
           "Protection toile":"Semi-coffre",
           "Fixation":"Fixation du profil avec freins",
           "Manœuvre":MOT_SEUL,
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:["Les piliers reprennent la charge à la place de la véranda","Classe III"],
         couleurs:RAL_STD}
      ]},

      /* ---------------------------------------- divers */
      {slug:"divers",nom:"Stores particuliers",note:"Les configurations qui ne rentrent dans aucune case : latéral, balcon, bras droits, devanture.",produits:[
        {ref:"1017",nom:"Store latéral à tension",
         pitch:"Paravent latéral rétractable : intimité entre deux terrasses, et coupe-vent sur le côté exposé.",
         specs:{
           "Dimensions maxi":"2,20 × 4,00 m (toile Soltis 92)",
           "Structure":"Aluminium, visserie acier inoxydable",
           "Protection toile":"Semi-coffre",
           "Tension":"Tension manuelle de la toile",
           "Pose":"Fixation sur colonne",
           "Classement CE":"Classe I (EN 13561) — 28 km/h"
         },
         checks:["Se déroule à la demande, se range contre le mur","Intimité vis-à-vis du voisin sans construire"],
         couleurs:RAL_STD},

        {ref:"1020",nom:"Store de balcon",
         pitch:"Double fixation : il fonctionne soit en store à projection de 50 cm, soit en descente verticale.",
         specs:{
           "Dimensions maxi":"5,00 m × 3,00 m",
           "Bras":"Bras aluminium à tension",
           "Fonctionnement":"Mode store (projection 50 cm) ou mode vertical",
           "Structure":"Structure aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Deux usages avec un seul store","Encombrement minimal sur un balcon étroit"],
         couleurs:RAL_STD},

        {ref:"1031",nom:"Store à bras droits",
         pitch:"Bras droits à tension, ouverture 145° : intimité et protection par la fermeture perpendiculaire des bras.",
         specs:{
           "Dimensions maxi":"5,00 × 1,40 m",
           "Bras":"Bras aluminium avec système de tension",
           "Ouverture":"145° de série, 175° en option",
           "Structure":"Structure aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe II (EN 13561) — 38 km/h"
         },
         checks:["Ombre une fenêtre sans envahir la terrasse","Ouverture 175° en option, pour une protection presque verticale"],
         couleurs:RAL_STD},

        {ref:"4010",nom:"Bras droits à coffre",
         pitch:"Le bras droits classique, avec semi-coffre de protection de la toile et classement Classe III.",
         specs:{
           "Dimensions maxi":"4,00 × 1,40 m",
           "Bras":"Bras aluminium",
           "Ouverture":"145° de série, 175° en option",
           "Protection toile":"Semi-coffre",
           "Structure":"Structure aluminium, visserie Geomet",
           "Pose":POSE_FPM,
           "Manœuvre":MOT_OPT,
           "Classement CE":"Classe III (EN 13561) — 49 km/h"
         },
         checks:["Classe III : le plus résistant des bras droits","Toile protégée par le semi-coffre"],
         couleurs:RAL_STD},

        {ref:"7020",nom:"Stores corbeilles",
         pitch:"Le store corbeille de devanture : autant un élément de protection qu'un objet de décoration, pour un commerce ou une maison de village.",
         specs:{
           "Versions":"Aluminium repliable, aluminium fixe, ou modèle Noya-Oliva fixe",
           "Structure":"Profils aluminium",
           "Visserie":"Acier inoxydable",
           "Manœuvre":"Poulies et manivelle, motorisation en option",
           "Pose":"Mur, plafond ou entre murs ; modèles fixes en fer disponibles",
           "Coloris":"Blanc"
         },
         checks:["Repliable ou fixe selon l'usage","Idéal en devanture de commerce et en centre ancien"]}
      ]}
    ]
  },

  /* ══════════════════════════════════════════ OUTDOOR ═════════ */
  "outdoor":{
    label:"Pergolas, voiles & parasols",
    court:"Outdoor",
    desc:"Aménagement complet d'extérieur : pergolas bioclimatiques à lames orientables, structures aluminium ou bois, voiles d'ombre et parasols professionnels.",
    familles:[
      {slug:"bio",nom:"Pergolas bioclimatiques",note:"Lames orientables : on dose l'ombre, la lumière et la ventilation, et on ferme sous la pluie.",produits:[
        {ref:"giro",nom:"Pergola bioclimatique Giro",
         pitch:"Lames orientables motorisées et évacuation d'eau intégrée dans les poteaux : la bioclimatique la plus polyvalente de la gamme.",
         specs:{
           "Lames":"Aluminium extrudé orientables, rotation motorisée",
           "Eau":"Chéneaux périphériques, descente intégrée dans les poteaux",
           "Options":"Éclairage LED, stores verticaux latéraux, capteur de pluie",
           "Pose":"Adossée à la façade ou autoportante"
         },
         checks:[
           "Ombre réglable en continu, du plein soleil à la fermeture totale",
           "Ventilation naturelle : la terrasse ne devient pas une serre",
           "Fermeture automatique possible au capteur de pluie",
           "Modules juxtaposables pour couvrir de grandes surfaces"
         ],
         couleurs:RAL_STD},
        {ref:"vision",nom:"Pergola bioclimatique Vision",pitch:"Ligne épurée et poteaux affinés, pensée pour les architectures contemporaines et les grandes portées."},
        {ref:"opera",nom:"Pergola bioclimatique Opera",pitch:"Version haut de gamme : finitions, intégration domotique et accessoires les plus complets."}
      ]},
      {slug:"alu",nom:"Pergolas en aluminium",note:"Structure aluminium et toile tendue rétractable.",produits:[
        {ref:"level",nom:"Tecnic Level",pitch:"Pergola aluminium à toile tendue motorisée, profil plat et discret."},
        {ref:"phoenix",nom:"Tecnic Phoenix",pitch:"Pergola aluminium autoportante : s'implante n'importe où dans le jardin."}
      ]},
      {slug:"bois",nom:"Pergolas en bois",note:"",produits:[
        {ref:"wood",nom:"Tecnic Wood",pitch:"Structure bois et toile motorisée : la chaleur du bois avec une mécanique moderne."}
      ]},
      {slug:"entre",nom:"Pergolas entre structures",note:"Quand les appuis existent déjà.",produits:[
        {ref:"tecnic",nom:"Tecnic",pitch:"Toile tendue entre deux murs ou deux structures existantes, sans poteau supplémentaire."},
        {ref:"one",nom:"Tecnic One",pitch:"Version compacte pour les patios et les cours étroites."}
      ]},
      {slug:"voiles",nom:"Voiles d'ombre",note:"",produits:[
        {ref:"voile-cable",nom:"Voile avec câble",pitch:"Voile coulissante sur câble tendu : se replie à la main en quelques secondes."},
        {ref:"voile-sangle",nom:"Voile avec sangle",pitch:"Voile coulissante sur sangle, esprit patio méditerranéen."}
      ]},
      {slug:"parasols",nom:"Parasols",note:"Usage professionnel : cafés, restaurants, hôtellerie et collectivités.",produits:[
        {ref:"parasol-70",nom:"Parasols série 70",pitch:"Mât 70 mm, pour les terrasses de café et de restaurant."},
        {ref:"parasol-90",nom:"Parasols série 90",pitch:"Mât 90 mm, grandes surfaces et exposition permanente."},
        {ref:"parasol-acc",nom:"Accessoires de parasol",pitch:"Socles, lestages, platines à sceller, housses de protection."}
      ]}
    ]
  },

  /* ══════════════════════════════════════════ STORES ROULEURS ═ */
  "stores-rouleurs":{
    label:"Stores enrouleurs intérieurs",
    court:"Stores rouleurs",
    desc:"Toiles screen et occultantes pour l'habitat, les bureaux et les commerces, avec ou sans coffre.",
    familles:[
      {slug:"nl",nom:"Enroulables NL",note:"",produits:[
        {ref:"nl43",nom:"Store enrouleur NL43",pitch:"Tube 43 mm : petites et moyennes surfaces, fenêtres standard."},
        {ref:"nl58",nom:"Store enrouleur NL58",pitch:"Tube 58 mm : grandes largeurs, sans flèche visible sur le tube."}
      ]},
      {slug:"df",nom:"Enroulables DF",note:"Deux toiles sur un même support : screen le jour, occultant la nuit.",produits:[
        {ref:"df58",nom:"Store enrouleur DF58",pitch:"Double store, tube 58 mm."},
        {ref:"df80",nom:"Store enrouleur DF80",pitch:"Double store, tube 80 mm, grandes dimensions."}
      ]},
      {slug:"box",nom:"Enroulables avec coffre",note:"",produits:[
        {ref:"box77",nom:"Store enrouleur BOX77",pitch:"Coffre 77 mm, finition propre en pose apparente."},
        {ref:"box92",nom:"Store enrouleur BOX92",pitch:"Coffre 92 mm, pour les toiles de grande hauteur."}
      ]},
      {slug:"tech",nom:"Caractéristiques des rouleaux",note:"Documentation technique.",produits:[
        {ref:"guidage",nom:"Systèmes de guidage",pitch:"Coulisses, câbles et guidage latéral : le choix dépend de l'exposition au vent."},
        {ref:"tissus",nom:"Caractéristiques des tissus",pitch:"Composition, classement au feu, entretien et garanties des toiles."},
        {ref:"ouverture",nom:"Facteurs d'ouverture",pitch:"Choisir le screen selon l'orientation : 1 %, 3 %, 5 % ou 10 % d'ouverture."}
      ]},
      {slug:"secu",nom:"Dispositif de sécurité",note:"",produits:[
        {ref:"securite",nom:"Dispositif de sécurité",pitch:"Sécurité enfants sur les commandes à chaînette, obligatoire en France."}
      ]}
    ]
  },

  /* ══════════════════════════════════════════ MOTORISATION ════ */
  "motorisation":{
    label:"Motorisation & domotique",
    court:"Motorisation",
    desc:"Moteurs radio, moteurs filaires et pilotage domotique de l'ensemble des protections solaires.",
    familles:[
      {slug:"io",nom:"io-homecontrol",note:"",produits:[
        {ref:"systemes-io",nom:"Systèmes IO",
         pitch:"Radio bidirectionnelle avec retour d'information : le store confirme sa position à la commande.",
         checks:["Retour d'état du store","Compatible box domotique","Ajout de capteurs sans recâblage"]}
      ]},
      {slug:"rts",nom:"RTS",note:"",produits:[
        {ref:"systemes-rts",nom:"Systèmes RTS",pitch:"Radio unidirectionnelle : la solution la plus répandue et la plus économique en rénovation."}
      ]},
      {slug:"cable",nom:"Par câble",note:"",produits:[
        {ref:"systemes-lt-wt",nom:"Systèmes LT-WT",pitch:"Moteurs filaires, à privilégier en construction neuve quand le câblage est prévu."}
      ]},
      {slug:"smart",nom:"Smart Home",note:"",produits:[
        {ref:"smart-home",nom:"Smart Home",
         pitch:"Pilotage smartphone, scénarios horaires et capteurs vent / soleil.",
         checks:["Le capteur vent replie le store automatiquement en votre absence","Scénarios horaires et déclenchement au soleil","Fortement recommandé sur une résidence secondaire"]}
      ]}
    ]
  },

  /* ══════════════════════════════════════════ COMPLEMENTS ═════ */
  "complements":{
    label:"Compléments & accessoires",
    court:"Compléments",
    desc:"Tout ce qui se rajoute sur un store : lambrequin, éclairage LED et auvent de protection.",
    familles:[
      {slug:"lambrequin",nom:"Lambrequin enroulable",note:"La descente frontale qui arrête le soleil rasant de fin de journée.",produits:[
        {ref:"lambrequin-store",nom:"Lambrequin enroulable store",pitch:"Descente frontale rétractable montée sur une banne ou un monobloc."},
        {ref:"lambrequin-coffre",nom:"Lambrequin enroulable coffre",pitch:"Descente frontale intégrée au coffre, invisible une fois remontée."}
      ]},
      {slug:"led",nom:"Illumination LED",note:"",produits:[
        {ref:"illumination-led",nom:"Illumination LED",pitch:"Bandeaux LED intégrés dans le canal des bras, gradables à la télécommande."},
        {ref:"box-led",nom:"BOX LED",pitch:"Éclairage LED intégré au profil du coffre."}
      ]},
      {slug:"lambrequin-led",nom:"Lambrequin LED",note:"",produits:[
        {ref:"lambrequin-led",nom:"Lambrequin LED",pitch:"Lambrequin équipé d'un éclairage LED : coupe le soleil rasant et éclaire la terrasse."}
      ]},
      {slug:"auvent",nom:"Auvent de protection",note:"Une casquette au-dessus du store : la toile ne prend plus la pluie quand elle est repliée.",produits:[
        {ref:"auvent-store",nom:"Auvent de protection store",pitch:"Auvent monté au-dessus d'une banne ou d'un monobloc sans coffre."},
        {ref:"auvent-coulissant",nom:"Auvent de protection coulissant",pitch:"Auvent adapté aux stores coulissants de terrasse."}
      ]}
    ]
  }
};

/* ══════════════════════════════════════════ MARQUES ═══════════ */
const MARQUES = [
  {nom:"SOMFY",role:"Motorisation & domotique",txt:"Référence mondiale de l'automatisation des ouvertures depuis plus de quarante ans : moteurs RTS et io-homecontrol, capteurs vent et soleil, pilotage smartphone."},
  {nom:"GAVIOTA",role:"Stores & solutions extérieures",txt:"Gamme complète de stores bannes, coffres et protections solaires extérieures."},
  {nom:"GAVIOTA GLASS",role:"Verre & pergolas bioclimatiques",txt:"Rideaux et clôtures de verre, pergolas bioclimatiques à lames orientables."},
  {nom:"PRATIC",role:"Pergolas & stores outdoor",txt:"Fabricant italien de pergolas bioclimatiques et de stores d'extérieur haut de gamme."},
  {nom:"DURMI",role:"Lames orientables",txt:"Systèmes d'ouverture et de fermeture à lames orientables, pour la protection solaire et l'efficacité énergétique des bâtiments."},
  {nom:"PALMIYE",role:"Structures d'extérieur",txt:"Réseau international de structures et de pergolas, avec un large choix de configurations architecturales."},
  {nom:"SIPLAN",role:"Pergolas & stores",txt:"Fabricant créé en 1993 : pergolas, stores à bras articulés, stores à coffre et stores intérieurs."},
  {nom:"SAULEDA",role:"Toiles",txt:"Fabricant de toiles de store depuis 1897 : acryliques teints masse, large nuancier, tenue des couleurs dans le temps."},
  {nom:"DICKSON",role:"Toiles techniques",txt:"Référence mondiale du tissu technique outdoor, garanties longues sur la tenue aux UV."}
];

/* ══════════════════════════════════════════ GALERIE ═══════════ */
/* Photos du fabricant, présentées comme exemples d'installations des
   modèles que nous posons — et non comme nos propres chantiers.
   Chaque vignette renvoie vers la fiche du modèle concerné. */
const GALERIE = [
  {ref:"giro",     legende:"Pergola bioclimatique à lames orientables, en version autoportante au bord d'une terrasse."},
  {ref:"5036",     legende:"Store coffre sur façade : la toile et les bras disparaissent entièrement une fois repliés."},
  {ref:"4005",     legende:"Descente verticale à guidage ZIP : la toile reste plaquée dans les coulisses, sans jour latéral."},
  {ref:"5066",     legende:"Store coffre grande largeur, jusqu'à 10 mètres en une seule toile."},
  {ref:"6050",     legende:"Abri de terrasse à double pente monté sur pieds, avec évacuation d'eau des deux côtés."},
  {ref:"2026",     legende:"Banne traditionnelle à bras invisibles, classée III au vent."},
  {ref:"wood",     legende:"Pergola à structure bois et toile motorisée."},
  {ref:"7010",     legende:"Toile coulissante sur rails, repliée en accordéon au-dessus d'un patio."},
  {ref:"3092",     legende:"Monobloc sur barre porteuse : la façade ne reprend aucun effort. Terrasse de restaurant."},
  {ref:"7030",     legende:"Store de toiture posé sur une verrière, là où la chaleur s'accumule le plus vite."},
  {ref:"vision",   legende:"Pergola bioclimatique à poteaux affinés, sur une architecture contemporaine."},
  {ref:"4016",     legende:"Coupe-vent de terrasse à guides aluminium, pour prolonger l'usage à la mi-saison."},
  {ref:"5076",     legende:"Store coffre à profil carré, dans l'esprit des façades en enduit clair."},
  {ref:"1017",     legende:"Paravent latéral rétractable : intimité et coupe-vent entre deux terrasses."},
  {ref:"tecnic",   legende:"Toile tendue entre deux structures existantes, sans poteau supplémentaire."},
  {ref:"7020",     legende:"Store corbeille de devanture, autant décoratif que protecteur."},
  {ref:"illumination-led", legende:"Éclairage LED intégré dans le canal des bras, gradable à la télécommande."},
  {ref:"nl58",     legende:"Store enrouleur intérieur à tube 58 mm, toile screen."}
];

/* ══════════════════════════════════════════ ZONE ══════════════ */
const ZONES = ["Thuir","Perpignan","Céret","Ille-sur-Têt","Millas","Le Boulou","Elne","Cabestany",
  "Saint-Estève","Canet-en-Roussillon","Argelès-sur-Mer","Saint-Cyprien","Rivesaltes","Prades",
  "Trouillas","Corneilla-la-Rivière","Bages","Vinça","Collioure","Le Barcarès"];
