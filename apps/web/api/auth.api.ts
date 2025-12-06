import apiClient from '@/lib/api'
import { CreateUserDto, LoginDto, User } from '@repo/schemas'
import type { ApiResponse } from '@repo/schemas'

export const authApi = {
  register: async (userData: CreateUserDto): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/auth/student/register', userData)
    return data
  },

  login: async (credentials: LoginDto): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/auth/student/login', credentials)
    return data
  },

  teacherRegister: async (userData: CreateUserDto): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/auth/teacher/register', userData)
    return data
  },

  teacherLogin: async (credentials: LoginDto): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/auth/teacher/login', credentials)
    return data
  },

  refresh: async (): Promise<ApiResponse<{ id: string }>> => {
    const { data } = await apiClient.post<ApiResponse<{ id: string }>>('/auth/refresh')
    return data
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me')
    return data
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/logout')
    return data
  },
}
