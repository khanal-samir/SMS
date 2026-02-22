export const EMAIL_QUEUE = 'email' as const

export const EmailJobName = {
  VERIFICATION: 'verification',
  PASSWORD_RESET: 'password-reset',
  TEACHER_APPROVED: 'teacher-approved',
} as const

export interface VerificationEmailData {
  email: string
  name: string
  otpCode: string
}

export interface PasswordResetEmailData {
  email: string
  name: string
  token: string
}

export interface TeacherApprovedEmailData {
  email: string
  name: string
}

export type EmailJobData = VerificationEmailData | PasswordResetEmailData | TeacherApprovedEmailData
