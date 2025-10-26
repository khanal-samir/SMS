import { z } from 'zod'
import { RoleEnum, UserSchema } from './user.schema'

//strategy
export const JwtPayloadSchema = z.object({
  sub: z.cuid(),
})
export type JwtPayload = z.infer<typeof JwtPayloadSchema>

//strategy
export const AuthUserSchema = z.object({
  id: z.cuid(),
  role: RoleEnum,
})
export type AuthUser = z.infer<typeof AuthUserSchema>

// refresh token response
export const RefreshResponseSchema = z.object({
  id: z.cuid(),
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>

export const AuthResponseSchema = UserSchema.omit({
  password: true,
  refreshToken: true,
  otpCode: true,
  otpExpiry: true,
  passwordResetOtp: true,
  passwordResetOtpExpiry: true,
})
export type AuthResponse = z.infer<typeof AuthResponseSchema>

export const ForgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
})
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>

export const VerifyPasswordResetOtpSchema = z.object({
  email: z.email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})
export type VerifyPasswordResetOtpDto = z.infer<typeof VerifyPasswordResetOtpSchema>

export const ResetPasswordSchema = z
  .object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>
