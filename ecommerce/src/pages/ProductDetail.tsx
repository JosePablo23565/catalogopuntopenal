import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/productService'
import { ArrowLeft, Shirt } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  useEffect(() => {
    if (id) {
      getProductById(id).then(p => {
        setProduct(p)
        const main = p.product_images?.find((i: any) => i.is_main)
        setSelectedImg(main?.url || p.product_images?.[0]?.url || '')
        setLoading(false)
      })
    }
  }, [id])

  if (loading) return <div style={styles.loading}>Cargando...</div>
  if (!product) return <div style={styles.loading}>Producto no encontrado</div>

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Volver al catálogo
          </button>
          <div style={styles.logo}>
            <Shirt size={20} color="#1a1a2e" />
            <span style={styles.logoText}>CamisasShop</span>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main style={styles.main}>
        <div style={styles.grid}>

          {/* Galería */}
          <div style={styles.gallery}>
            <div style={styles.mainImgWrapper}>
              {selectedImg ? (
                <img src={selectedImg} alt={product.name} style={styles.mainImg} />
              ) : (
                <div style={styles.noImg}>Sin imagen</div>
              )}
            </div>

            {product.product_images?.length > 1 && (
              <div style={styles.thumbs}>
                {product.product_images.map((img: any) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    style={{
                      ...styles.thumb,
                      border: selectedImg === img.url
                        ? '2px solid #1a1a2e'
                        : '2px solid transparent',
                    }}
                    onClick={() => setSelectedImg(img.url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={styles.info}>
            <h1 style={styles.name}>{product.name}</h1>
            <p style={styles.price}>₡{product.price.toLocaleString()}</p>

            {product.description && (
              <p style={styles.description}>{product.description}</p>
            )}

            {/* Tallas */}
            {product.sizes?.length > 0 && (
              <div style={styles.optionGroup}>
                <label style={styles.optionLabel}>Talla</label>
                <div style={styles.optionRow}>
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      style={{
                        ...styles.optionBtn,
                        background: selectedSize === s ? '#1a1a2e' : '#f0f0f0',
                        color: selectedSize === s ? '#fff' : '#333',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colores */}
            {product.colors?.length > 0 && (
              <div style={styles.optionGroup}>
                <label style={styles.optionLabel}>Color</label>
                <div style={styles.optionRow}>
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      style={{
                        ...styles.optionBtn,
                        background: selectedColor === c ? '#1a1a2e' : '#f0f0f0',
                        color: selectedColor === c ? '#fff' : '#333',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <p style={styles.stock}>
              {product.stock > 0
                ? `✅ ${product.stock} unidades disponibles`
                : '❌ Sin stock'}
            </p>

            <button style={styles.buyBtn}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f7f8fa' },
  loading: { textAlign: 'center', padding: '4rem', color: '#999' },
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
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '0.5rem 0.85rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: '#555',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoText: { fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start',
  },
  gallery: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  mainImgWrapper: {
    width: '100%',
    aspectRatio: '3/4',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#f0f0f0',
  },
  mainImg: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#bbb',
  },
  thumbs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  thumb: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  info: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  name: { fontSize: '1.75rem', fontWeight: 700, color: '#1a1a2e', margin: 0 },
  price: { fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 },
  description: { color: '#666', lineHeight: 1.6, margin: 0 },
  optionGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  optionLabel: { fontWeight: 600, fontSize: '0.875rem', color: '#444' },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  optionBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  stock: { fontSize: '0.9rem', color: '#555', margin: 0 },
  buyBtn: {
    padding: '0.9rem',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
}