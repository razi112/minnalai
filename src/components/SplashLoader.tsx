import { useEffect, useState } from 'react'
import Loader from './Loader'

export default function SplashLoader({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1800)
    const hideTimer = setTimeout(() => setVisible(false), 2300)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  return (
    <>
      {visible && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-primary)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: fading ? 'none' : 'all',
        }}>
          <Loader />
          <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Loading Minnal AI...
          </p>
        </div>
      )}
      {children}
    </>
  )
}
