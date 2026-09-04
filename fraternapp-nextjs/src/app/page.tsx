import OnboardingForm from '@/components/OnboardingForm';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚜️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.5rem' }}>FraternApp</h1>
        <p style={{ color: 'var(--muted)', maxWidth: '480px' }}>
          Créez l'espace numérique de votre loge en 2 minutes. Hébergement sécurisé, domaine personnalisé, 30 jours gratuits.
        </p>
      </header>

      <OnboardingForm />

      <footer style={{ marginTop: '3rem', color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center' }}>
        © 2026 FraternApp · <a href="mailto:bonjour@fraternapp.com">Contact</a>
      </footer>
    </main>
  );
}
