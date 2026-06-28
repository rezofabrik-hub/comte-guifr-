/**
 * STRIPE CONFIGURATION - Paiement en ligne
 *
 * Configuration Stripe pour traiter les paiements des commandes
 * Utilisé côté serveur et client
 */

// ============================================================================
// 1. CONFIGURATION DE BASE
// ============================================================================

export const stripeConfig = {
  // Mode
  environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',

  // Clés
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // Devise & Locale
  currency: 'eur',
  locale: 'fr'
};

// ============================================================================
// 2. PRODUITS & PRIX
// ============================================================================

export const STRIPE_PRODUCTS = {
  // Lettrages - Produit principal
  LETTERING: {
    id: 'prod_lettering',
    name: 'Lettrage Personnalisé',
    description: 'Lettrage CNC / Laser personnalisé sur mesure',
    image: 'https://cdn.cg51-virtuel.fr/images/lettering.jpg',
    prices: [
      {
        id: 'price_lettering_dynamic',
        nickname: 'Dynamic - Par commande',
        billingScheme: 'per_unit',
        currency: 'eur',
        recurring: null, // Une seule fois
        metadata: {
          material: 'dynamic',
          billing_type: 'dynamic'
        }
      }
    ]
  },

  // Finitions optionnelles
  FINISHES: {
    id: 'prod_finishes',
    name: 'Finitions & Options',
    description: 'Finitions additionnelles pour lettrages',
    prices: [
      {
        id: 'price_vernis_brillant',
        name: 'Vernis Brillant',
        amount: 850, // 8.50€ en cents
        currency: 'eur'
      },
      {
        id: 'price_peinture_noire',
        name: 'Peinture Noire',
        amount: 1000, // 10.00€
        currency: 'eur'
      },
      {
        id: 'price_peinture_blanche',
        name: 'Peinture Blanche',
        amount: 1000, // 10.00€
        currency: 'eur'
      }
    ]
  },

  // Livraison
  SHIPPING: {
    id: 'prod_shipping',
    name: 'Livraison',
    description: 'Frais d\'expédition',
    prices: [
      {
        id: 'price_shipping_standard',
        name: 'Livraison Standard',
        amount: 3000, // 30.00€
        currency: 'eur',
        delivers_in_days: 5
      },
      {
        id: 'price_shipping_express',
        name: 'Livraison Express',
        amount: 6000, // 60.00€
        currency: 'eur',
        delivers_in_days: 2
      }
    ]
  }
};

// ============================================================================
// 3. WEBHOOK CONFIGURATION
// ============================================================================

export const WEBHOOK_EVENTS = {
  // Payment Intent
  'payment_intent.succeeded': 'Paiement réussi',
  'payment_intent.payment_failed': 'Paiement échoué',
  'payment_intent.canceled': 'Paiement annulé',

  // Checkout Session
  'checkout.session.completed': 'Commande complétée',
  'checkout.session.async_payment_succeeded': 'Paiement asynchrone réussi',
  'checkout.session.async_payment_failed': 'Paiement asynchrone échoué',

  // Invoice
  'invoice.created': 'Facture créée',
  'invoice.paid': 'Facture payée',
  'invoice.payment_failed': 'Paiement facture échoué',

  // Charge
  'charge.dispute.created': 'Contestation créée',
  'charge.refunded': 'Remboursement effectué'
};

// ============================================================================
// 4. CHECKOUT SESSION CONFIG
// ============================================================================

