import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, getSettings } from '../services/productService'
import { ArrowLeft, Shirt } from 'lucide-react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    if (id) {
      getProductById(id).then(p => {
        setProduct(p)
        const main = p.product_images?.find((i: any) => i.is_main)
        setSelectedImg(main?.url || p.product_images?.[0]?.url || '')
        setLoading(false)
      })
      getSettings().then(setSettings)
    }
  }, [id])

  const handleWhatsApp = () => {
    if (!settings?.whatsapp_number) return
    const lines = [
      `¡Hola! Me interesa encargar:`,
      ``,
      `👕 *${product.name}*`,
      `💰 Precio: ₡${product.price.toLocaleString()}`,
      selectedSize ? `📏 Talla: ${selectedSize}` : '',
      selectedColor ? `🎨 Color: ${selectedColor}` : '',
      ``,
      `¿Está disponible?`,
    ].filter(Boolean).join('\n')

    const encoded = encodeURIComponent(lines)
    const phone = `${settings.whatsapp_country_code}${settings.whatsapp_number.replace(/\s/g, '')}`
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
  }

  if (loading) return <div style={styles.loading}>Cargando...</div>
  if (!product) return <div style={styles.loading}>Producto no encontrado</div>

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            {isMobile ? 'Volver' : 'Volver al catálogo'}
          </button>
          <div style={styles.logo}>
            <Shirt size={20} color="#1a1a2e" />
            {!isMobile && <span style={styles.logoText}>CamisasShop</span>}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={{
          ...styles.grid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '1.5rem' : '3rem',
        }}>

          {/* ── Galería ── */}
          <div style={styles.gallery}>
            {/* Imagen principal */}
            <div style={{
              ...styles.mainImgWrapper,
              aspectRatio: isMobile ? '4/3' : '3/4',
              borderRadius: isMobile ? '10px' : '14px',
            }}>
              {selectedImg ? (
                <img src={selectedImg} alt={product.name} style={styles.mainImg} />
              ) : (
                <div style={styles.noImg}>Sin imagen</div>
              )}
            </div>

            {/* Miniaturas */}
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

          {/* ── Info ── */}
          <div style={styles.info}>
            <h1 style={{
              ...styles.name,
              fontSize: isMobile ? '1.4rem' : '1.75rem',
            }}>
              {product.name}
            </h1>

            <p style={{
              ...styles.price,
              fontSize: isMobile ? '1.3rem' : '1.5rem',
            }}>
              ₡{product.price.toLocaleString()}
            </p>

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
            <p style={{
              ...styles.stock,
              color: product.stock > 0 ? '#059669' : '#dc2626',
            }}>
              {product.stock > 0
                ? `✅ ${product.stock} unidades disponibles`
                : '❌ Sin stock'}
            </p>

            {/* Botón WhatsApp */}
            <button
              style={{
                ...styles.buyBtn,
                opacity: !settings?.whatsapp_number ? 0.5 : 1,
                cursor: !settings?.whatsapp_number ? 'not-allowed' : 'pointer',
                padding: isMobile ? '1rem' : '0.9rem',
                fontSize: isMobile ? '1.05rem' : '1rem',
              }}
              onClick={handleWhatsApp}
              disabled={!settings?.whatsapp_number}
            >
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              Encargar por WhatsApp
            </button>

            {!settings?.whatsapp_number && (
              <p style={styles.noPhone}>
                El administrador aún no configuró el número de WhatsApp
              </p>
            )}
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
    padding: '0.85rem 1.25rem',
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
    padding: '0.45rem 0.85rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: '#555',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoText: { fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e' },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem 1.25rem',
  },
  grid: {
    display: 'grid',
    alignItems: 'start',
  },
  gallery: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  mainImgWrapper: {
    width: '100%',
    overflow: 'hidden',
    background: '#f0f0f0',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#bbb',
  },
  thumbs: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  thumb: {
    objectFit: 'cover',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  info: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  name: { fontWeight: 700, color: '#1a1a2e', margin: 0 },
  price: { fontWeight: 800, color: '#1a1a2e', margin: 0 },
  description: { color: '#666', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' },
  optionGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  optionLabel: { fontWeight: 600, fontSize: '0.875rem', color: '#444' },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  optionBtn: {
    padding: '0.45rem 1rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  stock: { fontSize: '0.9rem', margin: 0 },
  buyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#25d366',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    width: '100%',
  },
  noPhone: {
    fontSize: '0.8rem',
    color: '#aaa',
    textAlign: 'center',
    margin: 0,
  },
}