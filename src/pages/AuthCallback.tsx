import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Exchange the OAuth code/tokens from the URL for a session.
    // After getSession(), call getUser() to force a fresh fetch from Supabase
    // so that Google profile data (avatar_url, full_name) is fully synced
    // into user_metadata before we navigate to the dashboard.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Refresh user metadata from the server to get Google avatar_url etc.
        await supabase.auth.getUser()
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
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
