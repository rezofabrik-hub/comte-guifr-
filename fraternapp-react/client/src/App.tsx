import { useState } from 'react';

type State = { status: 'idle' | 'loading' | 'success' | 'error'; message?: string; url?: string };

export default function App() {
  const [state, setState] = useState<State>({ status: 'idle' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: 'loading' });
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/provision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      res.ok ? setState({ status: 'success', url: json.url }) : setState({ status: 'error', message: json.error });
    } catch { setState({ status: 'error', message: 'Erreur réseau.' }); }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2rem' }}>⚜️</div>
        <h1 style={{ fontSize: '2rem', color: 'var(--gold)', fontWeight: 700 }}>FraternApp</h1>
        <p style={{ color: 'var(--muted)' }}>Créez l'espace de votre loge en 2 minutes</p>
      </div>

      {state.status === 'success' ? (
        <div style={card}>
          <p style={{ textAlign: 'center', color: '#27ae60', fontSize: '1.1rem', fontWeight: 600 }}>✅ Loge déployée !</p>
          <a href={state.url} style={{ display: 'block', textAlign: 'center', color: 'var(--gold)', marginTop: '1rem' }}>{state.url}</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={card}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Créer votre loge</h2>
          {[
            { label: 'Nom de la loge *', name: 'lodge_name', placeholder: 'Loge Lumière de l\'Orient' },
            { label: 'Identifiant (slug) *', name: 'slug', placeholder: 'loge-lumiere-75', pattern: '[a-z0-9-]{3,40}' },
            { label: 'Email de contact *', name: 'contact_email', type: 'email', placeholder: 'admin@exemple.com' },
            { label: 'Mot de passe admin *', name: 'initial_password', type: 'password', placeholder: '8 caractères minimum', minLength: 8 },
            { label: 'Domaine personnalisé', name: 'custom_domain', placeholder: 'loge.votre-domaine.fr' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>{f.label}</label>
              <input name={f.name} type={f.type || 'text'} placeholder={f.placeholder} pattern={f.pattern} minLength={f.minLength}
                required={f.label.endsWith('*')} style={input} />
            </div>
          ))}
          {state.status === 'error' && <p style={{ color: '#c0392b', marginBottom: '1rem', fontSize: '0.875rem' }}>{state.message}</p>}
          <button type="submit" disabled={state.status === 'loading'} style={btn}>
            {state.status === 'loading' ? 'Déploiement…' : 'Créer ma loge →'}
          </button>
        </form>
      )}
    </main>
  );
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '480px' };
const input: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9375rem' };
const btn: React.CSSProperties = { width: '100%', padding: '0.75rem', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' };
