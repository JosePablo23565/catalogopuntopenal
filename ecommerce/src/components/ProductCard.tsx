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
      style={styles.card}
      onClick={() => navigate(`/producto/${product.id}`)}
    >
      <div style={styles.imgWrapper}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} style={styles.img} />
        ) : (
          <div style={styles.noImg}>
            <span style={{ fontSize: '2rem' }}>👕</span>
            <span style={{ fontSize: '0.8rem', color: '#bbb' }}>Sin imagen</span>
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
          <span style={styles.viewBtn}>Ver →</span>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  imgWrapper: {
    width: '100%',
    aspectRatio: '3/4',
    overflow: 'hidden',
    background: '#f5f5f5',
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.35s ease',
    display: 'block',
  },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#fafafa',
  },
  outOfStock: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '20px',
    letterSpacing: '0.5px',
  },
  info: {
    padding: '1rem 1.1rem 1.1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  colors: {
    fontSize: '0.78rem',
    color: '#999',
  },
  sizes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
  },
  sizeTag: {
    fontSize: '0.68rem',
    padding: '2px 7px',
    background: '#f0f0f0',
    borderRadius: '20px',
    color: '#666',
    fontWeight: 500,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.25rem',
  },
  price: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#1a1a2e',
  },
  viewBtn: {
    fontSize: '0.8rem',
    color: '#888',
    fontWeight: 500,
  },
}
