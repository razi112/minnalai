import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  // Show spinner while auth is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" style={{ color: 'var(--text-muted)' }}/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ color: 'var(--accent)' }}/>
        </svg>
      </div>
    )
  }

  // Once auth resolves, always allow through.
  // Guests (no user) are handled inside the app with message limits.
  // Only redirect if we somehow get here while still loading (shouldn't happen).
  return <>{children}</>
}
