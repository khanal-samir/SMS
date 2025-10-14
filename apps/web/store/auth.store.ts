import { zustandStore } from './zustand.store'
import { setSessionCookie, removeSessionCookie, updateSessionCookie } from '@/lib/session'
import type { AuthResponse as User } from '@repo/schemas'

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Auth actions
  login: (user: User, accessToken: string) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  setUser: (user: User | null) => void
}

export const useAuthStore = zustandStore<AuthState>(
  (set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,

    login: (user, accessToken) => {
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      })
      setSessionCookie({ userId: user.id, role: user.role, isAuthenticated: true })
    },

    logout: () => {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      })
      removeSessionCookie()
    },

    updateTokens: (accessToken, refreshToken) => {
      set((state) => {
        const newUser = state.user
          ? {
              ...state.user,
              refreshToken,
            }
          : null
        if (newUser) {
          updateSessionCookie({ userId: newUser.id, role: newUser.role, isAuthenticated: true })
        }
        return {
          accessToken,
          user: newUser,
        }
      })
    },

    setLoading: (loading) => {
      set({ isLoading: loading })
    },

    setUser: (user) => {
      set({ user })
    },
  }),
  {
    persistOptions: {
      name: 'auth-storage',
      partialize: (state) => ({
        userId: state.user?.id,
        role: state.user?.role,
        isAuthenticated: state.isAuthenticated,
      }),
    },
    devtoolsEnabled: false,
  },
)
