import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { createProduct, getProductById, updateProduct } from '../services/productService'
import { uploadImage } from '../services/productService'
import { ArrowLeft, Save, Upload, Trash2, Star } from 'lucide-react'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = ['Blanco', 'Negro', 'Azul', 'Rojo', 'Verde', 'Gris', 'Amarillo']

interface LocalImage {
  file: File
  preview: string
  isMain: boolean
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [localImages, setLocalImages] = useState<LocalImage[]>([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sizes: [] as string[],
    colors: [] as string[],
  })

  // Para edición: imágenes ya guardadas
  const [savedImages, setSavedImages] = useState<any[]>([])

  // Responsive helper
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 600)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isEditing) {
      setLoading(true)
      getProductById(id).then(product => {
        setForm({
          name: product.name,
          description: product.description || '',
          price: String(product.price),
          stock: String(product.stock),
          sizes: product.sizes || [],
          colors: product.colors || [],
        })
        setSavedImages(product.product_images || [])
        setLoading(false)
      })
    }
  }, [id])

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter(i => i !== item) : [...list, item]

  // Agregar imágenes locales antes de guardar
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages: LocalImage[] = files
      .filter(f => f.size <= 5 * 1024 * 1024)
      .map((file, i) => ({
        file,
        preview: URL.createObjectURL(file),
        isMain: localImages.length === 0 && i === 0,
      }))

    if (files.some(f => f.size > 5 * 1024 * 1024)) {
      setError('Algunas imágenes superan 5MB y fueron ignoradas')
    } else {
      setError('')
    }

    setLocalImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const handleRemoveLocal = (index: number) => {
    setLocalImages(prev => {
      const updated = prev.filter((_, i) => i !== index)
      // Si se eliminó la principal y quedan imágenes, la primera pasa a ser principal
      if (prev[index].isMain && updated.length > 0) {
        updated[0].isMain = true
      }
      return updated
    })
  }

  const handleSetMainLocal = (index: number) => {
    setLocalImages(prev =>
      prev.map((img, i) => ({ ...img, isMain: i === index }))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        sizes: form.sizes,
        colors: form.colors,
      }

      let productId = id

      if (isEditing) {
        await updateProduct(id, payload)
      } else {
        const created = await createProduct(payload)
        productId = created.id
      }

      // Subir imágenes nuevas
      for (const img of localImages) {
        const url = await uploadImage(img.file, productId!)
        await import('../services/productService').then(m =>
          m.saveProductImage(productId!, url, img.isMain)
        )
      }

      navigate('/admin/productos')
    } catch (err: any) {
      setError('Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AdminLayout><p>Cargando...</p></AdminLayout>

  return (
    <AdminLayout>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin/productos')}>
          <ArrowLeft size={18} /> Volver
        </button>
        <h1 style={styles.title}>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* ── SECCIÓN IMÁGENES ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🖼️ Imágenes</h2>

          <label style={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddImages}
              style={{ display: 'none' }}
            />
            <Upload size={26} color="#888" />
            <p style={styles.uploadText}>Hacé click para agregar imágenes</p>
            <span style={styles.uploadHint}>PNG, JPG hasta 5MB · Podés seleccionar varias</span>
          </label>

          {/* Previews locales */}
          {localImages.length > 0 && (
            <div style={styles.grid}>
              {localImages.map((img, i) => (
                <div key={i} style={styles.imgCard}>
                  <img src={img.preview} alt="" style={styles.img} />
                  {img.isMain && <div style={styles.mainBadge}>Principal</div>}
                  <div style={styles.imgActions}>
                    {!img.isMain && (
                      <button
                        type="button"
                        style={styles.starBtn}
                        onClick={() => handleSetMainLocal(i)}
                        title="Marcar como principal"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      style={styles.deleteImgBtn}
                      onClick={() => handleRemoveLocal(i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Imágenes ya guardadas (modo edición) */}
          {savedImages.length > 0 && (
            <>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '0.5rem 0' }}>
                Imágenes actuales:
              </p>
              <div style={styles.grid}>
                {savedImages.map(img => (
                  <div key={img.id} style={styles.imgCard}>
                    <img src={img.url} alt="" style={styles.img} />
                    {img.is_main && <div style={styles.mainBadge}>Principal</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── SECCIÓN INFO ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📝 Información del producto</h2>

          <div style={styles.field}>
            <label style={styles.label}>Nombre *</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Descripción</label>
            <textarea
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{
  ...styles.row,
  flexDirection: isMobile ? 'column' : 'row',
}}>
  <div style={{ ...styles.field, flex: 1 }}>
    <label style={styles.label}>Precio (₡) *</label>
    <input
      style={styles.input}
      type="number"
      min="0"
      step="0.01"
      value={form.price}
      onChange={e => setForm({ ...form, price: e.target.value })}
      required
    />
  </div>
  <div style={{ ...styles.field, flex: 1 }}>
    <label style={styles.label}>Stock *</label>
    <input
      style={styles.input}
      type="number"
      min="0"
      value={form.stock}
      onChange={e => setForm({ ...form, stock: e.target.value })}
      required
    />
  </div>
</div>

          <div style={styles.field}>
            <label style={styles.label}>Tallas disponibles</label>
            <div style={styles.tagGroup}>
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setForm({ ...form, sizes: toggleItem(form.sizes, size) })}
                  style={{
                    ...styles.tag,
                    background: form.sizes.includes(size) ? '#1a1a2e' : '#f0f0f0',
                    color: form.sizes.includes(size) ? '#fff' : '#333',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Colores disponibles</label>
            <div style={styles.tagGroup}>
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, colors: toggleItem(form.colors, color) })}
                  style={{
                    ...styles.tag,
                    background: form.colors.includes(color) ? '#1a1a2e' : '#f0f0f0',
                    color: form.colors.includes(color) ? '#fff' : '#333',
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.saveBtn} disabled={saving}>
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>
    </AdminLayout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  },
  form: {
    background: '#fff',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f0f0f0',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '1.75rem',
    border: '2px dashed #ddd',
    borderRadius: '10px',
    cursor: 'pointer',
    background: '#fafafa',
  },
  uploadText: {
    color: '#555',
    fontSize: '0.9rem',
    margin: 0,
  },
  uploadHint: {
    color: '#aaa',
    fontSize: '0.78rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
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
    fontSize: '0.68rem',
    padding: '2px 7px',
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
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#444',
  },
  input: {
    padding: '0.6rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    outline: 'none',
  },
  tagGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.875rem',
  },
}