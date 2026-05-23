import { useNavigate } from 'react-router-dom'

interface Props {
  product: any
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()
  const mainImage = product.product_images?.find((img: any) => img.is_main)
  const fallback = product.product_images?.[0]

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/producto/${product.id}`)}
    >
      <div style={styles.imgWrapper}>
        {mainImage || fallback ? (
          <img
            src={mainImage?.url || fallback?.url}
            alt={product.name}
            style={styles.img}
          />
        ) : (
          <div style={styles.noImg}>Sin imagen</div>
        )}
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>

        {product.sizes?.length > 0 && (
          <div style={styles.sizes}>
            {product.sizes.map((s: string) => (
              <span key={s} style={styles.sizeTag}>{s}</span>
            ))}
          </div>
        )}

        <p style={styles.price}>₡{product.price.toLocaleString()}</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  imgWrapper: {
    width: '100%',
    aspectRatio: '3/4',
    overflow: 'hidden',
    background: '#f5f5f5',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#bbb',
    fontSize: '0.85rem',
  },
  info: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  name: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a1a2e',
    margin: 0,
  },
  sizes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
  },
  sizeTag: {
    fontSize: '0.7rem',
    padding: '2px 8px',
    background: '#f0f0f0',
    borderRadius: '20px',
    color: '#555',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  },
}