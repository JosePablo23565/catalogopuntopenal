import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Shirt } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Si ya hay sesión activa, redirigir directo al admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin')
    })

    // Recuperar email guardado si eligió recordar
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRemember(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas')
    } else {
      // Guardar o limpiar email según checkbox
      if (remember) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }
      navigate('/admin')
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoBox}>
          <div style={styles.logoIconBg}>
            <Shirt size={28} color="#fff" />
          </div>
          <h2 style={styles.title}>CamisasAdmin</h2>
        </div>

        <p style={styles.subtitle}>Ingresá a tu panel de control</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              placeholder="admin@ejemplo.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Recordar usuario */}
          <label style={styles.rememberRow}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.rememberText}>Recordar mi usuario</span>
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <button
            type="button"
            style={styles.catalogBtn}
            onClick={() => navigate('/')}
          >
            ← Volver al catálogo
          </button>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.16) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.12) 0%, transparent 45%), #070a13',
    padding: '1.5rem',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '3rem 2.5rem',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '420px',
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.65rem',
    marginBottom: '0.65rem',
  },
  logoIconBg: {
    background: 'var(--accent)',
    padding: '0.45rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginBottom: '2rem',
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  label: {
    fontWeight: 700,
    fontSize: '0.85rem',
    color: '#cbd5e1',
  },
  input: {
    padding: '0.7rem 0.95rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
  },
  rememberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    cursor: 'pointer',
    marginTop: '0.1rem',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: 'var(--accent)',
  },
  rememberText: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontWeight: 500,
  },
  button: {
    padding: '0.78rem',
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.98rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  },
  error: {
    color: '#f43f5e',
    fontSize: '0.88rem',
    background: 'rgba(244, 63, 94, 0.1)',
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(244, 63, 94, 0.15)',
    margin: 0,
  },
  catalogBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.4rem',
    transition: 'color 0.2s',
    textAlign: 'center',
  },
}