import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

export const GUEST_MESSAGE_LIMIT = 5
const GUEST_COUNT_KEY = 'minnal_guest_msg_count'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isGuest: boolean
  guestMessageCount: number
  guestLimitReached: boolean
  incrementGuestCount: () => void
  resetGuestCount: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isGuest: false,
  guestMessageCount: 0,
  guestLimitReached: false,
  incrementGuestCount: () => {},
  resetGuestCount: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [guestMessageCount, setGuestMessageCount] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(GUEST_COUNT_KEY) ?? '0', 10) || 0 } catch { return 0 }
  })
  const initializedRef = useRef(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!initializedRef.current) {
        initializedRef.current = true
        setLoading(false)
      }
    })

    const timeout = setTimeout(() => {
      if (!initializedRef.current) {
        initializedRef.current = true
        setLoading(false)
      }
    }, 1500)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])
  const incrementGuestCount = useCallback(() => {
    setGuestMessageCount((prev) => {
      const next = prev + 1
      try { localStorage.setItem(GUEST_COUNT_KEY, String(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const resetGuestCount = useCallback(() => {
    setGuestMessageCount(0)
    try { localStorage.removeItem(GUEST_COUNT_KEY) } catch { /* ignore */ }
  }, [])

  const isGuest = !user && !loading
  const guestLimitReached = isGuest && guestMessageCount >= GUEST_MESSAGE_LIMIT

  return (
    <AuthContext.Provider value={{
      user, loading, isGuest, guestMessageCount, guestLimitReached,
      incrementGuestCount, resetGuestCount,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
