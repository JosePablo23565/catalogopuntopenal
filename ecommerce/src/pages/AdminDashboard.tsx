import AdminLayout from '../components/AdminLayout'
import { Package, TrendingUp, Image } from 'lucide-react'

const stats = [
  { label: 'Productos', value: '0', icon: Package, color: '#4f46e5' },
  { label: 'Imágenes', value: '0', icon: Image, color: '#0891b2' },
  { label: 'Visitas hoy', value: '—', icon: TrendingUp, color: '#059669' },
]

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Bienvenido al panel de administración</p>

      <div style={styles.statsGrid}>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.iconBox, background: stat.color }}>
                <Icon size={22} color="#fff" />
              </div>
              <div>
                <p style={styles.statValue}>{stat.value}</p>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </AdminLayout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  },
  subtitle: {
    color: '#666',
    marginTop: '0.25rem',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    background: '#fff',
    borderRadius: '10px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  iconBox: {
    borderRadius: '8px',
    padding: '0.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  },
  statLabel: {
    color: '#888',
    fontSize: '0.85rem',
    margin: 0,
  },
}