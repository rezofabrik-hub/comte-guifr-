import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FraternApp — Votre loge en ligne',
  description: 'Créez votre espace numérique maçonnique en 2 minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
