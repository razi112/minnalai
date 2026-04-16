import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
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

  useEffect(() => {
    // Get initial session with fresh user metadata
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { data: { user: freshUser } } = await supabase.auth.getUser()
        setUser(freshUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Listen for auth changes â€” on SIGNED_IN fetch fresh user to get Google avatar_url
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: { user: freshUser } } = await supabase.auth.getUser()
        setUser(freshUser)
      } else {
        setUser(session?.user ?? null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
