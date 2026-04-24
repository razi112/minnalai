import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

type Mode = 'signin' | 'signup'

function parseError(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message: string }).message
    if (msg.includes('Invalid login credentials')) return 'Incorrect email or password.'
    if (msg.includes('Email not confirmed')) return 'Please confirm your email before signing in.'
    if (msg.includes('User already registered')) return 'An account with this email already exists.'
    if (msg.includes('Password should be')) return 'Password must be at least 6 characters.'
    if (msg.includes('Unable to validate')) return 'Invalid email address.'
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) return 'Network error. Check your connection.'
    if (msg.includes('Invalid API key') || msg.includes('No API key')) return '⚠️ Supabase not configured. Add your credentials to supabase.ts'
    return msg
  }
  return 'Something went wrong. Please try again.'
}

export default function Login() {
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()

  const clearMessages = () => { setError(''); setSuccessMsg('') }

  const switchMode = (m: Mode) => {
    setMode(m)
    clearMessages()
    setName(''); setEmail(''); setPassword('')
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    if (!email || !password) return
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        })
        if (err) throw err
        setSuccessMsg('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
        setPassword('')
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        navigate('/dashboard')
      }
    } catch (err) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    clearMessages()
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (err) throw err
      // OAuth redirects the page — no navigate() needed
    } catch (err) {
      setError(parseError(err))
      setGoogleLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 35% at 50% 0%, var(--accent-subtle) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        <div
          className="rounded-2xl px-6 py-8 flex flex-col gap-5"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent)', boxShadow: '0 6px 20px var(--accent-subtle)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="white"/>
                <circle cx="17.5" cy="5.5" r="1.5" fill="white"/>
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {mode === 'signin' ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {mode === 'signin' ? 'Sign in to continue your Islamic journey' : 'Start exploring Islamic knowledge today'}
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
          >
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-150"
                style={mode === m
                  ? { background: 'var(--text-primary)', color: 'var(--bg-primary)' }
                  : { color: 'var(--text-muted)' }
                }
              >
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Success message */}
          {successMsg && (
            <p
              className="text-xs px-3 py-2 rounded-lg"
              style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}
            >
              {successMsg}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearMessages() }}
                  placeholder="John Doe"
                  autoComplete="name"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
            )}

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearMessages() }}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearMessages() }}
                  placeholder="••••••••"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  style={{ ...inputStyle, paddingRight: '40px' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 14px var(--accent-subtle)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {loading && <Spinner />}
              {loading
                ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                : (mode === 'signin' ? 'Sign in' : 'Create account')
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onMouseEnter={e => {
              if (!googleLoading) {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.borderColor = 'var(--text-muted)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.02)' }}
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            <span>{googleLoading ? 'Redirecting…' : 'Continue with Google'}</span>
          </button>

          {/* Terms */}
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            By continuing, you agree to our{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Terms</span>
            {' '}and{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
