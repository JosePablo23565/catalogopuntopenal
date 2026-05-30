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
      style={styles.card}
    >
      {/* Contenedor de imagen con tamaño FIJO */}
      <div style={styles.imgWrapper}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            style={styles.img}
          />
        ) : (
          <div style={styles.noImg}>
            <span style={{ fontSize: '2rem' }}>👕</span>
          </div>
        )}
      </div>

      {/* Contenedor de texto con altura FIJA */}
      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>

        {product.league && (
          <span style={styles.league}>{product.league}</span>
        )}

        {product.season && (
          <p style={styles.season}>{product.season}</p>
        )}

        <p style={styles.price}>₡{product.price.toLocaleString()}</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    cursor: 'pointer',
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imgWrapper: {
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: 'transform 0.3s ease',
  },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
  },
  info: {
    padding: '0.9rem 1rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    flex: 1,
  },
  name: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.25',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  league: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  season: {
    fontSize: '0.7rem',
    fontWeight: 400,
    color: '#64748b',
    margin: 0,
  },
  price: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0.5rem 0 0 0',
  },
}

const styleSheet = document.createElement("style")
styleSheet.textContent = `
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
  }
  .product-card:hover .product-card-img {
    transform: scale(1.05);
  }
`
document.head.appendChild(styleSheet)