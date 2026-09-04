'use client';

import { useState } from 'react';

type State = { status: 'idle' | 'loading' | 'success' | 'error'; message?: string; url?: string };

export default function OnboardingForm() {
  const [state, setState] = useState<State>({ status: 'idle' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: 'loading' });

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch('/api/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setState({ status: 'error', message: json.error });
      } else {
        setState({ status: 'success', url: json.url });
      }
    } catch {
      setState({ status: 'error', message: 'Erreur réseau. Réessayez.' });
    }
  }

  if (state.status === 'success') {
    return (
      <div style={card}>
        <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ textAlign: 'center', color: 'var(--success)', marginBottom: '0.75rem' }}>Loge en cours de déploiement</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '1rem' }}>
          Votre espace sera accessible dans ~2 minutes sur :
        </p>
        <a href={state.url} target="_blank" rel="noopener noreferrer"
           style={{ display: 'block', textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, color: 'var(--gold)', wordBreak: 'break-all' }}>
          {state.url}
        </a>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>
          Un email de confirmation vous a été envoyé.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={card}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Créer votre loge</h2>

      <Field label="Nom de la loge *" name="lodge_name" placeholder="Loge Lumière de l'Orient" required />
      <Field label="Identifiant (slug) *" name="slug" placeholder="loge-lumiere-75" pattern="[a-z0-9-]{3,40}"
             title="Minuscules, chiffres et tirets, 3–40 caractères" required />
      <Field label="Email de contact *" name="contact_email" type="email" placeholder="admin@exemple.com" required />
      <Field label="Mot de passe administrateur *" name="initial_password" type="password" placeholder="8 caractères minimum" required minLength={8} />
      <Field label="Domaine personnalisé" name="custom_domain" placeholder="loge.votre-domaine.fr" />

      {state.status === 'error' && (
        <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.75rem', background: '#fdf0ef', borderRadius: '6px' }}>
          {state.message}
        </p>
      )}

      <button type="submit" disabled={state.status === 'loading'} style={btn}>
        {state.status === 'loading' ? 'Déploiement en cours…' : 'Créer ma loge →'}
      </button>

      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center', marginTop: '1rem' }}>
        30 jours d'essai gratuit · Sans carte bancaire
      </p>
    </form>
  );
}

function Field({ label, name, type = 'text', ...props }: { label: string; name: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={name} style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>{label}</label>
      <input id={name} name={name} type={type} style={input} {...props} />
    </div>
  );
}

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '2rem',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontSize: '0.9375rem',
  background: 'var(--bg)',
  color: 'var(--text)',
};

const btn: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  background: 'var(--gold)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '0.5rem',
};
