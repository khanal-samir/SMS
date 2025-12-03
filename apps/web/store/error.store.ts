import { zustandStore } from './zustand.store'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@repo/schemas'

type ErrorState = {
  error: AxiosError<ApiResponse<unknown>> | null
}

type ErrorActions = {
  setError: (error: AxiosError<ApiResponse<unknown>>) => void
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
