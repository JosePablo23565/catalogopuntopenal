import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { createProduct, getProductById, updateProduct } from '../services/productService'
import { uploadImage } from '../services/productService'
import { processImage } from '../hooks/useImageProcessor'
import { ArrowLeft, Save, Upload, Trash2, Star } from 'lucide-react'

// ============================================
// OPCIONES PARA LOS FILTROS
// ============================================

// FUTBOL
const FOOTBALL_LEAGUES = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1'
]

// NBA
const NBA_TEAMS = [
  'Lakers',
  'Celtics',
  'Bulls',
  'Warriors',
  'Heat',
  'Knicks'
]

// F1
const F1_TEAMS = [
  'Red Bull',
  'Ferrari',
  'Mercedes',
  'McLaren',
  'Aston Martin',
  'Alpine'
]

// CATEGORIAS (siempre visibles)
const CATEGORIES = ['Retro', 'Resto del Mundo', 'Selecciones']

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
    price: '',
    league: '',
    category: '',
    season: ''
  })

  const [savedImages, setSavedImages] = useState<any[]>([])
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
          price: String(product.price),
          league: product.league || '',
          category: product.category || '',
          season: product.season || ''
        })
        setSavedImages(product.product_images || [])
        setLoading(false)
      })
    }
  }, [id])

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages: LocalImage[] = files
      .filter(f => f.size <= 20 * 1024 * 1024)
      .map((file, i) => ({
        file,
        preview: URL.createObjectURL(file),
        isMain: localImages.length === 0 && i === 0,
      }))

    if (files.some(f => f.size > 20 * 1024 * 1024)) {
      setError('Algunas imágenes superan 20MB y fueron ignoradas')
    } else {
      setError('')
    }

    setLocalImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const handleRemoveLocal = (index: number) => {
    setLocalImages(prev => {
      const updated = prev.filter((_, i) => i !== index)
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
        price: parseFloat(form.price),
        league: form.league,
        category: form.category,
        season: form.season,
      }

      let productId = id

      if (isEditing) {
        await updateProduct(id, payload)
      } else {
        const created = await createProduct(payload)
        productId = created.id
      }

      for (const img of localImages) {
        const processed = await processImage(img.file, {
          maxSize: 1200,
          quality: 0.82,
          format: 'image/webp',
        })
        const url = await uploadImage(processed, productId!)
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

        {/* SECCION IMAGENES */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Imagenes</h2>

          <label style={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddImages}
              style={{ display: 'none' }}
            />
            <Upload size={26} color="#888" />
            <p style={styles.uploadText}>Hace click para agregar imagenes</p>
            <span style={styles.uploadHint}>PNG, JPG hasta 20MB · Se recortan en cuadrado y comprimen automaticamente</span>
          </label>

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

          {savedImages.length > 0 && (
            <>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '0.5rem 0' }}>
                Imagenes actuales:
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

        {/* SECCION INFO */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Informacion del producto</h2>

          <div style={styles.field}>
            <label style={styles.label}>Nombre del producto *</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div style={styles.field}>
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

          {/* DEPORTE / LIGA - BOTONES POR CATEGORIA */}
          <div style={styles.field}>
            <label style={styles.label}>Deporte / Liga</label>
            
            {/* FUTBOL */}
            <div style={styles.sportGroup}>
              <div style={styles.sportTitle}>Futbol</div>
              <div style={styles.filterButtons}>
                {FOOTBALL_LEAGUES.map(league => (
                  <button
                    key={league}
                    type="button"
                    onClick={() => setForm({ ...form, league })}
                    style={{
                      ...styles.filterChip,
                      background: form.league === league ? 'var(--accent)' : '#f1f5f9',
                      color: form.league === league ? '#fff' : 'var(--text-main)',
                    }}
                  >
                    {league}
                  </button>
                ))}
              </div>
            </div>

            {/* NBA */}
            <div style={styles.sportGroup}>
              <div style={styles.sportTitle}>NBA</div>
              <div style={styles.filterButtons}>
                {NBA_TEAMS.map(team => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => setForm({ ...form, league: team })}
                    style={{
                      ...styles.filterChip,
                      background: form.league === team ? 'var(--accent)' : '#f1f5f9',
                      color: form.league === team ? '#fff' : 'var(--text-main)',
                    }}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            {/* F1 */}
            <div style={styles.sportGroup}>
              <div style={styles.sportTitle}>F1</div>
              <div style={styles.filterButtons}>
                {F1_TEAMS.map(team => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => setForm({ ...form, league: team })}
                    style={{
                      ...styles.filterChip,
                      background: form.league === team ? 'var(--accent)' : '#f1f5f9',
                      color: form.league === team ? '#fff' : 'var(--text-main)',
                    }}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            {/* Boton para limpiar seleccion */}
            {form.league && (
              <button
                type="button"
                onClick={() => setForm({ ...form, league: '' })}
                style={styles.clearLeagueBtn}
              >
                Limpiar seleccion
              </button>
            )}
          </div>

          {/* CATEGORIA - TODAS SIEMPRE VISIBLES */}
          <div style={styles.field}>
            <label style={styles.label}>Categoria</label>
            <div style={styles.filterButtons}>
              <button
                type="button"
                onClick={() => setForm({ ...form, category: '' })}
                style={{
                  ...styles.filterChip,
                  background: form.category === '' ? 'var(--accent)' : '#f1f5f9',
                  color: form.category === '' ? '#fff' : 'var(--text-main)',
                }}
              >
                Ninguna
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  style={{
                    ...styles.filterChip,
                    background: form.category === cat ? 'var(--accent)' : '#f1f5f9',
                    color: form.category === cat ? '#fff' : 'var(--text-main)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* TEMPORADA */}
          <div style={styles.field}>
            <label style={styles.label}>Temporada</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Ej: 2024-2025, Otono 2024, Edicion Limitada"
              value={form.season}
              onChange={e => setForm({ ...form, season: e.target.value })}
            />
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
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: '#fff',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.5rem 0.9rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    boxShadow: '0 2px 5px rgba(15,23,42,0.02)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  form: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    boxShadow: 'var(--card-shadow)',
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.25rem',
    border: '1px solid var(--border-color)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sectionTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: 'var(--text-main)',
    margin: 0,
    paddingBottom: '0.65rem',
    borderBottom: '1px solid var(--border-color)',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '2.25rem',
    border: '2px dashed var(--border-color)',
    borderRadius: '12px',
    cursor: 'pointer',
    background: 'var(--bg-main)',
    transition: 'all 0.25s',
  },
  uploadText: {
    color: 'var(--text-main)',
    fontSize: '0.92rem',
    fontWeight: 600,
    margin: 0,
  },
  uploadHint: {
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: '0.85rem',
  },
  imgCard: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    aspectRatio: '1',
    boxShadow: '0 2px 6px rgba(15,23,42,0.02)',
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
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '0.65rem',
    padding: '3px 8px',
    borderRadius: '20px',
    boxShadow: '0 2px 6px rgba(99,102,241,0.3)',
  },
  imgActions: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    display: 'flex',
    gap: '0.35rem',
  },
  starBtn: {
    background: '#fffbe6',
    border: '1px solid #ffe58f',
    borderRadius: '6px',
    padding: '5px',
    cursor: 'pointer',
    color: '#d97706',
    display: 'flex',
  },
  deleteImgBtn: {
    background: 'var(--danger-light)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: '6px',
    padding: '5px',
    cursor: 'pointer',
    color: 'var(--danger)',
    display: 'flex',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  label: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: 'var(--text-main)',
  },
  input: {
    padding: '0.7rem 0.95rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(15,23,42,0.01)',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.8rem',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.98rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
  },
  error: {
    color: 'var(--danger)',
    fontSize: '0.88rem',
    background: 'var(--danger-light)',
    padding: '0.5rem 0.85rem',
    borderRadius: '6px',
    border: '1px solid rgba(239,68,68,0.15)',
    margin: 0,
  },
  sportGroup: {
    marginBottom: '1rem',
  },
  sportTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  filterChip: {
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#f1f5f9',
  },
  clearLeagueBtn: {
    marginTop: '0.5rem',
    padding: '0.4rem 0.8rem',
    background: 'transparent',
    border: '1px solid var(--danger)',
    borderRadius: '8px',
    color: 'var(--danger)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
  },
}