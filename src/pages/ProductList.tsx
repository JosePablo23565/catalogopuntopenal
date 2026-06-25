import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { getProducts, deleteProduct } from '../services/productService'
import type { Product } from '../types/product'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useIsMobile } from '../hooks/useIsMobile'

const PRODUCTS_PER_PAGE = 36

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      setCurrentPage(1)
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

  const totalProducts = products.length
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)
  const paginatedProducts = products.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    }
    return rangeWithDots
  }

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>Productos</h1>

        <button
          style={styles.addBtn}
          onClick={() => navigate('/puntopenal-admin/productos/nuevo')}
        >
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
      ) : (
        <>
          <div style={styles.paginationInfo}>
            <p>Mostrando {startIndex + 1}-{endIndex} de {totalProducts} productos</p>
          </div>

          {isMobile ? (
            <div style={styles.cardList}>
              {paginatedProducts.map((p: any) => {
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
                    </div>
                    <div style={styles.mobileActions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => navigate(`/puntopenal-admin/productos/editar/${p.id}`)}
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
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Precio</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map(p => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>₡{p.price.toLocaleString()}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            style={styles.editBtn}
                            onClick={() => navigate(`/puntopenal-admin/productos/editar/${p.id}`)}
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

          {totalPages > 1 && (
            <div style={styles.pagination}>
              {getPageNumbers().map((page, idx) => (
                typeof page === 'number' ? (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      ...styles.numberBtn,
                      background: currentPage === page ? '#0f172a' : '#fff',
                      color: currentPage === page ? '#fff' : '#0f172a',
                      borderColor: '#e2e8f0',
                      fontWeight: currentPage === page ? 700 : 400,
                    }}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} style={styles.dots}>...</span>
                )
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    gap: '1rem',
  },
  title: { fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', margin: 0 },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
  },
  empty: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '4rem 2rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    boxShadow: 'var(--card-shadow)',
  },
  paginationInfo: {
    marginBottom: '1rem',
    textAlign: 'right',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  mobileCard: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    padding: '0.9rem 1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: 'var(--card-shadow)',
  },
  mobileImgBox: {
    width: '52px',
    height: '52px',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  mobileImg: { width: '100%', height: '100%', objectFit: 'cover' },
  mobileInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  mobileName: { fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', margin: 0 },
  mobilePrice: { fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, margin: 0 },
  mobileActions: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  tableWrapper: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--card-shadow)',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '1rem 1.25rem',
    textAlign: 'left',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: { borderBottom: '1px solid var(--border-color)' },
  td: { padding: '1.1rem 1.25rem', fontSize: '0.92rem', color: 'var(--text-main)' },
  editBtn: {
    padding: '0.5rem',
    background: 'var(--accent-light)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--accent)',
    display: 'flex',
    transition: 'all 0.2s',
  },
  deleteBtn: {
    padding: '0.5rem',
    background: 'var(--danger-light)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--danger)',
    display: 'flex',
    transition: 'all 0.2s',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)',
    flexWrap: 'wrap',
  },
  numberBtn: {
    minWidth: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#fff',
  },
  dots: {
    padding: '0 0.25rem',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
}