import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window { __pwaPrompt: BeforeInstallPromptEvent | null }
}

export default function PWAInstallPrompt() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Skip if already installed as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Skip if user already dismissed
    if (sessionStorage.getItem('pwa-dismissed')) return

    const t = setTimeout(() => setVisible(true), 2800)
    return () => clearTimeout(t)
  }, [])

  const install = async () => {
    const prompt = window.__pwaPrompt
    if (prompt) {
      try {
        await prompt.prompt()
        await prompt.userChoice
      } catch (_) {}
      setVisible(false)
      sessionStorage.setItem('pwa-dismissed', '1')
    } else {
      // No native prompt — guide the user through Chrome's menu
      setVisible(false)
      sessionStorage.setItem('pwa-dismissed', '1')
      navigate('/install')
    }
  }

  const cancel = () => {
    setVisible(false)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={cancel} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.2s ease',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '40px 32px 28px',
        width: 'min(400px, 92vw)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        animation: 'pwaModalPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <style>{`
          @keyframes pwaModalPop {
            from { opacity:0; transform:translate(-50%,-50%) scale(0.85); }
            to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
          }
        `}</style>

        {/* App icon */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '22px',
          background: 'var(--accent)', marginBottom: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px var(--accent-subtle)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>

        <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', textAlign: 'center', letterSpacing: '-0.03em' }}>
          Install AI Islam
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 32px', textAlign: 'center', lineHeight: 1.7, maxWidth: '280px' }}>
          Get the full app experience — faster load, offline access, and home screen shortcut.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['⚡ Fast', '📴 Offline', '🏠 Home Screen'].map(f => (
            <span key={f} style={{
              fontSize: '11px', fontWeight: 600, padding: '4px 10px',
              borderRadius: '999px', background: 'var(--bg-hover)',
              border: '1px solid var(--border)', color: 'var(--text-secondary)',
            }}>{f}</span>
          ))}
        </div>

        <button onClick={install} style={{
          width: '100%', padding: '14px', borderRadius: '14px',
          background: 'var(--accent)', color: '#fff', border: 'none',
          fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '10px',
          boxShadow: '0 0 24px var(--accent-subtle)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Install
        </button>

        <button onClick={cancel} style={{
          width: '100%', padding: '13px', borderRadius: '14px',
          background: 'transparent', color: 'var(--text-muted)',
          border: '1px solid var(--border)', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
          transition: 'color 0.2s, border-color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-muted)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          Not now
        </button>
      </div>
    </>
  )
}
