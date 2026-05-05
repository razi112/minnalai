import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    // Timeout fallback — if Supabase takes too long, redirect to login
    const timeout = setTimeout(() => {
      if (!cancelled) navigate('/login', { replace: true })
    }, 8000)

    supabase.auth.getSession().then(async ({ data: { session }, error: sessionErr }) => {
      if (cancelled) return
      clearTimeout(timeout)

      if (sessionErr) {
        setError(sessionErr.message)
        setTimeout(() => navigate('/login', { replace: true }), 2000)
        return
      }

      if (session) {
        // Refresh user metadata from the server to get Google avatar_url etc.
        await supabase.auth.getUser()
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }).catch((err) => {
      if (cancelled) return
      clearTimeout(timeout)
      setError(err?.message ?? 'Authentication failed.')
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    })

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex flex-col items-center gap-3">
        {error ? (
          <>
            <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Redirecting to login…</p>
          </>
        ) : (
          <>
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Signing you in…</p>
          </>
        )}
      </div>
    </div>
  )
}
