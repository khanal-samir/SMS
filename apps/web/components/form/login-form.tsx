'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FieldSeparator } from '@/components/ui/field'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginDto } from '@repo/schemas'
import { useLogin, useGoogleAuth } from '@/hooks/useAuth'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import Link from 'next/link'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const { mutate: login, isPending } = useLogin()
  const { initiateGoogleLogin } = useGoogleAuth()

  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginDto) => {
    login(data)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-display text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Login with your Google account or Email</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <GoogleAuthButton
                text="Login with Google"
                onClick={initiateGoogleLogin}
                disabled={isPending}
              />

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-xs text-brand-accent underline-offset-4 hover:underline font-medium"
                      >
                        Forgot your password?
                      </Link>
                    </div>
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
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>

              <FormDescription className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-brand-accent underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </FormDescription>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="px-2 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}
