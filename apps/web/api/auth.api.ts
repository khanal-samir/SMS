import apiClient from '@/lib/api'
import { CreateUserDto, LoginDto } from '@repo/schemas'
import type { AuthResponse, ApiResponse } from '@repo/schemas'

export const authApi = {
  register: async (userData: CreateUserDto): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData)
    return data
  },

  login: async (credentials: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return data
  },

  teacherRegister: async (userData: CreateUserDto): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/teacher/register',
      userData,
    )
    return data
  },

  teacherLogin: async (credentials: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/teacher/login',
      credentials,
    )
    return data
  },

  refresh: async (): Promise<ApiResponse<{ id: string }>> => {
    const { data } = await apiClient.post<ApiResponse<{ id: string }>>('/auth/refresh')
    return data
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.get<ApiResponse<AuthResponse>>('/auth/me')
    return data
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/logout')
    return data
  },
}
