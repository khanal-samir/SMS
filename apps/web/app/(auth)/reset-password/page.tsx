import { ResetPasswordForm } from '@/components/form/reset-password-form'
import { Suspense } from 'react'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
