import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  useEffect(() => {
    // Subscribe to auth state changes FIRST.
    // onAuthStateChange fires immediately with the current session on mount,
    // so we don't need a separate getSession() / getUser() call — that's what
    // caused the lock conflict (two concurrent token-refresh requests).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!initializedRef.current) {
        initializedRef.current = true
        setLoading(false)
      }
    })

    // Safety fallback: if the auth event never fires (e.g. network issue),
    // stop the loading spinner after 1.5 s so the UI doesn't hang.
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

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
