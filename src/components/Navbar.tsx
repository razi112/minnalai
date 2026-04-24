import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const isDark = theme === 'Dark' || theme === 'System'
  const toggleTheme = () => setTheme(isDark ? 'Light' : 'Dark')

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Features', to: '/features' },
  ]

  const linkStyle = (to: string): React.CSSProperties => ({
    color: location.pathname === to ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: 400,
    textDecoration: 'none',
    transition: 'color 0.15s',
    padding: '4px 2px',
  })

  return (
    <nav
      className="z-50 w-full px-4 py-3"
      style={{ position: 'sticky', top: 0 }}
    >
      <div
        className="flex items-center gap-4 px-4 py-2.5 rounded-full mx-auto"
        style={{
          maxWidth: '960px',
          background: isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/favicon.ico"
            alt="AI Islam logo"
            className="w-8 h-8 rounded-full"
            style={{ objectFit: 'cover' }}
          />
          <span className="hidden sm:block text-sm font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>AI Islam</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={linkStyle(to)}
              onMouseEnter={e => { if (location.pathname !== to) e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { if (location.pathname !== to) e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            aria-label="Toggle theme"
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <Link
            to="/login"
            className="px-4 py-1.5 rounded-full text-sm transition-all"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            Log in
          </Link>

          <button
            onClick={() => navigate('/login')}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-1.5 rounded-lg"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden mt-2 mx-1 rounded-2xl px-4 py-4 flex flex-col gap-3"
          style={{
            background: isDark ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.95)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{ ...linkStyle(to), display: 'block', padding: '6px 0' }}
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center py-2 rounded-xl text-sm"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-hover)' }}
            >
              Log in
            </Link>
            <button
              onClick={() => { navigate('/login'); setMenuOpen(false) }}
              className="flex-1 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
