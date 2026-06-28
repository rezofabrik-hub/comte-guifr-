/**
 * SENDGRID CONFIGURATION - Emails transactionnels
 *
 * Configuration SendGrid pour l'envoi d'emails (confirmations, notifications)
 */

// ============================================================================
// 1. CONFIGURATION DE BASE
// ============================================================================

export const sendgridConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@cg51-virtuel.fr',
  fromName: process.env.SENDGRID_FROM_NAME || 'Comte Guifré - Temple Virtuel',

  // Emails admin
  adminEmail: process.env.SENDGRID_ADMIN_EMAIL || 'architecte@cg51-virtuel.fr',
  supportEmail: process.env.SENDGRID_SUPPORT_EMAIL || 'support@cg51-virtuel.fr',

  // Configuration
  replyTo: 'support@cg51-virtuel.fr',
  categories: ['configurateur', 'temple-virtuel'],
  sandboxMode: process.env.NODE_ENV === 'development'
};

// ============================================================================
// 2. TEMPLATES D'EMAILS
// ============================================================================

export const EMAIL_TEMPLATES = {
  // Confirmation de commande
  ORDER_CONFIRMATION: {
    templateId: 'd-ORDER_CONFIRMATION_TEMPLATE_ID', // À remplir
    subject: '✅ Commande confirmée - Configurateur Comte Guifré',
    placeholders: [
      'client_name',
      'order_id',
      'order_date',
      'order_total',
      'text_ordered',
      'material',
      'delivery_date',
      'tracking_url'
    ]
  },

  // Commande en production
  ORDER_PRODUCTION: {
    templateId: 'd-ORDER_PRODUCTION_TEMPLATE_ID',
    subject: '🔧 Votre commande est en production',
    placeholders: [
      'client_name',
      'order_id',
      'production_start_date',
      'expected_completion_date'
    ]
  },

  // Commande expédiée
  ORDER_SHIPPED: {
    templateId: 'd-ORDER_SHIPPED_TEMPLATE_ID',
    subject: '📦 Votre commande est expédiée!',
    placeholders: [
      'client_name',
      'order_id',
      'tracking_number',
      'tracking_url',
      'carrier',
      'estimated_delivery'
    ]
  },

  // Commande livrée
  ORDER_DELIVERED: {
    templateId: 'd-ORDER_DELIVERED_TEMPLATE_ID',
    subject: '✨ Votre commande a été livrée',
    placeholders: [
      'client_name',
      'order_id',
      'delivery_date',
      'satisfaction_survey_url'
    ]
  },

  // Facture
  INVOICE: {
    templateId: 'd-INVOICE_TEMPLATE_ID',
    subject: '💰 Votre facture - Configurateur Comte Guifré',
    placeholders: [
      'client_name',
      'invoice_number',
      'invoice_date',
      'invoice_total',
      'invoice_pdf_url',
      'payment_terms'
    ]
  },

  // Contact Form Reply
  CONTACT_REPLY: {
    templateId: 'd-CONTACT_REPLY_TEMPLATE_ID',
    subject: '📨 Nous avons bien reçu votre message',
    placeholders: [
      'sender_name',
      'sender_email',
      'message',
      'reference_number'
    ]
  },

  // Notification Admin
  ADMIN_NEW_ORDER: {
    templateId: 'd-ADMIN_NEW_ORDER_TEMPLATE_ID',
    subject: '🆕 Nouvelle commande reçue',
    placeholders: [
      'order_id',
      'client_email',
      'order_date',
      'order_total',
      'order_details_url'
    ]
  }
};

// ============================================================================
// 3. STRUCTURE DES EMAILS
// ============================================================================

export const EMAIL_STRUCTURE = {
  // Confirmation de commande
  ORDER_CONFIRMATION_DATA: {
    to: {
      email: null, // À remplir
      name: null   // À remplir
    },
    from: {
      email: sendgridConfig.fromEmail,
      name: sendgridConfig.fromName
    },
    replyTo: {
      email: sendgridConfig.replyTo
    },
    subject: EMAIL_TEMPLATES.ORDER_CONFIRMATION.subject,
    templateId: EMAIL_TEMPLATES.ORDER_CONFIRMATION.templateId,
    dynamicTemplateData: {
      client_name: null,
      order_id: null,
      order_date: null,
      order_total: null,
      text_ordered: null,
      material: null,
      delivery_date: null,
      tracking_url: null
    },
    categories: ['order_confirmation', 'configurateur'],
    metadata: {
      order_id: null,
      user_id: null
    }
  },

  // Email admin
  ADMIN_NEW_ORDER_DATA: {
    to: {
      email: sendgridConfig.adminEmail
    },
    from: {
      email: sendgridConfig.fromEmail,
      name: sendgridConfig.fromName
    },
    subject: EMAIL_TEMPLATES.ADMIN_NEW_ORDER.subject,
    templateId: EMAIL_TEMPLATES.ADMIN_NEW_ORDER.templateId,
    dynamicTemplateData: {
      order_id: null,
      client_email: null,
      order_date: null,
      order_total: null,
      order_details_url: null
    },
    categories: ['admin', 'new_order']
  }
};

// ============================================================================
// 4. STATUTS DE COMMANDE & EMAILS ASSOCIÉS
// ============================================================================

