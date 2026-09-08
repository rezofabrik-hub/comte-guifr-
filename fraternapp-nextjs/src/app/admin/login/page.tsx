'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Stocke dans un cookie de session (httpOnly non dispo côté client — pour dev uniquement)
    document.cookie = `admin_secret=${encodeURIComponent(secret)};path=/;SameSite=Strict`;
    router.push('/admin');
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', width: '320px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>⚜️ Accès admin</h1>
        <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.375rem' }}>Clé secrète</label>
        <input
          type="password"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          required
          style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--border)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9375rem' }}
        />
        {error && <p style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Accéder
        </button>
      </form>
    </main>
  );
}
