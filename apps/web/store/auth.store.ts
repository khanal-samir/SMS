import { zustandStore } from './zustand.store'
import { setSessionCookie, removeSessionCookie } from '@/lib/session'
import type { AuthResponse as User } from '@repo/schemas'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User | null) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = zustandStore<AuthState>(
  (set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    setUser: (user) => {
      if (user) {
        set({
          user,
          isAuthenticated: true,
        })
        setSessionCookie({ role: user.role, isAuthenticated: true })
      }
    },

    clearUser: () => {
      set({
        user: null,
        isAuthenticated: false,
      })
      removeSessionCookie()
    },

    setLoading: (loading) => {
      set({ isLoading: loading })
    },
  }),
  {
    devtoolsEnabled: false,
  },
)
