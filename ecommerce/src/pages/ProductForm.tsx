import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { createProduct, getProductById, updateProduct } from '../services/productService'
import { ArrowLeft, Save } from 'lucide-react'
import ImageUploader from '../components/ImageUploader'
import type { ProductImage } from '../types/product'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = ['Blanco', 'Negro', 'Azul', 'Rojo', 'Verde', 'Gris', 'Amarillo']

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<ProductImage[]>([])
const [savedProductId, setSavedProductId] = useState<string | null>(id || null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sizes: [] as string[],
    colors: [] as string[],
  })

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
      setImages(product.product_images || [])
      setSavedProductId(product.id)
      setLoading(false)
    })
  }
}, [id])

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter(i => i !== item) : [...list, item]

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

    if (isEditing) {
      await updateProduct(id, payload)
    } else {
      const created = await createProduct(payload)
      setSavedProductId(created.id)
      setSaving(false)
      return // Quedamos en el form para subir imágenes
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
        {/* Nombre */}
        <div style={styles.field}>
          <label style={styles.label}>Nombre *</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Descripción */}
        <div style={styles.field}>
          <label style={styles.label}>Descripción</label>
          <textarea
            style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Precio y Stock */}
        <div style={styles.row}>
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

        {/* Tallas */}
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

        {/* Colores */}
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
    gap: '1.25rem',
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