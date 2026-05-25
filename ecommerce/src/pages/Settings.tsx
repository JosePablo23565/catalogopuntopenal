import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { getSettings, updateSettings } from '../services/productService'
import { Save, CheckCircle } from 'lucide-react'

const COUNTRIES = [
  { name: 'Costa Rica', code: '506', flag: '🇨🇷' },
  { name: 'México', code: '52', flag: '🇲🇽' },
  { name: 'Guatemala', code: '502', flag: '🇬🇹' },
  { name: 'Honduras', code: '504', flag: '🇭🇳' },
  { name: 'El Salvador', code: '503', flag: '🇸🇻' },
  { name: 'Nicaragua', code: '505', flag: '🇳🇮' },
  { name: 'Panamá', code: '507', flag: '🇵🇦' },
  { name: 'Colombia', code: '57', flag: '🇨🇴' },
  { name: 'Venezuela', code: '58', flag: '🇻🇪' },
  { name: 'Ecuador', code: '593', flag: '🇪🇨' },
  { name: 'Perú', code: '51', flag: '🇵🇪' },
  { name: 'Chile', code: '56', flag: '🇨🇱' },
  { name: 'Argentina', code: '54', flag: '🇦🇷' },
  { name: 'Uruguay', code: '598', flag: '🇺🇾' },
  { name: 'Brasil', code: '55', flag: '🇧🇷' },
  { name: 'España', code: '34', flag: '🇪🇸' },
  { name: 'Estados Unidos', code: '1', flag: '🇺🇸' },
]

export default function Settings() {
  const [countryCode, setCountryCode] = useState('506')
  const [number, setNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSettings().then(data => {
      setCountryCode(data.whatsapp_country_code || '506')
      setNumber(data.whatsapp_number || '')
      setLoading(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!number.trim()) {
      setError('Ingresá un número de WhatsApp')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateSettings(countryCode, number.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

 // const selectedCountry = COUNTRIES.find(c => c.code === countryCode)
  const preview = number ? `+${countryCode} ${number}` : '—'
  const whatsappLink = number
    ? `https://wa.me/${countryCode}${number.replace(/\s/g, '')}`
    : null

  return (
    <AdminLayout>
      <h1 style={styles.title}>Configuración</h1>
      <p style={styles.subtitle}>Ajustes generales de tu tienda</p>

      {loading ? (
        <p style={{ color: '#999' }}>Cargando...</p>
      ) : (
        <form onSubmit={handleSave} style={styles.card}>
          <h2 style={styles.sectionTitle}>📱 WhatsApp de contacto</h2>
          <p style={styles.hint}>
            Este número recibirá los pedidos cuando un cliente haga click en "Encargar por WhatsApp"
          </p>

          {/* País */}
          <div style={styles.field}>
            <label style={styles.label}>País</label>
            <select
              style={styles.select}
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} (+{c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Número */}
          <div style={styles.field}>
            <label style={styles.label}>Número de WhatsApp</label>
            <div style={styles.inputRow}>
              <span style={styles.prefix}>+{countryCode}</span>
              <input
                style={styles.input}
                type="tel"
                placeholder="88887777"
                value={number}
                onChange={e => setNumber(e.target.value.replace(/[^0-9\s]/g, ''))}
              />
            </div>
            <p style={styles.inputHint}>Solo números, sin el código de país</p>
          </div>

          {/* Preview */}
          <div style={styles.preview}>
            <p style={styles.previewLabel}>Vista previa del número</p>
            <p style={styles.previewNumber}>{preview}</p>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.testLink}
              >
                Probar enlace →
              </a>
            )}
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {saved && (
            <div style={styles.successMsg}>
              <CheckCircle size={16} color="#059669" />
              <span>¡Guardado correctamente!</span>
            </div>
          )}

          <button type="submit" style={styles.saveBtn} disabled={saving}>
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </form>
      )}
    </AdminLayout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  title: { fontSize: '1.75rem', fontWeight: 700, color: '#1a1a2e', margin: 0 },
  subtitle: { color: '#888', marginTop: '0.25rem', marginBottom: '1.75rem' },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #f0f0f0',
  },
  hint: {
    fontSize: '0.875rem',
    color: '#888',
    margin: 0,
    lineHeight: 1.5,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#444',
  },
  select: {
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  prefix: {
    padding: '0.65rem 0.85rem',
    background: '#f5f5f5',
    color: '#555',
    fontWeight: 600,
    fontSize: '0.9rem',
    borderRight: '1px solid #ddd',
    whiteSpace: 'nowrap',
  },
  input: {
    flex: 1,
    padding: '0.65rem 0.85rem',
    border: 'none',
    fontSize: '0.95rem',
    outline: 'none',
  },
  inputHint: {
    fontSize: '0.78rem',
    color: '#aaa',
    margin: 0,
  },
  preview: {
    background: '#f7f8fa',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  previewLabel: {
    fontSize: '0.78rem',
    color: '#888',
    margin: 0,
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  previewNumber: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  },
  testLink: {
    fontSize: '0.85rem',
    color: '#25d366',
    fontWeight: 600,
    textDecoration: 'none',
  },
  successMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#059669',
    fontSize: '0.875rem',
    background: '#d1fae5',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.875rem',
    background: '#fee2e2',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    margin: 0,
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
}