import { useNavigate } from 'react-router-dom'

interface Props {
  product: any
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()
  const mainImage = product.product_images?.find((img: any) => img.is_main)
  const fallback = product.product_images?.[0]
  const imageUrl = mainImage?.url || fallback?.url

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/producto/${product.id}`)}
    >
      <div style={styles.imgWrapper}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="product-card-img" />
        ) : (
          <div style={styles.noImg}>
            <span style={{ fontSize: '2.5rem' }}>👕</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sin imagen</span>
          </div>
        )}

        {product.stock === 0 && (
          <div style={styles.outOfStock}>Agotado</div>
        )}
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>

        {product.colors?.length > 0 && (
          <p style={styles.colors}>{product.colors.join(' · ')}</p>
        )}

        {product.sizes?.length > 0 && (
          <div style={styles.sizes}>
            {product.sizes.map((s: string) => (
              <span key={s} style={styles.sizeTag}>{s}</span>
            ))}
          </div>
        )}

        <div style={styles.footer}>
          <p style={styles.price}>₡{product.price.toLocaleString()}</p>
          <span style={styles.viewBtn}>Ver detalles →</span>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  imgWrapper: {
    width: '100%',
    aspectRatio: '3/4',
    overflow: 'hidden',
    background: '#f1f5f9',
    position: 'relative',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
  },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#f8fafc',
  },
  outOfStock: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(239, 68, 68, 0.9)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '20px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
  },
  info: {
    padding: '1.1rem 1.2rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  name: {
    fontSize: '0.98rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    lineHeight: '1.3',
  },
  colors: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  sizes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    marginTop: '0.1rem',
  },
  sizeTag: {
    fontSize: '0.7rem',
    padding: '3px 8px',
    background: 'var(--bg-main)',
    borderRadius: '6px',
    color: 'var(--text-muted)',
    fontWeight: 600,
    border: '1px solid var(--border-color)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(226, 232, 240, 0.4)',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--accent)',
  },
  viewBtn: {
    fontSize: '0.8rem',
    color: 'var(--accent)',
    fontWeight: 600,
  },
}
