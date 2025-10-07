import { zustandStore } from './zustand.store'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/lib/api'

type ErrorState = {
  error: AxiosError<ApiError> | null
}

type ErrorActions = {
  setError: (error: AxiosError<ApiError>) => void
  clearError: () => void
}

export type ErrorStore = ErrorState & ErrorActions

export const useErrorStore = zustandStore<ErrorStore>(
  (set) => ({
    error: null,

    setError(error) {
      set({ error })
    },

    clearError() {
      set({ error: null })
    },
  }),
  {
    devtoolsEnabled: true,
  },
)
