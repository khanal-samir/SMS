import apiClient from '@/lib/api'
import { CreateUserDto, LoginDto } from '@repo/schemas'
import type { AuthResponse } from '@repo/schemas'

export const authApi = {
  register: async (userData: CreateUserDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', userData)
    return data
  },

  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  teacherRegister: async (userData: CreateUserDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/teacher/register', userData)
    return data
  },

  teacherLogin: async (credentials: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/teacher/login', credentials)
    return data
  },

  refresh: async (): Promise<void> => {
    await apiClient.post('/auth/refresh')
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  verifyEmail: async (token: string): Promise<void> => {
    const { data } = await apiClient.get(`/auth/verify-email?token=${token}`)
    return data
  },

  resendVerification: async (email: string): Promise<void> => {
    const { data } = await apiClient.post('/auth/resend-verification', { email })
    return data
  },
}
