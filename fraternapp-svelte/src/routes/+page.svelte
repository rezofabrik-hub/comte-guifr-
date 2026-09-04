<script lang="ts">
  let status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  let message = '';
  let resultUrl = '';

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    status = 'loading';
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    try {
      const res = await fetch('/api/provision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (res.ok) { status = 'success'; resultUrl = json.url; }
      else { status = 'error'; message = json.error; }
    } catch { status = 'error'; message = 'Erreur réseau.'; }
  }
</script>

<main>
  <header>
    <span class="icon">⚜️</span>
    <h1>FraternApp</h1>
    <p>Créez l'espace de votre loge en 2 minutes</p>
  </header>

  {#if status === 'success'}
    <div class="card">
      <p class="success">✅ Loge déployée !</p>
      <a href={resultUrl}>{resultUrl}</a>
    </div>
  {:else}
    <form class="card" on:submit={handleSubmit}>
      <h2>Créer votre loge</h2>
      <label>Nom de la loge *<input name="lodge_name" placeholder="Loge Lumière de l'Orient" required /></label>
      <label>Identifiant (slug) *<input name="slug" placeholder="loge-lumiere-75" pattern="[a-z0-9-]{3,40}" required /></label>
      <label>Email de contact *<input name="contact_email" type="email" placeholder="admin@exemple.com" required /></label>
      <label>Mot de passe admin *<input name="initial_password" type="password" placeholder="8 caractères minimum" minlength="8" required /></label>
      <label>Domaine personnalisé<input name="custom_domain" placeholder="loge.votre-domaine.fr" /></label>
      {#if status === 'error'}<p class="error">{message}</p>{/if}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Déploiement…' : 'Créer ma loge →'}
      </button>
    </form>
  {/if}
</main>

<style>
  main { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
  header { text-align: center; margin-bottom: 2rem; }
  .icon { font-size: 2rem; display: block; }
  h1 { font-size: 2rem; color: var(--gold); font-weight: 700; }
  header p { color: var(--muted); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; width: 100%; max-width: 480px; }
  h2 { margin-bottom: 1.5rem; font-weight: 600; }
  label { display: flex; flex-direction: column; gap: 0.375rem; font-size: 0.875rem; font-weight: 500; margin-bottom: 1rem; }
  input { padding: 0.625rem 0.875rem; border: 1px solid var(--border); border-radius: 6px; font-size: 0.9375rem; }
  button { width: 100%; padding: 0.75rem; background: var(--gold); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
  button:disabled { opacity: 0.6; }
  .success { text-align: center; color: #27ae60; font-weight: 600; }
  .error { color: #c0392b; font-size: 0.875rem; margin-bottom: 1rem; }
  a { color: var(--gold); word-break: break-all; display: block; text-align: center; margin-top: 1rem; }
</style>
