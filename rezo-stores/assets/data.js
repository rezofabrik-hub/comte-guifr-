/* ===========================================================
   Rezo Stores — données du catalogue
   Arborescence et références reprises de la gamme du fabricant
   MecanoToldo (mecanotoldo.com), dont nous sommes revendeur-poseur.
   Les descriptions sont rédigées par nos soins.
   =========================================================== */

const SOCIETE = {
  nom:"Rezo Stores",
  baseline:"par RezoFabrik",
  tel:"04 68 00 00 00",
  telHref:"+33468000000",
  mail:"contact@rezofabrik.fr",
  adresse:["9 rue de la Close","ZA Las Bigues","66140 Canet-en-Roussillon"],
  horaires:["Lundi – vendredi : 8 h 30 – 12 h / 14 h – 18 h","Samedi : sur rendez-vous"],
  accroches:[
    "30 ans de savoir-faire derrière chaque store",
    "Une solution pour chaque projet",
    "Un store pour chaque nécessité",
    "Qualité et réactivité, notre manière de travailler"
  ]
};

/* Coloris de structure standard, communs à la plupart des gammes */
const RAL_STD = [
  ["Blanc RAL 9010","#F1EFE7"],
  ["Ivoire RAL 1013","#EAE6DA"],
  ["Gris anthracite RAL 7016","#383E42"],
  ["Noir RAL 9005","#1A1A1A"],
  ["Argent anodisé","#C7C9CA"],
  ["Bronze","#6B5847"],
  ["Brun RAL 8014","#4A3526"]
];

