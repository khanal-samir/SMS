import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth.store'
import type { AuthResponse } from '@repo/schemas'
import { AuthResponseSchema } from '@repo/schemas'

export interface ApiError {
  message: string
  statusCode: number
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

//add access token to request headers
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

    originalRequest._retry = true // tell axios to retry the request
    isRefreshing = true // tell other requests to queue
    const { user, updateTokens, logout } = useAuthStore.getState()

    //if no refresh token then logout and reject the request
    if (!user?.refreshToken) {
      logout()
      failedQueue.forEach((p) => p.reject(new Error('No refresh token')))
      failedQueue = []
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${user?.refreshToken}` } },
      )

      // Validate response with Zod
      const validatedData = AuthResponseSchema.parse(data)

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