export const CHECKOUT_SESSION_CONFIG = {
  // Metadata
  metadata: {
    app: 'comte-guifre-configurateur',
    version: '1.0'
  },

  // Paiement
  payment_method_types: ['card'],
  payment_method_options: {
    card: {
      installments: {
        enabled: false
      }
    }
  },

  // Billing
  billing_address_collection: 'required',
  customer_creation: 'always', // Créer/trouver client
  client_reference_id: null, // À remplir par commande

  // Redirection
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/commandes?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/configurateur`,

  // Locale
  locale: 'fr'
};

// ============================================================================
// 5. CUSTOMER CONFIG
// ============================================================================

export const CUSTOMER_CONFIG = {
  // Email du client
  email: null, // À remplir

  // Adresse de facturation
  address: {
    line1: null,
    line2: null,
    city: null,
    postal_code: null,
    state: null,
    country: 'FR' // Par défaut France
  },

  // Metadata
  metadata: {
    app: 'configurateur',
    user_id: null // UID Firebase
  },

  // Taxes
  tax_exempt: 'none' // 'none', 'exempt', 'reverse'
};

// ============================================================================
// 6. PAYMENT INTENTS CONFIG
// ============================================================================

export const PAYMENT_INTENT_CONFIG = {
  // Amount en cents (ex: 2000 = 20.00€)
  amount: null,
  currency: 'eur',

  // Méthode de paiement
  payment_method_types: ['card'],

  // Client
  customer: null, // Stripe Customer ID
  receipt_email: null,

  // Description & Métadonnées
  description: 'Commande lettrage personnalisé',
  metadata: {
    app: 'configurateur',
    commande_id: null,
    user_id: null
  },

  // Capture
  capture_method: 'automatic', // ou 'manual' pour pré-autorisation
  confirm: false
};

// ============================================================================
// 7. REFUND CONFIG
// ============================================================================

export const REFUND_CONFIG = {
  reason: 'requested_by_customer', // 'duplicate', 'fraudulent', 'requested_by_customer'
  amount: null, // En cents - null = remboursement complet
  metadata: {
    refund_reason: null
  }
};

// ============================================================================
// 8. TAX CONFIGURATION
// ============================================================================

export const TAX_CONFIG = {
  // Auto-Tax (Stripe Tax)
  automatic_tax_calculation: {
    enabled: true
  },

  // Taux TVA par défaut (France: 20%)
  tax_rates: {
    FR_STANDARD: {
      id: 'txr_fr_standard',
      display_name: 'TVA 20% - France',
      percentage: 20.0,
      jurisdiction: 'FR',
      inclusive: false
    }
  }
};

// ============================================================================
// 9. ERROR HANDLING
// ============================================================================

export const ERROR_CODES = {
  'card_declined': 'Votre carte a été refusée',
  'expired_card': 'Votre carte a expiré',
  'incorrect_cvc': 'CVC incorrect',
  'processing_error': 'Erreur de traitement - veuillez réessayer',
  'rate_limit': 'Trop de requêtes - veuillez patienter',
  'authentication_error': 'Authentification échouée',
  'invalid_request_error': 'Requête invalide',
  'api_error': 'Erreur serveur - veuillez réessayer'
};

// ============================================================================
// 10. WEBHOOK HANDLER TEMPLATE
// ============================================================================

export const WEBHOOK_HANDLER_TEMPLATE = {
  // Mise à jour commande
  updateOrder: async (stripe, event) => {
    const session = event.data.object;
    // 1. Récupérer commande Firestore
    // 2. Mettre à jour status à 'paid'
    // 3. Envoyer confirmation email
    // 4. Mettre à jour inventory
  },

  // Envoyer email
  sendConfirmationEmail: async (customer, order) => {
    // Utiliser SendGrid pour envoyer confirmation
  },

  // Gérer remboursement
  handleRefund: async (stripe, chargeId) => {
    // Créer refund via Stripe
    // Mettre à jour commande
    // Notifier client
  },

  // Gérer dispute
  handleDispute: async (stripe, disputeId) => {
    // Log dispute
    // Notifier admin
    // Archiver commande
  }
};

// ============================================================================
// 11. TESTING CONFIG
// ============================================================================

export const TESTING_CARDS = {
  // Cartes de test (mode Test Stripe)
  VISA_SUCCESS: {
    number: '4242424242424242',
    exp: '12/25',
    cvc: '123'
  },
  VISA_DECLINE: {
    number: '4000000000000002',
    exp: '12/25',
    cvc: '123'
  },
  AMEX: {
    number: '378282246310005',
    exp: '12/25',
    cvc: '1234'
  }
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  stripeConfig,
  STRIPE_PRODUCTS,
  WEBHOOK_EVENTS,
  CHECKOUT_SESSION_CONFIG,
  CUSTOMER_CONFIG,
  PAYMENT_INTENT_CONFIG,
  REFUND_CONFIG,
  TAX_CONFIG,
  ERROR_CODES,
  WEBHOOK_HANDLER_TEMPLATE,
  TESTING_CARDS
};
