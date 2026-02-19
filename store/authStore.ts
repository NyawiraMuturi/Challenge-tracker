import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  initialize: () => {
    const supabase = createClient()
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      set({ user, loading: false })
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ user: session?.user ?? null })
      }
    )

    // Cleanup function will be handled by React's useEffect
  },

  signUp: async (email: string, password: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (data.user) {
      set({ user: data.user })
    }

    return { error }
  },

  signIn: async (email: string, password: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data.user) {
      set({ user: data.user })
    }

    return { error }
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null })
  },
}))