# Lettrage Configurator

A professional, standalone web application for customizing and ordering personalized engraved lettrages (text engravings).

## Features

✨ **Real-time Preview** - See your design instantly with canvas rendering
🎨 **Material Selection** - Choose from 5 premium materials (Steel, Wood, Acrylic, PVC, Aluminium)
🎯 **Customization Options** - Text, size, color, and finishes
📦 **Order Management** - Track all your lettrage orders
🔐 **User Authentication** - Secure Firebase authentication
💳 **Payment Integration** - Stripe payment processing (ready to integrate)
📧 **Email Notifications** - SendGrid transactional emails

## Getting Started

### Prerequisites

- Node.js 16+ (if using build tools)
- Modern web browser
- Firebase account (for authentication and database)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lettrage-configurator.git
   cd lettrage-configurator
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

3. **Serve the application**
   ```bash
   # Using Python
   python3 -m http.server 3000
   
   # Or using Node.js http-server
   npx http-server -p 3000
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Demo credentials are pre-filled for testing

## Configuration

### Firebase Setup

1. Create a Firebase project at https://firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Copy your credentials to `.env.local`

### External Services (Optional)

- **Stripe** - Payment processing
- **SendGrid** - Email notifications
- **Cloudflare** - CDN and deployment

See `.env.example` for all configuration options.

## Project Structure

```
lettrage-configurator/
├── index.html           # Single-page application
├── .env.example         # Environment variables template
├── firebase.config.js   # Firebase configuration
├── stripe.config.js     # Stripe payment setup
├── sendgrid.config.js   # Email configuration
└── README.md           # This file
```

## Technology Stack

- **Frontend**: React 18, Tailwind CSS, Babel
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Payments**: Stripe API
- **Email**: SendGrid API
- **Deployment**: Any static hosting (Vercel, Netlify, GitHub Pages, Cloudflare Pages)

## Features Roadmap

- [ ] Payment processing (Stripe)
- [ ] Email notifications (SendGrid)
- [ ] Admin dashboard
- [ ] PDF invoice generation
- [ ] Real-time order tracking
- [ ] Customer support chat
- [ ] Social sharing

## Development

### Adding New Features

1. Features are contained in the main `index.html` using React
2. Modify component functions directly
3. Test in your browser
4. Push changes to GitHub

### Testing

1. Use demo credentials in login
2. Test the full workflow: configure → preview → submit order
3. Check browser console for errors

## Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to `main` branch
3. Your site will be available at `https://yourusername.github.io/lettrage-configurator`

### Option 3: Cloudflare Pages
```bash
npm install -g wrangler
wrangler pages publish .
```

## API Endpoints (To Implement)

- `POST /api/orders` - Create new order
- `GET /api/orders` - List user orders
- `PUT /api/orders/{id}` - Update order
- `POST /api/checkout` - Create Stripe session
- `POST /api/webhook` - Handle Stripe webhooks
- `POST /api/send-email` - Send order confirmation

## Security

- All Firebase rules are configured for role-based access
- API keys are environment variables (never committed)
- Payments are processed via Stripe (PCI compliant)
- User data is encrypted in transit

## License

MIT License - feel free to use for personal or commercial projects

## Support

For issues and questions, please open a GitHub issue or contact support@lettrageconfigurator.com

---

**Built with ❤️ for custom engraving enthusiasts**
