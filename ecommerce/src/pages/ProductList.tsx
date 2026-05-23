import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { getProducts, deleteProduct } from '../services/productService'
import type { Product } from '../types/product'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
          <p style={styles.subtitle}>Gestioná tu catálogo de camisas</p>
        </div>
        <button style={styles.addBtn} onClick={() => navigate('/admin/productos/nuevo')}>
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : products.length === 0 ? (
        <div style={styles.empty}>
          <p>Aún no hay productos. ¡Creá el primero!</p>
        </div>
      ) : (
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
                    <div style={styles.actions}>
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
    marginBottom: '2rem',
  },
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#1a1a2e', margin: 0 },
  subtitle: { color: '#666', marginTop: '0.25rem' },
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
  },
  empty: {
    background: '#fff',
    borderRadius: '10px',
    padding: '3rem',
    textAlign: 'center',
    color: '#999',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
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
  actions: { display: 'flex', gap: '0.5rem' },
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