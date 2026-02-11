import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/apis/auth.api'
import { getSessionCookie, setSessionCookie } from '@/lib/session'
import type { ApiResponse } from '@repo/schemas'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important: Send cookies with requests
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error: Error) => void
}> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<null>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    const url = originalRequest?.url || ''
    const isAuthOperation =
      url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthOperation
    ) {
      return Promise.reject(error)
    }

    // Queue requests while refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => {
          return apiClient(originalRequest)
        })
        .catch((err) => {
          // Don't show toast for queued requests that fail during refresh
          return Promise.reject(err)
        })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await authApi.refresh()
      const session = getSessionCookie()
      if (session) {
        setSessionCookie({ role: session.role, isAuthenticated: true })
      }

      // Process queued requests
      failedQueue.forEach((p) => p.resolve())
      failedQueue = []

      // Retry original request - this should succeed now
      return apiClient(originalRequest)
    } catch {
      // Refresh failed - clear user and reject all queued requests
      const { clearUser } = useAuthStore.getState()
      clearUser()

      // Reject all queued requests
      failedQueue.forEach((p) => p.reject(new Error('Session expired. Please login again.')))
      failedQueue = []
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
