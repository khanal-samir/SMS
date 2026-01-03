'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { useVerifyEmail, useResendVerification } from '@/hooks/useAuth'

interface VerifyEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onVerified: () => void
}

export function VerifyEmailDialog({
  open,
  onOpenChange,
  email,
  onVerified,
}: VerifyEmailDialogProps) {
  const [otp, setOtp] = useState('')
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail()
  const { mutate: resendVerification, isPending: isResending } = useResendVerification()

  const handleComplete = (value: string) => {
    if (value.length === 6) {
      verifyEmail(value)
      onVerified()
      onOpenChange(false)
      setOtp('')
    }
  }

  const handleResend = () => {
    resendVerification(email)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>Enter the 6-digit OTP code sent to {email}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleComplete}
            disabled={isVerifying}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
            <Button variant="outline" onClick={handleResend} disabled={isResending || isVerifying}>
              {isResending ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
