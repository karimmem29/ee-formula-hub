import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext({
  user: null,
  isPro: false,
  loading: true,
  signOut: async () => {},
  refreshPro: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  // Read the user's Pro flag from their profile row. SELECT is the only thing
  // a logged-in user is allowed to do here (see supabase/schema.sql RLS) — the
  // flag itself is set server-side by the Lemon Squeezy webhook.
  const loadPro = async (userId) => {
    if (!userId) {
      setIsPro(false)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', userId)
      .single()
    if (error) {
      setIsPro(false)
      return
    }
    setIsPro(!!data?.is_pro)
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      await loadPro(session?.user?.id)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      await loadPro(session?.user?.id)
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsPro(false)
  }

  const refreshPro = () => loadPro(user?.id)

  return (
    <AuthContext.Provider value={{ user, isPro, loading, signOut, refreshPro }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
