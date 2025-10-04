import { zustandStore } from './zustand.store'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  setUser: (user: User | null) => void
}

export const useAuthStore = zustandStore<AuthState>(
  (set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,

    login: (user, accessToken, refreshToken) => {
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      })
    },

    logout: () => {
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      })
    },

    updateTokens: (accessToken, refreshToken) => {
      set({
        accessToken,
        refreshToken,
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
        //dont store access token in local storage
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
    devtoolsEnabled: process.env.NODE_ENV === 'development',
  },
)
