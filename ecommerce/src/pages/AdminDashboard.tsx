import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { getProducts } from '../services/productService'
import { Package, Image, AlertTriangle, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const totalProducts = products.length
  const totalImages = products.reduce((acc, p) => acc + (p.product_images?.length || 0), 0)
  const sinStock = products.filter(p => p.stock === 0).length
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0)

  const stats = [
    { label: 'Productos', value: totalProducts, icon: Package, color: '#4f46e5', bg: '#ede9fe' },
    { label: 'Imágenes', value: totalImages, icon: Image, color: '#0891b2', bg: '#e0f2fe' },
    { label: 'Sin stock', value: sinStock, icon: AlertTriangle, color: '#d97706', bg: '#fef3c7' },
    { label: 'Unidades totales', value: totalStock, icon: TrendingUp, color: '#059669', bg: '#d1fae5' },
  ]

  return (
    <AdminLayout>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.subtitle}>Resumen de tu tienda</p>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.iconBox, background: stat.bg }}>
                <Icon size={22} color={stat.color} />
              </div>
              <div>
                <p style={styles.statValue}>
                  {loading ? '...' : stat.value}
                </p>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Últimos productos */}
      <div style={styles.recentSection}>
        <div style={styles.recentHeader}>
          <h2 style={styles.recentTitle}>Últimos productos</h2>
          <button
            style={styles.verTodos}
            onClick={() => navigate('/admin/productos')}
          >
            Ver todos →
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#999' }}>Cargando...</p>
        ) : products.length === 0 ? (
          <p style={{ color: '#999' }}>No hay productos aún.</p>
        ) : (
          <div style={styles.recentGrid}>
            {products.slice(0, 4).map(p => {
              const img = p.product_images?.find((i: any) => i.is_main) || p.product_images?.[0]
              return (
                <div
                  key={p.id}
                  style={styles.recentCard}
                  onClick={() => navigate(`/admin/productos/editar/${p.id}`)}
                >
                  <div style={styles.recentImgBox}>
                    {img ? (
                      <img src={img.url} alt={p.name} style={styles.recentImg} />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>👕</span>
                    )}
                  </div>
                  <div style={styles.recentInfo}>
                    <p style={styles.recentName}>{p.name}</p>
                    <p style={styles.recentPrice}>₡{p.price.toLocaleString()}</p>
                  </div>
                  <span style={{
                    ...styles.stockBadge,
                    background: p.stock > 0 ? '#d1fae5' : '#fee2e2',
                    color: p.stock > 0 ? '#059669' : '#dc2626',
                  }}>
                    {p.stock > 0 ? `${p.stock} uds` : 'Agotado'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#1a1a2e' },
  subtitle: { color: '#888', marginTop: '0.25rem', marginBottom: '1.75rem' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  iconBox: {
    borderRadius: '10px',
    padding: '0.65rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e', margin: 0 },
  statLabel: { color: '#888', fontSize: '0.82rem', margin: 0 },
  recentSection: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  recentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  recentTitle: { fontSize: '1rem', fontWeight: 700, color: '#1a1a2e' },
  verTodos: {
    background: 'transparent',
    border: 'none',
    color: '#4f46e5',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  recentGrid: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  recentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    background: '#fafafa',
  },
  recentImgBox: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recentImg: { width: '100%', height: '100%', objectFit: 'cover' },
  recentInfo: { flex: 1 },
  recentName: { fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', margin: 0 },
  recentPrice: { fontSize: '0.82rem', color: '#888', margin: 0 },
  stockBadge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
}