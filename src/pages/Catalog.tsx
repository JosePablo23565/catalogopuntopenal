import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import logo from '../assets/puntopenalcr.webp'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

// FUTBOL (incluyendo Resto del Mundo)
const FOOTBALL_LEAGUES = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Resto del Mundo'
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

const PRODUCTS_PER_PAGE = 36

export default function Catalog() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [selectedLeague, setSelectedLeague] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false) // Controla el estado de los filtros (sidebar/drawer)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const isExclusiveCategory = selectedCategory === 'Selecciones'
  const isCategoryDisabled = (category: string) => {
    if (category === 'Selecciones') return false
    return isExclusiveCategory
  }

  const isLeagueDisabled = () => isExclusiveCategory

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedLeague, selectedCategory])

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLeague = selectedLeague === '' ? true : p.league === selectedLeague
    const matchesCategory = selectedCategory === '' ? true : p.category === selectedCategory
    return matchesSearch && matchesLeague && matchesCategory
  })

  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const getCountByLeague = (league: string) => products.filter(p => p.league === league).length
  const getCountByCategory = (category: string) => products.filter(p => p.category === category).length

  const clearFilters = () => {
    setSelectedLeague('')
    setSelectedCategory('')
    setSearchTerm('')
  }

  const hasActiveFilters = selectedLeague !== '' || selectedCategory !== '' || searchTerm !== ''

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    }
    return rangeWithDots
  }

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('')
    } else {
      setSelectedCategory(category)
      if (category === 'Selecciones') {
        setSelectedLeague('')
      }
    }
  }

  const handleLeagueClick = (league: string) => {
    if (isExclusiveCategory) return
    if (selectedLeague === league) {
      setSelectedLeague('')
    } else {
      setSelectedLeague(league)
    }
  }

  const FiltersPanel = () => (
    <>
      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>FUTBOL</label>
        <div style={styles.filterButtons}>
          {FOOTBALL_LEAGUES.map(league => {
            let displayName = league
            if (league === 'Premier League') displayName = 'Premier'
            if (league === 'Bundesliga') displayName = 'Bundes'
            if (league === 'Resto del Mundo') displayName = 'Resto Mundo'
            return (
              <button
                key={league}
                onClick={() => handleLeagueClick(league)}
                disabled={isLeagueDisabled()}
                style={{
                  ...styles.filterChip,
                  ...(selectedLeague === league ? styles.filterChipActive : {}),
                  opacity: isLeagueDisabled() ? 0.5 : 1,
                  cursor: isLeagueDisabled() ? 'not-allowed' : 'pointer',
                }}
              >
                {displayName}
                {getCountByLeague(league) > 0 && <span style={styles.countBadge}>{getCountByLeague(league)}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>NBA</label>
        <div style={styles.filterButtons}>
          {NBA_TEAMS.map(team => (
            <button
              key={team}
              onClick={() => handleLeagueClick(team)}
              disabled={isLeagueDisabled()}
              style={{
                ...styles.filterChip,
                ...(selectedLeague === team ? styles.filterChipActive : {}),
                opacity: isLeagueDisabled() ? 0.5 : 1,
                cursor: isLeagueDisabled() ? 'not-allowed' : 'pointer',
              }}
            >
              {team}
              {getCountByLeague(team) > 0 && <span style={styles.countBadge}>{getCountByLeague(team)}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>F1</label>
        <div style={styles.filterButtons}>
          {F1_TEAMS.map(team => {
            let displayName = team
            if (team === 'Aston Martin') displayName = 'Aston'
            return (
              <button
                key={team}
                onClick={() => handleLeagueClick(team)}
                disabled={isLeagueDisabled()}
                style={{
                  ...styles.filterChip,
                  ...(selectedLeague === team ? styles.filterChipActive : {}),
                  opacity: isLeagueDisabled() ? 0.5 : 1,
                  cursor: isLeagueDisabled() ? 'not-allowed' : 'pointer',
                }}
              >
                {displayName}
                {getCountByLeague(team) > 0 && <span style={styles.countBadge}>{getCountByLeague(team)}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div style={styles.filterButtons}>
        <button
          onClick={() => handleCategoryClick('Retro')}
          disabled={isCategoryDisabled('Retro')}
          style={{
            ...styles.filterChip,
            ...(selectedCategory === 'Retro' ? styles.filterChipActive : {}),
            opacity: isCategoryDisabled('Retro') ? 0.5 : 1,
            cursor: isCategoryDisabled('Retro') ? 'not-allowed' : 'pointer',
          }}
        >
          Retro {getCountByCategory('Retro') > 0 && <span style={styles.countBadge}>{getCountByCategory('Retro')}</span>}
        </button>
        <button
          onClick={() => handleCategoryClick('Selecciones')}
          disabled={isCategoryDisabled('Selecciones')}
          style={{
            ...styles.filterChip,
            ...(selectedCategory === 'Selecciones' ? styles.filterChipActive : {}),
            opacity: isCategoryDisabled('Selecciones') ? 0.5 : 1,
            cursor: isCategoryDisabled('Selecciones') ? 'not-allowed' : 'pointer',
          }}
        >
          Selecciones {getCountByCategory('Selecciones') > 0 && <span style={styles.countBadge}>{getCountByCategory('Selecciones')}</span>}
        </button>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} style={styles.clearBtn}>
          <X size={14} /> Limpiar filtros
        </button>
      )}
    </>
  )

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoText}>puntopenalcr</span>
          </div>
          {/* Botón Filtrar en el header */}
          <button style={styles.filterHeaderBtn} onClick={() => setIsFiltersOpen(true)}>
            <SlidersHorizontal size={16} />
            <span>Filtrar</span>
          </button>
        </div>
      </header>

      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <img 
            src={logo} 
            alt="Punto Penal" 
            style={styles.heroLogo}
          />
          <p style={styles.heroSports}>F1 | FÚTBOL | NBA</p>
        </div>
      </div>

      <main style={styles.main}>
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <Search size={18} color="var(--text-muted)" style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar camisas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.contentLayout}>
          <div style={styles.mainContent}>
            {loading ? (
              <div style={styles.loadingWrapper}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Cargando catalogo exclusivo...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: '2.5rem' }}>🔍</span>
                <h3 style={{ margin: '1rem 0 0.25rem', fontWeight: 700 }}>No se encontraron productos</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Intenta ajustar los filtros o terminos de busqueda.</p>
                {hasActiveFilters && <button onClick={clearFilters} style={styles.clearFiltersBtn}>Limpiar todos los filtros</button>}
              </div>
            ) : (
              <>
                <div style={styles.resultsInfo}>
                  <p>Items {startIndex + 1}-{endIndex} de {totalProducts}</p>
                </div>

                <div className="catalog-grid">
                  {paginatedProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={styles.pagination}>
                    {getPageNumbers().map((page, idx) => (
                      typeof page === 'number' ? (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            ...styles.numberBtn,
                            background: currentPage === page ? '#0f172a' : '#fff',
                            color: currentPage === page ? '#fff' : '#0f172a',
                            borderColor: '#e2e8f0',
                          }}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={idx} style={styles.dots}>...</span>
                      )
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerLogo}>
            <span style={styles.footerLogoText}>PUNTO PENAL</span>
          </div>
          
          <div style={styles.contactMessage}>
            <p style={styles.contactText}>¿No encontraste lo que buscás?</p>
            <p style={styles.contactSubtext}>No hay problema, escribinos.</p>
          </div>
          
          <div style={styles.socialLinks}>
            <a 
              href="https://wa.me/50687623104" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={28} color="#25D366" />
            </a>
            <a 
              href="https://www.instagram.com/puntopenalcr/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
              aria-label="Instagram"
            >
              <FaInstagram size={28} color="#E4405F" />
            </a>
          </div>
          
          <p style={styles.footerCopy}>© 2026 PUNTO PENAL · Todos los derechos reservados</p>
        </div>
      </footer>

      {/* FILTROS - Sidebar/Drawer universal */}
      {isFiltersOpen && (
        <>
          <div style={styles.drawerOverlay} onClick={() => setIsFiltersOpen(false)} />
          <div style={isMobile ? styles.drawer : styles.filtersDrawer}>
            <div style={styles.drawerHeader}>
              <h3 style={styles.drawerTitle}>Filtrar productos</h3>
              <button style={styles.drawerClose} onClick={() => setIsFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.drawerContent}>
              <FiltersPanel />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' },
  header: { background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 10px rgba(15, 23, 42, 0.03)' },
  headerInner: { maxWidth: '1200px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoText: { fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.3px', background: 'linear-gradient(135deg, var(--text-main) 0%, #1e1b4b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  filterHeaderBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' },
  hero: { background: '#ffffff', position: 'relative', textAlign: 'center', padding: '3rem 1.5rem', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'transparent', pointerEvents: 'none' },
  heroContent: { position: 'relative', maxWidth: '700px', margin: '0 auto', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  heroLogo: { width: '200px', maxWidth: '80%', marginBottom: '0' },
  heroSports: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '2px', color: '#334155', marginTop: '1rem', textAlign: 'center' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' },
  filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  searchBox: { position: 'relative', flex: '1 1 300px', maxWidth: '450px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' },
  searchInput: { width: '100%', padding: '0.65rem 1rem 0.65rem 2.6rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.92rem', outline: 'none', background: '#fff', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)' },
  contentLayout: { display: 'flex', gap: '2rem' },
  mainContent: { flex: 1, minWidth: 0 },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' },
  filterLabel: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' },
  filterButtons: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  filterChip: { padding: '0.4rem 0.9rem', borderRadius: '20px', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9' },
  filterChipActive: { background: 'var(--accent)', color: '#fff', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)' },
  countBadge: { background: 'rgba(0,0,0,0.1)', borderRadius: '10px', padding: '0 6px', fontSize: '0.7rem', fontWeight: 600 },
  clearBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.5rem 1rem', background: 'var(--danger-light)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: '0.5rem' },
  resultsInfo: { marginBottom: '1.5rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' },
  numberBtn: { minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', background: '#fff' },
  dots: { padding: '0 0.25rem', color: '#94a3b8', fontSize: '0.9rem' },
  loadingWrapper: { textAlign: 'center', padding: '6rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  spinner: { width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 500 },
  emptyState: { textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' },
  clearFiltersBtn: { marginTop: '1.5rem', padding: '0.6rem 1.2rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  footer: { borderTop: '1px solid var(--border-color)', background: '#fff', padding: '2rem 1.5rem', marginTop: '3rem' },
  footerInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  footerLogoText: { fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' },
  contactMessage: { textAlign: 'center', marginBottom: '0.5rem' },
  contactText: { fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', margin: 0 },
  contactSubtext: { fontSize: '0.8rem', color: '#475569', margin: '0.25rem 0 0 0' },
  socialLinks: { display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.5rem' },
  socialLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'transparent', transition: 'transform 0.2s', cursor: 'pointer' },
  footerCopy: { color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 },
  drawerOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 },
  filtersDrawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    maxWidth: '90%',
    height: '100%',
    background: '#fff',
    zIndex: 1001,
    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  drawer: { position: 'fixed', top: 0, right: 0, width: '85%', maxWidth: '320px', height: '100%', background: '#fff', zIndex: 1001, boxShadow: '-4px 0 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border-color)' },
  drawerTitle: { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  drawerClose: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' },
  drawerContent: { flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
}

const gridStyles = document.createElement("style")
gridStyles.textContent = `
  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.75rem;
  }
  @media (max-width: 1024px) {
    .catalog-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .catalog-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 540px) {
    .catalog-grid { grid-template-columns: repeat(1, 1fr); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`
document.head.appendChild(gridStyles)