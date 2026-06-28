/**
 * FIREBASE CONFIGURATION - Temple Virtuel / Configurateur Comte Guifré
 *
 * Ce fichier centralise toute la configuration Firebase et ses services
 * Peut être utilisé côté client et serveur
 */

// ============================================================================
// 1. CONFIGURATION PRINCIPALE
// ============================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyA4IGmEv_bPt4Q5dnxjT2FIySP3JvAhQ20",
  authDomain: "site-cg51.firebaseapp.com",
  projectId: "site-cg51",
  storageBucket: "site-cg51.firebasestorage.app",
  messagingSenderId: "532992433947",
  appId: "1:532992433947:web:0ad401c53e6feeb0663dbe",
  measurementId: "G-XXXXXXXXXX" // À remplir
};

// ============================================================================
// 2. COLLECTIONS FIRESTORE
// ============================================================================

export const FIRESTORE_COLLECTIONS = {
  // Temple Virtuel - Structure générale
  ARTIFACTS: "artifacts",

  // Collections sous /artifacts/{appId}/public/data/
  MEMBERS: "members",           // Tableau de loge
  AGENDA: "agenda",             // Ordre des travaux
  PLANCHES: "planches",         // Documents maçonniques
  BIBLIOTHEQUE: "bibliotheque",  // Ressources
  LIENS: "liens",               // Liens utiles
  SETTINGS: "settings",         // Configuration app

  // Configurateur de lettrages
  CONFIGURATOR: "configurator",
  MATERIAUX: "materiaux",       // Matières disponibles
  FINITIONS: "finitions",       // Options de finitions
  COMMANDES: "commandes",       // Commandes clients
};

// ============================================================================
// 3. CHEMINS COMPLETS
// ============================================================================

export const FIRESTORE_PATHS = {
  // App ID
  APP_ID: "site-cg51",

  // Chemins principaux
  getArtifactsPath: () => "artifacts",
  getPublicDataPath: (appId) => `artifacts/${appId}/public/data`,

  // Members
  getMembersPath: (appId) => `artifacts/${appId}/public/data/members`,
  getMemberPath: (appId, memberId) => `artifacts/${appId}/public/data/members/${memberId}`,

  // Agenda
  getAgendaPath: (appId) => `artifacts/${appId}/public/data/agenda`,
  getAgendaItemPath: (appId, itemId) => `artifacts/${appId}/public/data/agenda/${itemId}`,

  // Planches
  getPlanchesPath: (appId) => `artifacts/${appId}/public/data/planches`,

  // Bibliotheque
  getBibliothequeePath: (appId) => `artifacts/${appId}/public/data/bibliotheque`,

  // Liens
  getLiensPath: (appId) => `artifacts/${appId}/public/data/liens`,

  // Settings
  getSettingsPath: (appId) => `artifacts/${appId}/public/data/settings`,

  // CONFIGURATEUR PATHS
  // Matériaux disponibles
  getMatériauxPath: () => "configurator/materiaux",
  getMatériauPath: (materiauxId) => `configurator/materiaux/${materiauxId}`,

  // Finitions disponibles
  getFinitionsPath: () => "configurator/finitions",
  getFinitionPath: (finitionId) => `configurator/finitions/${finitionId}`,

  // Commandes par utilisateur
  getCommandesPath: (userId) => `configurator/commandes/${userId}`,
  getCommandePath: (userId, commandeId) => `configurator/commandes/${userId}/${commandeId}`,

  // Settings du configurateur
  getConfiguratorSettingsPath: () => "configurator/settings",
};

// ============================================================================
// 4. COMPTES UTILISATEURS & PERMISSIONS
// ============================================================================

export const USERS_CONFIG = {
  // Apprenti (1er degré)
  APPRENTI: {
    email: "apprenti@cg51-virtuel.fr",
    role: "Apprenti",
    visibility: "Apprenti",
    permissions: {
      read: ["members", "agenda", "planches", "bibliotheque", "liens", "commandes"],
      write: ["planches", "commandes"],
      admin: false
    }
  },

  // Compagnon (2nd degré)
  COMPAGNON: {
    email: "compagnon@cg51-virtuel.fr",
    role: "Compagnon",
    visibility: "Compagnon",
    permissions: {
      read: ["members", "agenda", "planches", "bibliotheque", "liens", "commandes"],
      write: ["planches", "commandes"],
      admin: false
    }
  },

  // Maître (3rd degré)
  MAITRE: {
    email: "maitre@cg51-virtuel.fr",
    role: "Maître",
    visibility: "Maître",
    permissions: {
      read: ["members", "agenda", "planches", "bibliotheque", "liens", "commandes"],
      write: ["members", "agenda", "planches", "bibliotheque", "liens", "commandes"],
      admin: false
    }
  },

  // Architecte du Temple (Admin complet)
  ARCHITECTE: {
    email: "architecte@cg51-virtuel.fr",
    role: "Architecte",
    visibility: "Architecte",
    permissions: {
      read: ["all"],
      write: ["all"],
      admin: true
    }
  }
};

// ============================================================================
// 5. CONFIGURATEUR - MATIÈRES PRÉ-CONFIGURÉES
// ============================================================================

