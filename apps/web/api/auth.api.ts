import apiClient from '@/lib/api'
import {
  CreateUserDto,
  LoginDto,
  User,
  ForgotPasswordDto,
  VerifyPasswordResetOtpDto,
  ResetPasswordDto,
} from '@repo/schemas'
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

  adminLogin: async (credentials: LoginDto): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/auth/admin/login', credentials)
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

  verifyEmail: async (otpCode: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.get<ApiResponse<null>>(`/auth/verify-email?otp=${otpCode}`)
    return data
  },

  resendVerification: async (email: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/resend-verification', { email })
    return data
  },
}
