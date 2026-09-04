import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const lodges = await prisma.lodge.findMany({ orderBy: { createdAt: 'desc' } });

  const statusColor: Record<string, string> = {
    ACTIVE: '#27ae60',
    PROVISIONING: '#f39c12',
    SUSPENDED: '#c0392b',
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.25rem' }}>⚜️ Admin FraternApp</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{lodges.length} loge(s) enregistrée(s)</p>

      {lodges.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Aucune loge pour l'instant.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              {['Slug', 'Nom', 'Email contact', 'URL', 'Statut', 'Créée le'].map(h => (
                <th key={h} style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lodges.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={cell}><code>{l.slug}</code></td>
                <td style={cell}>{l.name}</td>
                <td style={cell}>{l.contactEmail}</td>
                <td style={cell}><a href={l.pagesUrl} target="_blank" rel="noopener">{l.pagesUrl}</a></td>
                <td style={cell}>
                  <span style={{ background: statusColor[l.status] + '22', color: statusColor[l.status], padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 600 }}>
                    {l.status}
                  </span>
                </td>
                <td style={cell}>{l.createdAt.toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const cell: React.CSSProperties = { padding: '0.75rem 0.5rem', verticalAlign: 'middle' };
