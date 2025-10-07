import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth.store'
import { RefreshResponseSchema } from '@repo/schemas'
import { authApi } from '@/api/auth.api'

export interface ApiError {
  statusCode: number
  message: string
  error?: string
  errors?: Array<{
    message: string
  }>
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: Error) => void
}> = []

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    //if request is not original request or status is not 401 or retry is true then exit
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    //Queue to prevent multiple requests to refresh token
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject }) //add to queue
      }).then((token) => {
        originalRequest.headers!.Authorization = `Bearer ${token}`
        return apiClient(originalRequest) //return the request with the new token
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    //store
    const { user, updateTokens, logout } = useAuthStore.getState()
    if (!user?.refreshToken) {
      logout()
      failedQueue.forEach((p) => p.reject(new Error('No refresh token')))
      failedQueue = []
      return Promise.reject(error)
    }

    try {
      const data = await authApi.refresh(user.refreshToken)
      const validatedData = RefreshResponseSchema.parse(data)

      updateTokens(validatedData.accessToken, validatedData.refreshToken)
      originalRequest.headers!.Authorization = `Bearer ${validatedData.accessToken}`

      failedQueue.forEach((p) => p.resolve(validatedData.accessToken))
      failedQueue = []

      return apiClient(originalRequest)
    } catch {
      logout()
      failedQueue.forEach((p) => p.reject(new Error('Refresh failed'))) //reject the requests in the queue
      failedQueue = [] //clear the queue
      return Promise.reject(error) //reject original request
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
