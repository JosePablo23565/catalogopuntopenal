import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  Shirt
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Productos', path: '/admin/productos', icon: Package },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? '240px' : '64px' }}>
        {/* Logo */}
        <div style={styles.logo}>
          <Shirt size={24} color="#fff" />
          {sidebarOpen && <span style={styles.logoText}>CamisasAdmin</span>}
        </div>

        {/* Toggle */}
        <button style={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navItem,
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}
              >
                <Icon size={20} color="#fff" />
                {sidebarOpen && <span style={styles.navLabel}>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} color="#fff" />
          {sidebarOpen && <span style={styles.navLabel}>Cerrar sesión</span>}
        </button>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f7f8fa',
  },
  sidebar: {
    background: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s ease',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.25rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoText: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    whiteSpace: 'nowrap',
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '0.5rem',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.75rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },
  navLabel: {
    color: '#fff',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.25rem',
    background: 'transparent',
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    padding: '2rem',
    overflow: 'auto',
  },
}