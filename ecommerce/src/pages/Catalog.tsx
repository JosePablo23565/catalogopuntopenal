import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { Shirt, Settings } from 'lucide-react'

export default function Catalog() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <Shirt size={24} color="#1a1a2e" />
            <span style={styles.logoText}>CamisasShop</span>
          </div>
          <button
            style={styles.adminBtn}
            onClick={() => navigate('/admin')}
          >
            <Settings size={16} />
            Admin
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Nueva Colección</h1>
        <p style={styles.heroSub}>Camisas de calidad para cada ocasión</p>
      </div>

      {/* Catálogo */}
      <main style={styles.main}>
        {loading ? (
          <p style={styles.message}>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p style={styles.message}>No hay productos disponibles aún.</p>
        ) : (
          <div style={styles.grid}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 CamisasShop · Todos los derechos reservados</p>
      </footer>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f7f8fa',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#fff',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  adminBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.85rem',
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#555',
  },
  hero: {
    background: '#1a1a2e',
    color: '#fff',
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '0.5rem',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    flex: 1,
    width: '100%',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  message: {
    textAlign: 'center',
    color: '#999',
    marginTop: '3rem',
  },
  footer: {
    textAlign: 'center',
    padding: '1.5rem',
    color: '#aaa',
    fontSize: '0.85rem',
    borderTop: '1px solid #eee',
    background: '#fff',
  },
}