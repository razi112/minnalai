import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

// Firebase uses signInWithPopup so there's no OAuth redirect callback.
// This page exists as a safety net — if someone lands here, check auth state
// and redirect accordingly.
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      navigate(user ? '/dashboard' : '/login', { replace: true })
    })

    // Fallback timeout
    const timeout = setTimeout(() => {
      unsubscribe()
      navigate('/login', { replace: true })
    }, 5000)

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Signing you in…</p>
      </div>
    </div>
  )
}