const CAT = {
  /* ------------------------------------------------ STORES */
  "stores":{
    label:"Stores bannes & coffres",
    court:"Stores",
    desc:"Protection solaire de terrasse, de façade et de baie vitrée : bannes traditionnelles, monoblocs, stores coffre, descentes verticales, abris et stores de véranda.",
    familles:[
      {slug:"coffre",nom:"Stores coffre",note:"Toile et bras intégralement protégés une fois le coffre fermé.",produits:[
        {ref:"5036",nom:"Coffre Conceptbox",
         pitch:"Notre référence sur les grandes terrasses : coffre intégral compact, bras à chaîne inox et canal d'éclairage LED intégré dans le bras.",
         specs:{
           "Dimensions maxi":"6,00 m de largeur × 3,50 m d'avancée",
           "Structure":"Profils et supports aluminium extrudé, visserie traitée",
           "Bras":"Bras à chaîne acier inox, canal LED intégré",
           "Pose":"Façade, plafond / sous-face ou sur structure",
           "Manœuvre":"Manivelle, ou moteur radio / filaire en option",
           "Classement CE":"Classe 2 (EN 13561) — résistance au vent jusqu'à 38 km/h"
         },
         checks:[
           "Toile et bras totalement protégés coffre fermé",
           "Compatible avec les principaux automatismes du marché",
           "Éclairage LED intégrable dans les bras",
           "Lambrequin enroulable disponible en option"
         ],
         couleurs:RAL_STD},
        {ref:"5026",nom:"Coffre Indie",pitch:"Coffre compact pensé pour les petites et moyennes largeurs, idéal en balcon ou sur une façade étroite.",
         specs:{"Dimensions maxi":"env. 4,50 m × 3,00 m","Bras":"Bras à chaîne","Pose":"Façade ou plafond","Manœuvre":"Manuelle ou motorisée"}},
        {ref:"5066",nom:"Coffre Kyma",pitch:"Coffre au profil arrondi, discret une fois replié, pour les façades classiques.",
         specs:{"Profil":"Coffre arrondi","Pose":"Façade ou plafond","Manœuvre":"Manuelle ou motorisée"}},
        {ref:"5076",nom:"Coffre Aland",pitch:"Ligne carrée contemporaine, dans l'esprit des façades en enduit clair et des maisons récentes.",
         specs:{"Profil":"Coffre carré","Pose":"Façade ou plafond","Manœuvre":"Manuelle ou motorisée"}},
        {ref:"5092",nom:"Coffre Arko",pitch:"Coffre de la gamme Arko, structure renforcée pour les expositions ventées.",
         specs:{"Gamme":"Arko","Pose":"Façade ou plafond","Manœuvre":"Manuelle ou motorisée"}}
      ]},
      {slug:"bannes",nom:"Bannes traditionnelles",note:"Le classique, bras articulés apparents, le meilleur rapport surface / prix.",produits:[
        {ref:"2026",nom:"Store banne Smart",pitch:"Banne traditionnelle à bras articulés : la solution la plus directe pour ombrer une grande terrasse.",
         specs:{"Type":"Bras articulés apparents","Pose":"Façade ou plafond","Manœuvre":"Manivelle ou moteur","Toile":"Acrylique teint masse ou polyester enduit"},
         checks:["Excellent rapport surface ombragée / budget","Grandes largeurs possibles","Toile remplaçable sans changer la structure"],
         couleurs:RAL_STD},
        {ref:"2036",nom:"Store banne Concept",pitch:"Version renforcée de la banne traditionnelle : bras et barre de charge plus robustes, pour les sites exposés.",
         specs:{"Type":"Bras articulés renforcés","Pose":"Façade ou plafond","Manœuvre":"Manivelle ou moteur"}}
      ]},
      {slug:"monobloc",nom:"Stores monobloc",note:"Bras et enrouleur montés sur une barre porteuse : pose rapide, alignement parfait.",produits:[
        {ref:"3046",nom:"Monobloc Concept",pitch:"Ensemble prémonté sur barre porteuse : moins de points de fixation, pose simplifiée sur façade fragile.",
         specs:{"Montage":"Sur barre porteuse","Pose":"Façade ou plafond","Manœuvre":"Manivelle ou moteur"}},
        {ref:"3092",nom:"Monobloc M1 Arko",pitch:"Monobloc de la gamme Arko, profil plus fin et finitions soignées.",
         specs:{"Gamme":"Arko","Montage":"Sur barre porteuse","Manœuvre":"Manivelle ou moteur"}}
      ]},
      {slug:"vertical",nom:"Stores à descente verticale",note:"Fenêtres, balcons, fermeture et coupe-vent de terrasse.",produits:[
        {ref:"1010",nom:"Store vertical",pitch:"Descente verticale simple, sans guidage : la solution économique pour ombrer une fenêtre."},
        {ref:"1013",nom:"Vertical avec guides",pitch:"Guidage latéral par câbles inox ou coulisses : la toile reste tendue même par vent modéré."},
        {ref:"1018",nom:"Vertical Nimbus",pitch:"Vertical à coffre : la toile est protégée lorsqu'elle est remontée."},
        {ref:"4003",nom:"Vertical Nexus 80",pitch:"Coffre 80 mm, pour les petites et moyennes hauteurs."},
        {ref:"4005",nom:"Vertical Nexus 100",pitch:"Coffre 100 mm, le compromis le plus courant en habitat."},
        {ref:"4006",nom:"Vertical Nexus 130",pitch:"Coffre 130 mm, conçu pour les grandes hauteurs et les baies de plusieurs mètres."},
        {ref:"4009",nom:"Vertical Igloo",pitch:"Guidage renforcé, adapté aux emplacements ventés comme le front de mer."},
        {ref:"4016",nom:"Vertical Paravento",pitch:"Coupe-vent de terrasse : ferme un côté de terrasse et prolonge l'usage à la mi-saison."}
      ]},
      {slug:"terrasse",nom:"Stores et abris de terrasse",note:"Structures autoportantes, toiles coulissantes et abris.",produits:[
        {ref:"6021",nom:"Structure pour stores",pitch:"Structure porteuse quand la façade ne peut pas reprendre les efforts d'un store."},
        {ref:"6036",nom:"Structure UVE",pitch:"Structure autoportante : ombre un espace détaché de la maison, îlot de terrasse ou coin repas."},
        {ref:"6050",nom:"Abri de terrasse Gemini",pitch:"Abri à double pente, couvre une grande surface avec évacuation de l'eau des deux côtés."},
        {ref:"7010",nom:"Coulissant",pitch:"Toile coulissante sur rails, repliage en accordéon."},
        {ref:"7010-15P",nom:"Coulissant Plus",pitch:"Version renforcée du coulissant, portées supérieures."},
        {ref:"7015",nom:"Store coulissant",pitch:"Coulissant à guidage renforcé pour les longues portées entre murs."}
      ]},
      {slug:"veranda",nom:"Stores de véranda",note:"Protection des toitures vitrées, où la chaleur s'accumule le plus vite.",produits:[
        {ref:"7030",nom:"Véranda",pitch:"Store de toiture pour véranda : abaisse nettement la température sous verre en été."},
        {ref:"7035-36",nom:"Véranda 7035 / 7036",pitch:"Version grandes portées, pour les vérandas et jardins d'hiver de grande surface."},
        {ref:"7046",nom:"Véranda avec piliers",pitch:"Store de véranda avec piliers de reprise, quand la structure existante ne suffit pas."}
      ]},
      {slug:"divers",nom:"Stores particuliers",note:"Les configurations qui ne rentrent dans aucune case.",produits:[
        {ref:"1017",nom:"Store latéral à tension",pitch:"Paravent latéral rétractable : intimité et coupe-vent entre deux terrasses."},
        {ref:"1020",nom:"Store de balcon",pitch:"Store à projection pour balcon, encombrement minimal."},
        {ref:"1031",nom:"Store à bras droits",pitch:"Bras droits, projection courte : ombre une fenêtre sans envahir la terrasse."},
        {ref:"4010",nom:"Bras droits à coffre",pitch:"Bras droits avec coffre de protection de la toile."},
        {ref:"7020",nom:"Store corbeille",pitch:"Store corbeille de devanture, pour les commerces et vitrines."}
      ]}
    ]
  },

  /* ------------------------------------------------ OUTDOOR */
  "outdoor":{
    label:"Pergolas, voiles & parasols",
    court:"Outdoor",
    desc:"Aménagement complet d'extérieur : pergolas bioclimatiques à lames orientables, structures aluminium ou bois, voiles d'ombrage et parasols professionnels.",
    familles:[
      {slug:"bio",nom:"Pergolas bioclimatiques",note:"Lames orientables : on dose l'ombre, la lumière et la ventilation, et on ferme sous la pluie.",produits:[
        {ref:"giro",nom:"Bioclimatique Giro",
         pitch:"Lames orientables motorisées et évacuation d'eau intégrée dans les poteaux : la pergola bioclimatique la plus polyvalente de la gamme.",
         specs:{
           "Lames":"Aluminium extrudé orientables, rotation motorisée",
           "Portée":"Modules jusqu'à environ 4 × 4 m, juxtaposables",
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
        {ref:"vision",nom:"Bioclimatique Vision",pitch:"Ligne épurée et poteaux affinés, pensée pour les architectures contemporaines et les grandes portées."},
        {ref:"opera",nom:"Bioclimatique Opera",pitch:"Version haut de gamme : finitions, intégration domotique et accessoires les plus complets."}
      ]},
      {slug:"alu",nom:"Pergolas aluminium",note:"Structure aluminium et toile tendue rétractable.",produits:[
        {ref:"level",nom:"Tecnic Level",pitch:"Pergola aluminium à toile tendue motorisée, profil plat et discret."},
        {ref:"phoenix",nom:"Tecnic Phoenix",pitch:"Pergola aluminium autoportante : s'implante n'importe où dans le jardin."}
      ]},
      {slug:"bois",nom:"Pergolas bois",note:"",produits:[
        {ref:"wood",nom:"Tecnic Wood",pitch:"Structure bois lamellé-collé et toile motorisée : la chaleur du bois avec une mécanique moderne."}
      ]},
      {slug:"entre",nom:"Pergolas entre structures",note:"Quand les appuis existent déjà.",produits:[
        {ref:"tecnic",nom:"Tecnic",pitch:"Toile tendue entre deux murs ou deux structures existantes, sans poteau supplémentaire."},
        {ref:"one",nom:"Tecnic One",pitch:"Version compacte pour les patios et les cours étroites."}
      ]},
      {slug:"voiles",nom:"Voiles d'ombrage",note:"",produits:[
        {ref:"cable",nom:"Voile sur câble",pitch:"Voile coulissante sur câble tendu : se replie à la main en quelques secondes."},
        {ref:"sangle",nom:"Voile sur sangle",pitch:"Voile coulissante sur sangle, esprit patio méditerranéen."}
      ]},
      {slug:"parasols",nom:"Parasols professionnels",note:"Usage CHR, hôtellerie et collectivités.",produits:[
        {ref:"s70",nom:"Parasol série 70",pitch:"Mât 70 mm, pour les terrasses de café et de restaurant."},
        {ref:"s90",nom:"Parasol série 90",pitch:"Mât 90 mm, grandes surfaces et exposition permanente."},
        {ref:"acc",nom:"Accessoires de parasol",pitch:"Socles, lestages, platines à sceller, housses de protection."}
      ]}
    ]
  },

  /* ------------------------------------------------ STORES ROULEURS */
  "stores-rouleurs":{
    label:"Stores enrouleurs intérieurs",
    court:"Stores rouleurs",
    desc:"Toiles screen et occultantes pour les bureaux, les commerces et l'habitat, avec ou sans coffre.",
    familles:[
      {slug:"nl",nom:"Enrouleurs NL",note:"",produits:[
        {ref:"nl43",nom:"Enrouleur NL43",pitch:"Tube 43 mm : petites et moyennes surfaces, fenêtres standard."},
        {ref:"nl58",nom:"Enrouleur NL58",pitch:"Tube 58 mm : grandes largeurs sans flèche visible."}
      ]},
      {slug:"df",nom:"Enrouleurs DF (double)",note:"Deux toiles sur un même support : screen le jour, occultant la nuit.",produits:[
        {ref:"df58",nom:"Enrouleur DF58",pitch:"Double store, tube 58 mm."},
        {ref:"df80",nom:"Enrouleur DF80",pitch:"Double store, tube 80 mm, grandes dimensions."}
      ]},
      {slug:"box",nom:"Enrouleurs à coffre",note:"",produits:[
        {ref:"box77",nom:"Enrouleur Box 77",pitch:"Coffre 77 mm, finition propre en pose apparente."},
        {ref:"box92",nom:"Enrouleur Box 92",pitch:"Coffre 92 mm, pour les toiles de grande hauteur."}
      ]},
      {slug:"tech",nom:"Toiles & guidage",note:"Documentation technique.",produits:[
        {ref:"guid",nom:"Systèmes de guidage",pitch:"Coulisses, câbles et guidage latéral : le choix dépend de l'exposition au vent."},
        {ref:"tissus",nom:"Caractéristiques des tissus",pitch:"Composition, classement au feu, entretien et garanties des toiles."},
        {ref:"ouv",nom:"Facteurs d'ouverture",pitch:"Choisir le screen selon l'orientation : 1 %, 3 %, 5 % ou 10 % d'ouverture."},
        {ref:"secu",nom:"Dispositif de sécurité",pitch:"Sécurité enfants obligatoire sur les commandes à chaînette."}
      ]}
    ]
  },

  /* ------------------------------------------------ MOTORISATION */
  "motorisation":{
    label:"Motorisation & domotique",
    court:"Motorisation",
    desc:"Moteurs radio, filaires et pilotage domotique de l'ensemble des protections solaires.",
    familles:[
      {slug:"moteurs",nom:"Systèmes de commande",note:"",produits:[
        {ref:"io",nom:"Systèmes io-homecontrol",pitch:"Radio bidirectionnelle avec retour d'information : le store confirme sa position.",
         checks:["Retour d'état du store à la commande","Compatible box domotique","Ajout de capteurs sans recâblage"]},
        {ref:"rts",nom:"Systèmes RTS",pitch:"Radio unidirectionnelle, la solution la plus répandue et la plus économique en rénovation."},
        {ref:"lt",nom:"Systèmes filaires LT / WT",pitch:"Moteurs filaires, à privilégier en construction neuve quand le câblage est prévu."},
        {ref:"smart",nom:"Smart Home",pitch:"Pilotage smartphone, scénarios horaires et capteurs vent / soleil."},
        {ref:"capteurs",nom:"Capteurs vent & soleil",pitch:"Le capteur vent replie le store automatiquement : c'est ce qui protège la toile en votre absence.",
         checks:["Repli automatique en cas de rafale","Déploiement automatique au soleil","Fortement recommandé sur les résidences secondaires"]}
      ]}
    ]
  },

  /* ------------------------------------------------ COMPLEMENTS */
  "complements":{
    label:"Compléments & accessoires",
    court:"Compléments",
    desc:"Tout ce qui se rajoute sur un store : lambrequin, éclairage, chauffage, capteurs et pièces de rechange.",
    familles:[
      {slug:"comp",nom:"Options & accessoires",note:"",produits:[
        {ref:"lamb-store",nom:"Lambrequin enroulable (store banne)",pitch:"Descente frontale rétractable : arrête le soleil rasant de fin de journée."},
        {ref:"lamb-coffre",nom:"Lambrequin enroulable (coffre)",pitch:"Descente frontale intégrée au coffre, invisible une fois remontée."},
        {ref:"led",nom:"Éclairage LED",pitch:"Bandeaux LED intégrés aux bras ou au coffre, gradables à la télécommande."},
        {ref:"chauffage",nom:"Chauffage de terrasse",pitch:"Radiants infrarouges fixés sous le coffre ou la pergola, pour prolonger les soirées."},
        {ref:"pieces",nom:"Pièces détachées & SAV",pitch:"Toile, moteur, bras, télécommande, manivelle : on remplace la pièce, pas le store entier."}
      ]}
    ]
  }
};

/* ------------------------------------------------ MARQUES */
const MARQUES = [
  {nom:"SOMFY",role:"Motorisation & domotique",txt:"Référence mondiale de l'automatisation des ouvertures depuis plus de quarante ans : moteurs RTS et io-homecontrol, capteurs et pilotage smartphone."},
  {nom:"GAVIOTA",role:"Stores & solutions extérieures",txt:"Gamme complète de stores bannes, coffres et protections solaires extérieures."},
  {nom:"GAVIOTA GLASS",role:"Verre & pergolas bioclimatiques",txt:"Clôtures et rideaux de verre, pergolas bioclimatiques à lames orientables."},
  {nom:"PRATIC",role:"Pergolas & stores outdoor",txt:"Fabricant italien de pergolas bioclimatiques et de stores d'extérieur haut de gamme."},
  {nom:"DURMI",role:"Lames orientables",txt:"Systèmes d'ouverture et de fermeture à lames orientables, pour la protection solaire et l'efficacité énergétique des bâtiments."},
  {nom:"PALMIYE",role:"Structures d'extérieur",txt:"Réseau international de structures et pergolas, avec un large choix de configurations architecturales."},
  {nom:"SIPLAN",role:"Pergolas & stores",txt:"Fabricant créé en 1993 : pergolas, stores à bras articulés, stores à coffre et stores intérieurs."},
  {nom:"SAULEDA",role:"Toiles",txt:"Fabricant de toiles de store depuis 1897 : acryliques teints masse, large nuancier, tenue des couleurs."},
  {nom:"DICKSON",role:"Toiles techniques",txt:"Référence mondiale du tissu technique outdoor, garanties longues sur la tenue à l'UV."}
];

/* ------------------------------------------------ RÉALISATIONS */
const REALISATIONS = [
  {commune:"Argelès-sur-Mer",titre:"Store coffre 5 m motorisé",txt:"Coffre Conceptbox, toile acrylique teint masse, moteur radio RTS et lambrequin enroulable."},
  {commune:"Perpignan",titre:"Pergola bioclimatique 4 × 3,5 m",txt:"Bioclimatique Giro adossée, lames orientables motorisées, éclairage LED périphérique."},
  {commune:"Canet-en-Roussillon",titre:"Stores verticaux de terrasse",txt:"Trois Vertical Nexus 100 en screen 5 %, guidage par câbles, commande centralisée."},
  {commune:"Saint-Cyprien",titre:"Banne traditionnelle 6 m",txt:"Store banne Smart sur façade en pierre, platines chimiques, manœuvre par manivelle."},
  {commune:"Céret",titre:"Store de véranda",txt:"Store de toiture 7030 sur véranda plein sud : plus de 10 °C d'écart mesuré sous verre."},
  {commune:"Collioure",titre:"Coupe-vent de terrasse",txt:"Vertical Paravento en front de mer, guidage renforcé et capteur vent."}
];

const ZONES = ["Perpignan","Canet-en-Roussillon","Saint-Cyprien","Argelès-sur-Mer","Collioure","Le Barcarès",
  "Rivesaltes","Thuir","Céret","Elne","Cabestany","Saint-Estève","Prades","Port-Vendres","Torreilles","Sainte-Marie-la-Mer"];
