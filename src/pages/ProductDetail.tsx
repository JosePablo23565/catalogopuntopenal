import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/productService'
import { ArrowLeft, Shirt } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useIsMobile } from '../hooks/useIsMobile'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState('')

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

  const handleWhatsApp = () => {
    const phone = '50687623104'
    const seasonText = product.season ? ` ${product.season}` : ''
    const message = `Estoy interesado en la camiseta ${product.name}${seasonText}`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
  }

  if (loading) return <div style={styles.loading}>Cargando...</div>
  if (!product) return <div style={styles.loading}>Producto no encontrado</div>

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            {isMobile ? 'Volver' : 'Volver al catálogo'}
          </button>
          <div style={styles.logo}>
            <Shirt size={20} color="#1a1a2e" />
            {!isMobile && <span style={styles.logoText}>PUNTO PENAL</span>}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={{
          ...styles.grid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '1.5rem' : '3rem',
        }}>
          <div style={styles.gallery}>
            <div style={{
              ...styles.mainImgWrapper,
              aspectRatio: isMobile ? '1/1' : '4/5',
              borderRadius: isMobile ? '10px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
            }}>
              {selectedImg ? (
                <img 
                  src={selectedImg} 
                  alt={product.name} 
                  style={styles.mainImg}
                />
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
                    onClick={() => setSelectedImg(img.url)}
                    style={{
                      ...styles.thumb,
                      border: selectedImg === img.url
                        ? '2px solid #1a1a2e'
                        : '2px solid transparent',
                      width: isMobile ? '60px' : '72px',
                      height: isMobile ? '60px' : '72px',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={styles.info}>
            <h1 style={styles.name}>{product.name}</h1>

            {product.league && (
              <p style={styles.league}>{product.league}</p>
            )}

            {product.season && (
              <p style={styles.season}>Temporada {product.season}</p>
            )}

            <p style={styles.price}>₡{product.price.toLocaleString()}</p>

            <button style={styles.whatsappBtn} onClick={handleWhatsApp}>
              <FaWhatsapp size={22} />
              <span>Comprar por WhatsApp</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'var(--bg-main)' },
  loading: { textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)', fontWeight: 500 },
  header: {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--glass-border)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 1px 10px rgba(15, 23, 42, 0.02)',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.85rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: '#fff',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '0.5rem 0.95rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    boxShadow: '0 2px 5px rgba(15, 23, 42, 0.02)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoText: { fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
  },
  grid: {
    display: 'grid',
    alignItems: 'start',
    background: '#fff',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--card-shadow)',
  },
  gallery: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  mainImgWrapper: {
    width: '100%',
    overflow: 'hidden',
    background: '#f8fafc',
    border: '1px solid var(--border-color)',
  },
  mainImg: {
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    margin: '0 auto',
  },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontWeight: 500,
    background: '#f1f5f9',
  },
  thumbs: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  thumb: {
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  info: { display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem' },
  name: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    lineHeight: 1.2,
  },
  league: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: 0,
  },
  season: {
    fontSize: '0.8rem',
    color: '#64748b',
    margin: 0,
  },
  price: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: '0.5rem 0',
  },
  whatsappBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    background: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '0.9rem',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
}