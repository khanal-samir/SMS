import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { useErrorStore } from '@/store/error.store'
import { QUERY_KEYS } from '@/lib/query-keys'
import type { CreateUserDto, LoginDto } from '@repo/schemas'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/lib/api'
import { toast } from 'sonner'

export const useRegister = () => {
  const { setLoading } = useAuthStore()
  const { setError } = useErrorStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: CreateUserDto) => authApi.register(userData),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] })
      toast.success('Registration successful!')
      router.push('/dashboard')
    },
    onError: (error: AxiosError<ApiError>) => {
      setError(error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useLogin = () => {
  const { login: loginStore, setLoading } = useAuthStore()
  const { setError } = useErrorStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.login(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      loginStore(data, data.accessToken!)

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] })
      toast.success('Login successful!')
      router.push('/dashboard')
    },
    onError: (error: AxiosError<ApiError>) => {
      setError(error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useLogout = () => {
  const { logout, setLoading } = useAuthStore()
  const { setError } = useErrorStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Logged out successfully')
      router.push('/login')
    },
    onError: (error: AxiosError<ApiError>) => {
      // Even if API fails, logout locally
      logout()
      queryClient.clear()
      router.push('/login')
      setError(error)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}
