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
            {/* Imagen principal - MODIFICADA PARA VERSE COMPLETA */}
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
              fontSize: isMobile ? '1.5rem' : '2rem',
            }}>
              {product.name}
            </h1>

            <p style={{
              ...styles.price,
              fontSize: isMobile ? '1.35rem' : '1.75rem',
            }}>
              ₡{product.price.toLocaleString()}
            </p>

            {product.description && (
              <p style={styles.description}>{product.description}</p>
            )}

            {/* Tallas */}
            {product.sizes?.length > 0 && (
              <div style={styles.optionGroup}>
                <label style={styles.optionLabel}>Talla Seleccionada: <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{selectedSize || 'Ninguna'}</span></label>
                <div style={styles.optionRow}>
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      style={{
                        ...styles.optionBtn,
                        background: selectedSize === s ? 'var(--accent)' : '#fff',
                        color: selectedSize === s ? '#fff' : 'var(--text-main)',
                        borderColor: selectedSize === s ? 'var(--accent)' : 'var(--border-color)',
                        boxShadow: selectedSize === s ? '0 4px 10px rgba(99, 102, 241, 0.2)' : 'none',
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
                <label style={styles.optionLabel}>Color Seleccionado: <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{selectedColor || 'Ninguno'}</span></label>
                <div style={styles.optionRow}>
                  {product.colors.map((c: string) => {
                    const hex = COLOR_MAP[c] || '#cccccc';
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={c}
                        style={{
                          ...styles.colorCircle,
                          background: hex,
                          border: isSelected ? '3px solid var(--accent)' : '1px solid #cbd5e1',
                          outline: isSelected ? '2px solid rgba(99, 102, 241, 0.15)' : 'none',
                          boxShadow: isSelected ? '0 0 12px rgba(99, 102, 241, 0.3)' : 'none',
                        }}
                      >
                        {isSelected && (
                          <span style={{
                            color: c === 'Blanco' || c === 'Amarillo' ? '#0f172a' : '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            lineHeight: 1,
                          }}>✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            <div style={styles.stockBox}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: product.stock > 0 ? 'var(--success)' : 'var(--danger)',
                display: 'inline-block',
              }}></span>
              <p style={{
                ...styles.stock,
                color: product.stock > 0 ? 'var(--success)' : 'var(--danger)',
                fontWeight: 600,
              }}>
                {product.stock > 0
                  ? `${product.stock} unidades disponibles`
                  : 'Agotado'}
              </p>
            </div>

            {/* Botón WhatsApp */}
            <button
              style={{
                ...styles.buyBtn,
                opacity: !settings?.whatsapp_number ? 0.5 : 1,
                cursor: !settings?.whatsapp_number ? 'not-allowed' : 'pointer',
                padding: isMobile ? '0.9rem' : '0.85rem',
                fontSize: isMobile ? '1rem' : '0.95rem',
              }}
              onClick={handleWhatsApp}
              disabled={!settings?.whatsapp_number}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.947 11.5.947c-5.445 0-9.87 4.372-9.875 9.802-.002 1.798.48 3.55 1.4 5.102l-1.02 3.722 3.84-1.002zm11.366-7.44c-.333-.167-1.973-.974-2.28-1.086-.307-.113-.53-.168-.752.167-.222.334-.86 1.086-1.054 1.309-.195.223-.39.247-.723.08-1.558-.78-2.695-1.341-3.766-3.184-.282-.484.282-.449.808-1.503.088-.178.044-.333-.022-.467-.067-.134-.53-1.28-.726-1.751-.19-.46-.388-.396-.53-.404-.136-.008-.293-.01-.45-.01-.156 0-.41.059-.624.293-.214.234-.817.799-.817 1.95 0 1.15.836 2.26.952 2.42.115.158 1.644 2.512 3.985 3.52 1.83.788 2.5.88 3.398.75.524-.078 1.616-.66 1.843-1.298.226-.638.226-1.185.158-1.298-.067-.113-.247-.168-.58-.335z"/>
              </svg>
              <span>Comprar por WhatsApp</span>
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

const COLOR_MAP: Record<string, string> = {
  'Blanco': '#ffffff',
  'Negro': '#0f172a',
  'Azul': '#2563eb',
  'Rojo': '#dc2626',
  'Verde': '#16a34a',
  'Gris': '#64748b',
  'Amarillo': '#facc15',
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
  info: { display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '0.5rem' },
  name: { fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' },
  price: { fontWeight: 800, color: 'var(--accent)', margin: 0 },
  description: { color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' },
  optionGroup: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  optionLabel: { fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' },
  optionRow: { display: 'flex', flexWrap: 'wrap', gap: '0.55rem', alignItems: 'center' },
  optionBtn: {
    padding: '0.45rem 1.1rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    background: '#fff',
    transition: 'all 0.2s',
  },
  colorCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stockBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  stock: { fontSize: '0.92rem', margin: 0 },
  buyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    width: '100%',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.25s',
  },
  noPhone: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    margin: 0,
  },
}