export const MATERIAUX_INIT = [
  {
    id: "acier",
    nom: "Acier Inox",
    prixBase: 8.75,
    prixCmHeight: 0.65,
    prixChar: 0.35,
    densitePixel: 0.18,
    delaiProduction: 5,
    description: "Acier galvanisé haute qualité, très durable"
  },
  {
    id: "bois_chene",
    nom: "Bois de Chêne",
    prixBase: 12.50,
    prixCmHeight: 0.85,
    prixChar: 0.45,
    densitePixel: 0.15,
    delaiProduction: 7,
    description: "Bois massif premium, aspect naturel"
  },
  {
    id: "acrylique",
    nom: "Acrylique Transparent",
    prixBase: 15.00,
    prixCmHeight: 0.55,
    prixChar: 0.50,
    densitePixel: 0.20,
    delaiProduction: 4,
    description: "Acrylique brillant pour effet moderne"
  },
  {
    id: "pvc",
    nom: "PVC Blanc",
    prixBase: 6.50,
    prixCmHeight: 0.45,
    prixChar: 0.30,
    densitePixel: 0.16,
    delaiProduction: 3,
    description: "PVC économique et durable"
  },
  {
    id: "aluminium",
    nom: "Aluminium Anodisé",
    prixBase: 10.25,
    prixCmHeight: 0.70,
    prixChar: 0.40,
    densitePixel: 0.17,
    delaiProduction: 6,
    description: "Aluminium anodisé, effet haut de gamme"
  }
];

export const FINITIONS_INIT = [
  {
    id: "vernis_brillant",
    nom: "Vernis Brillant",
    prixSupplementaire: 8.50,
    materiauxCompatibles: ["acier", "bois_chene", "aluminium"],
    description: "Finition brillante protectrice"
  },
  {
    id: "peinture_noire",
    nom: "Peinture Noire",
    prixSupplementaire: 10.00,
    materiauxCompatibles: ["acier", "bois_chene", "acrylique", "pvc", "aluminium"],
    description: "Peinture noir brillant"
  },
  {
    id: "peinture_blanche",
    nom: "Peinture Blanche",
    prixSupplementaire: 10.00,
    materiauxCompatibles: ["acier", "acrylique", "pvc", "aluminium"],
    description: "Peinture blanc brillant"
  },
  {
    id: "natural",
    nom: "Finition Naturelle",
    prixSupplementaire: 0,
    materiauxCompatibles: ["bois_chene"],
    description: "Laisse le bois naturel"
  }
];

// ============================================================================
// 6. CONFIGURATEUR - SETTINGS PAR DÉFAUT
// ============================================================================

export const CONFIGURATOR_SETTINGS_INIT = {
  id: "global",
  tauxTVA: 0.20,
  affichagePrix: "TTC",
  prixMiniCommande: 25.00,
  delaiLivraison: 10,
  prixLivraison: 30.00,
  seuilLivraisonGratuite: 150.00,
  modeMaintenance: false,
  commandesEnCours: true,
  emailNotifications: true
};

// ============================================================================
// 7. FIREBASE STORAGE - CONFIGURATION
// ============================================================================

export const STORAGE_CONFIG = {
  // Dossiers principaux
  FOLDERS: {
    BRANDING: "cg51/branding",           // Logo, images app
    PLANCHES: "cg51/planches",           // Documents maçonniques
    COMMANDES: "cg51/commandes",         // Factures, devis
    BIBLIOTHEQUE: "cg51/bibliotheque",   // PDFs, ressources
    UPLOADS: "cg51/uploads",             // Fichiers utilisateur
    BACKUPS: "cg51/backups"              // Sauvegardes
  },

  // Limites de taille
  MAX_FILE_SIZE: 15 * 1024 * 1024, // 15 MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_PDF_SIZE: 50 * 1024 * 1024,  // 50 MB

  // Types de fichiers autorisés
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
    PDF: ["application/pdf"],
    DOCUMENTS: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  }
};

// ============================================================================
// 8. AUTHENTIFICATION - RÈGLES
// ============================================================================

export const AUTH_CONFIG = {
  // Sessions
  SESSION_TIMEOUT_MINUTES: 60,
  REMEMBER_ME_DAYS: 30,

  // Passwords
  PASSWORD_MIN_LENGTH: 8,
  REQUIRE_SPECIAL_CHARS: true,

  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_DURATION_MINUTES: 15
};

// ============================================================================
// 9. INDEX FIRESTORE (pour performances)
// ============================================================================

export const FIRESTORE_INDEXES = [
  {
    collectionId: "configurator/commandes",
    fields: [
      { fieldPath: "userId", order: "ASCENDING" },
      { fieldPath: "dateCreation", order: "DESCENDING" },
      { fieldPath: "status", order: "ASCENDING" }
    ]
  },
  {
    collectionId: "artifacts",
    fields: [
      { fieldPath: "appId", order: "ASCENDING" },
      { fieldPath: "dateCreation", order: "DESCENDING" }
    ]
  }
];

// ============================================================================
// 10. MONITORING & ANALYTICS
// ============================================================================

export const MONITORING_CONFIG = {
  enablePerformanceMonitoring: true,
  enableAnalytics: true,
  enableCrashlytics: false,
  logLevel: "info", // debug, info, warn, error
  analyticsRetentionDays: 90
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  firebaseConfig,
  FIRESTORE_COLLECTIONS,
  FIRESTORE_PATHS,
  USERS_CONFIG,
  MATERIAUX_INIT,
  FINITIONS_INIT,
  CONFIGURATOR_SETTINGS_INIT,
  STORAGE_CONFIG,
  AUTH_CONFIG,
  FIRESTORE_INDEXES,
  MONITORING_CONFIG
};
