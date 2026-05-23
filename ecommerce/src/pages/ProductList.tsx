import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { getProducts, deleteProduct } from '../services/productService'
import type { Product } from '../types/product'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    fetchProducts()
  }

  return (
    <AdminLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Productos</h1>
          <p style={styles.subtitle}>Gestioná tu catálogo</p>
        </div>
        <button style={styles.addBtn} onClick={() => navigate('/admin/productos/nuevo')}>
          <Plus size={18} />
          {!isMobile && 'Nuevo producto'}
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#999' }}>Cargando...</p>
      ) : products.length === 0 ? (
        <div style={styles.empty}>
          <p>Aún no hay productos. ¡Creá el primero!</p>
        </div>
      ) : isMobile ? (
        // ── VISTA MÓVIL: cards ──
        <div style={styles.cardList}>
          {products.map((p: any) => {
            const img = p.product_images?.find((i: any) => i.is_main) || p.product_images?.[0]
            return (
              <div key={p.id} style={styles.mobileCard}>
                <div style={styles.mobileImgBox}>
                  {img
                    ? <img src={img.url} alt={p.name} style={styles.mobileImg} />
                    : <span style={{ fontSize: '1.5rem' }}>👕</span>
                  }
                </div>
                <div style={styles.mobileInfo}>
                  <p style={styles.mobileName}>{p.name}</p>
                  <p style={styles.mobilePrice}>₡{p.price.toLocaleString()}</p>
                  <span style={{
                    ...styles.stockBadge,
                    background: p.stock > 0 ? '#d1fae5' : '#fee2e2',
                    color: p.stock > 0 ? '#059669' : '#dc2626',
                  }}>
                    {p.stock > 0 ? `${p.stock} uds` : 'Agotado'}
                  </span>
                </div>
                <div style={styles.mobileActions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/admin/productos/editar/${p.id}`)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // ── VISTA DESKTOP: tabla ──
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Tallas</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>₡{p.price.toLocaleString()}</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={styles.td}>{p.sizes?.join(', ') || '—'}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        style={styles.editBtn}
                        onClick={() => navigate(`/admin/productos/editar/${p.id}`)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', margin: 0 },
  subtitle: { color: '#666', marginTop: '0.25rem', fontSize: '0.875rem' },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    flexShrink: 0,
  },
  empty: {
    background: '#fff',
    borderRadius: '10px',
    padding: '3rem',
    textAlign: 'center',
    color: '#999',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  // Móvil cards
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mobileCard: {
    background: '#fff',
    borderRadius: '10px',
    padding: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  mobileImgBox: {
    width: '52px',
    height: '52px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mobileImg: { width: '100%', height: '100%', objectFit: 'cover' },
  mobileInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  mobileName: { fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', margin: 0 },
  mobilePrice: { fontSize: '0.85rem', color: '#555', margin: 0 },
  stockBadge: {
    fontSize: '0.72rem',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '20px',
    alignSelf: 'flex-start',
  },
  mobileActions: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  // Desktop tabla
  tableWrapper: {
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '0.85rem 1rem',
    textAlign: 'left',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#888',
    borderBottom: '1px solid #f0f0f0',
    textTransform: 'uppercase',
  },
  tr: { borderBottom: '1px solid #f7f8fa' },
  td: { padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#333' },
  editBtn: {
    padding: '0.4rem',
    background: '#f0f4ff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#4f46e5',
    display: 'flex',
  },
  deleteBtn: {
    padding: '0.4rem',
    background: '#fff0f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#e53e3e',
    display: 'flex',
  },
}