export const ORDER_STATUS_EMAILS = {
  'pending': {
    send: true,
    template: EMAIL_TEMPLATES.ORDER_CONFIRMATION,
    delay_ms: 0 // Immédiat
  },
  'production': {
    send: true,
    template: EMAIL_TEMPLATES.ORDER_PRODUCTION,
    delay_ms: 0
  },
  'shipped': {
    send: true,
    template: EMAIL_TEMPLATES.ORDER_SHIPPED,
    delay_ms: 0
  },
  'delivered': {
    send: true,
    template: EMAIL_TEMPLATES.ORDER_DELIVERED,
    delay_ms: 86400000 // 24h après livraison
  },
  'cancelled': {
    send: false,
    template: null,
    delay_ms: 0
  }
};

// ============================================================================
// 5. DESTINATAIRES & LISTES
// ============================================================================

export const RECIPIENT_LISTS = {
  // Liste clients
  CUSTOMERS: {
    id: 'customers',
    name: 'All Customers',
    description: 'Tous les clients ayant passé commande'
  },

  // Liste newsletter
  NEWSLETTER: {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Abonnés à la newsletter'
  },

  // Architects (Admin)
  ADMINS: {
    id: 'admins',
    name: 'Administrateurs',
    emails: [sendgridConfig.adminEmail]
  }
};

// ============================================================================
// 6. NOTIFICATIONS & ALERTES
// ============================================================================

export const NOTIFICATIONS = {
  // Alerte de stock faible
  LOW_INVENTORY: {
    send_to: [sendgridConfig.adminEmail],
    subject: 'Alerte: Stock faible',
    template: 'low-inventory-alert'
  },

  // Alerte de commande difficile
  DIFFICULT_ORDER: {
    send_to: [sendgridConfig.adminEmail],
    subject: '⚠️ Commande difficile à réaliser',
    template: 'difficult-order-alert'
  },

  // Alerte de paiement échoué
  PAYMENT_FAILED: {
    send_to: null, // Client email
    subject: '❌ Paiement échoué - Action requise',
    template: 'payment-failed-alert'
  }
};

// ============================================================================
// 7. ATTACHMENTS
// ============================================================================

export const ATTACHMENTS = {
  // Facture PDF
  INVOICE_PDF: {
    type: 'application/pdf',
    filename: 'facture.pdf',
    contentId: 'invoice_pdf'
  },

  // Devis PDF
  QUOTE_PDF: {
    type: 'application/pdf',
    filename: 'devis.pdf',
    contentId: 'quote_pdf'
  }
};

// ============================================================================
// 8. TRACKING & ANALYTICS
// ============================================================================

export const TRACKING_CONFIG = {
  trackingSettings: {
    clickTracking: {
      enable: true
    },
    openTracking: {
      enable: true,
      substitutionTag: '%open-track%'
    },
    subscriptionTracking: {
      enable: true,
      text: 'Se désabonner',
      html: '<a href="%link%">Se désabonner</a>'
    },
    ganalytics: {
      enable: true,
      campaignSource: 'sendgrid',
      campaignMedium: 'email',
      campaignTerm: null,
      campaignContent: null,
      campaignName: null
    }
  }
};

// ============================================================================
// 9. PERSONALISATION & BRANDING
// ============================================================================

export const EMAIL_BRANDING = {
  // En-têtes
  header: {
    logo: 'https://cdn.cg51-virtuel.fr/images/logo.png',
    logoAlt: 'Comte Guifré - Temple Virtuel',
    bgColor: '#0f172a'
  },

  // Pied de page
  footer: {
    companyName: 'Comte Guifré - Temple Virtuel',
    address: 'Loge R∴L∴ Comte Guifré n°51',
    phone: '+33 (0)6 XX XX XX XX',
    email: 'contact@cg51-virtuel.fr',
    website: 'https://cg51-virtuel.fr',

    // Social links
    socialLinks: {
      facebook: 'https://facebook.com/cg51',
      instagram: 'https://instagram.com/cg51',
      twitter: 'https://twitter.com/cg51'
    },

    // Légal
    unsubscribe_text: 'Vous recevez cet email car vous êtes inscrit à nos notifications.'
  },

  // Couleurs
  colors: {
    primary: '#0079E3',
    secondary: '#00D084',
    dark: '#1A1A1A',
    light: '#F5F5F5'
  },

  // Polices
  fonts: {
    primary: 'Arial, sans-serif',
    secondary: 'Georgia, serif'
  }
};

// ============================================================================
// 10. ERROR HANDLING
// ============================================================================

export const SENDGRID_ERRORS = {
  '400': 'Requête invalide - vérifier les données',
  '401': 'Authentification échouée - vérifier API key',
  '403': 'Accès refusé',
  '404': 'Template non trouvé',
  '429': 'Trop de requêtes - rate limit atteint',
  '500': 'Erreur serveur SendGrid',
  '503': 'Service unavailable'
};

// ============================================================================
// 11. QUEUE & RETRIES
// ============================================================================

export const QUEUE_CONFIG = {
  // Retry en cas d'erreur
  maxRetries: 3,
  retryDelayMs: 5000,

  // Queue de priorité
  priority: {
    HIGH: 1,      // Confirmations de paiement
    NORMAL: 2,    // Notifications commande
    LOW: 3        // Newsletters
  },

  // Batch sending
  batchSize: 100,
  batchDelayMs: 100
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  sendgridConfig,
  EMAIL_TEMPLATES,
  EMAIL_STRUCTURE,
  ORDER_STATUS_EMAILS,
  RECIPIENT_LISTS,
  NOTIFICATIONS,
  ATTACHMENTS,
  TRACKING_CONFIG,
  EMAIL_BRANDING,
  SENDGRID_ERRORS,
  QUEUE_CONFIG
};
