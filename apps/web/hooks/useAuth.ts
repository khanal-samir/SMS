import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { QUERY_KEYS } from '@/lib/query-keys'
import type { CreateUserDto, LoginDto } from '@repo/schemas'
import { toast } from 'sonner'

export const useRegister = () => {
  const { setLoading } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (userData: CreateUserDto) => authApi.register(userData as CreateUserDto),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      toast.success('Registration successful!')
      router.push('/login')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useLogin = () => {
  const { setUser, setLoading } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.login(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (response) => {
      if (!response.data) return
      setUser(response.data)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] })
      toast.success('Login successful!')
      router.push('/student/dashboard')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useLogout = () => {
  const { clearUser, setLoading } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      clearUser()
      queryClient.clear()
      toast.success('Logged out successfully')
      router.push('/login')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useGoogleAuth = () => {
  const { setLoading } = useAuthStore()

  const initiateGoogleLogin = () => {
    setLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    window.location.href = `${apiUrl}auth/google/login`
  }

  return { initiateGoogleLogin }
}

export const useTeacherRegister = () => {
  const { setLoading } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (userData: CreateUserDto) =>
      authApi.teacherRegister({ ...userData, role: 'TEACHER' }),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      toast.success('Teacher registration successful!')
      router.push('/teacher/login')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useTeacherLogin = () => {
  const { setUser, setLoading } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.teacherLogin(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (response) => {
      if (!response.data) return
      setUser(response.data)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] })
      toast.success('Teacher login successful!')
      router.push('/teacher/dashboard')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useAdminLogin = () => {
  const { setUser, setLoading } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.adminLogin(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (response) => {
      if (!response.data) return
      setUser(response.data)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] })
      toast.success('Admin login successful!')
      router.push('/admin/dashboard')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}
