// src/hooks/useError.ts
import { useEffect } from 'react'
import { useErrorStore } from '@/store/error.store'
import { toast } from 'sonner'

export const useError = () => {
  useEffect(() => {
    const unsubscribe = useErrorStore.subscribe((state, prevState) => {
      if (state.error !== prevState.error && state.error !== null) {
        // Extract error message from AxiosError response
        const errorData = state.error.response?.data
        const errorMessage =
          errorData?.message || state.error.message || 'An unknown error occurred'

        toast.error(errorMessage)

        // Clear error after showing to prevent duplicate toasts
        useErrorStore.getState().clearError()
      }
    })

    return () => unsubscribe()
  }, [])
}
