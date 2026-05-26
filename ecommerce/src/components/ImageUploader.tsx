import { useState } from 'react'
import { Upload, Trash2, Star } from 'lucide-react'
import { uploadImage, saveProductImage, deleteProductImage, setMainImage } from '../services/productService'
import { processImage } from '../hooks/useImageProcessor'
import type { ProductImage } from '../types/product'

interface Props {
  productId: string
  images: ProductImage[]
  onUpdate: () => void
}

export default function ImageUploader({ productId, images, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    setError('')

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (file.size > 20 * 1024 * 1024) {
          setError(`"${file.name}" supera 20 MB y fue ignorada`)
          continue
        }

        setProgress(`Procesando ${i + 1} de ${files.length}...`)

        // Recortar en cuadrado y comprimir antes de subir
        const processed = await processImage(file, {
          maxSize: 1200,
          quality: 0.82,
          format: 'image/webp',
        })

        setProgress(`Subiendo ${i + 1} de ${files.length}...`)
        const url = await uploadImage(processed, productId)
        const isMain = images.length === 0 && i === 0
        await saveProductImage(productId, url, isMain)
      }
      onUpdate()
    } catch {
      setError('Error al subir imagen')
    } finally {
      setUploading(false)
      setProgress('')
      e.target.value = ''
    }
  }

  const handleDelete = async (image: ProductImage) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    try {
      await deleteProductImage(image.id, image.url)
      onUpdate()
    } catch {
      setError('Error al eliminar imagen')
    }
  }

  const handleSetMain = async (image: ProductImage) => {
    try {
      await setMainImage(image.id, productId)
      onUpdate()
    } catch {
      setError('Error al actualizar imagen principal')
    }
  }

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.sectionTitle}>Imágenes del producto</h3>

      <label style={{
        ...styles.uploadArea,
        opacity: uploading ? 0.6 : 1,
        cursor: uploading ? 'not-allowed' : 'pointer',
      }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        <Upload size={28} color="#888" />
        <p style={styles.uploadText}>
          {uploading ? progress : 'Hacé click o arrastrá imágenes aquí'}
        </p>
        <span style={styles.uploadHint}>
          {uploading
            ? 'Recortando al cuadrado y comprimiendo para web...'
            : 'PNG, JPG hasta 20MB · Se recortan en cuadrado y se comprimen automáticamente'}
        </span>
      </label>

      {error && <p style={styles.error}>{error}</p>}

      {images.length > 0 && (
        <div style={styles.grid}>
          {images.map(img => (
            <div key={img.id} style={styles.imgCard}>
              <img src={img.url} alt="" style={styles.img} />

              {img.is_main && (
                <div style={styles.mainBadge}>Principal</div>
              )}

              <div style={styles.imgActions}>
                {!img.is_main && (
                  <button
                    style={styles.starBtn}
                    onClick={() => handleSetMain(img)}
                    title="Marcar como principal"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  style={styles.deleteImgBtn}
                  onClick={() => handleDelete(img)}
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#444',
    margin: 0,
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '2rem',
    border: '2px dashed #ddd',
    borderRadius: '10px',
    cursor: 'pointer',
    background: '#fafafa',
    transition: 'border-color 0.2s',
  },
  uploadText: {
    color: '#666',
    fontSize: '0.9rem',
    margin: 0,
  },
  uploadHint: {
    color: '#aaa',
    fontSize: '0.8rem',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: '0.85rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '0.75rem',
  },
  imgCard: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #eee',
    aspectRatio: '1',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mainBadge: {
    position: 'absolute',
    top: '6px',
    left: '6px',
    background: '#1a1a2e',
    color: '#fff',
    fontSize: '0.7rem',
    padding: '2px 8px',
    borderRadius: '20px',
    fontWeight: 600,
  },
  imgActions: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    display: 'flex',
    gap: '0.3rem',
  },
  starBtn: {
    background: '#fffbe6',
    border: 'none',
    borderRadius: '6px',
    padding: '4px',
    cursor: 'pointer',
    color: '#d97706',
    display: 'flex',
  },
  deleteImgBtn: {
    background: '#fff0f0',
    border: 'none',
    borderRadius: '6px',
    padding: '4px',
    cursor: 'pointer',
    color: '#e53e3e',
    display: 'flex',
  },
}
