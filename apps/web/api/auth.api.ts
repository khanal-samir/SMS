import apiClient from '@/lib/api'
import { CreateUserDto, LoginDto } from '@repo/schemas'
import type { AuthResponse, RefreshResponse } from '@repo/schemas'

export const authApi = {
  register: async (userData: CreateUserDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', userData)
    return data
  },

  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken })
    return data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}
