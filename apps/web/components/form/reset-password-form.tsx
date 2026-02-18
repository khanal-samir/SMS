'use client'

import { Suspense } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetPasswordSchema, type ResetPasswordDto } from '@repo/schemas'
import { useResetPassword } from '@/hooks/useAuth'
import { useSearchParams } from 'next/navigation'

function ResetPasswordFormInner({ className, ...props }: React.ComponentProps<'div'>) {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const otpParam = searchParams.get('otp') || searchParams.get('token') || ''

  const { mutate: resetPassword, isPending } = useResetPassword()

  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: emailParam,
      otp: otpParam,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: ResetPasswordDto) => {
    resetPassword(data)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-display text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {otpParam
              ? 'Enter your new password below.'
              : 'Enter the 6-digit code sent to your email and your new password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-10 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold"
                disabled={isPending}
              >
                {isPending ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export function ResetPasswordForm(props: React.ComponentProps<'div'>) {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
      <ResetPasswordFormInner {...props} />
    </Suspense>
  )
}
