import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/apis/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { QUERY_KEYS } from '@/lib/query-keys'
import type { CreateUserDto, LoginDto, ResetPasswordDto } from '@repo/schemas'
import { toast } from 'sonner'

export const useRegister = () => {
  const { setLoading } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (userData: CreateUserDto) => authApi.register(userData as CreateUserDto),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      toast.success(data.message)
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
      toast.success(response.message)
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
    onSuccess: (data) => {
      clearUser()
      queryClient.clear()
      toast.success(data.message)
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

export const useTeacherRegister = (
  setShowVerifyDialog: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { setLoading } = useAuthStore()
  return useMutation({
    mutationFn: (userData: CreateUserDto) =>
      authApi.teacherRegister({ ...userData, role: 'TEACHER' }),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      setShowVerifyDialog(true)
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
      toast.success(response.message)
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
      toast.success(response.message)
      router.push('/admin/dashboard')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useVerifyEmail = ({
  onVerified,
  onOpenChange,
}: {
  onVerified: () => void
  onOpenChange: (open: boolean) => void
}) => {
  return useMutation({
    mutationFn: (otpCode: string) => authApi.verifyEmail(otpCode),
    onSuccess: (data) => {
      toast.success(data.message)
      onVerified()
      onOpenChange(false)
    },
  })
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: (data) => {
      toast.success(data.message)
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword({ email }),
    onSuccess: (data) => {
      toast.success(data.message)
    },
  })
}

export const useResetPassword = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: (data: ResetPasswordDto) => authApi.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message)
      router.push('/login')
    },
  })
}
