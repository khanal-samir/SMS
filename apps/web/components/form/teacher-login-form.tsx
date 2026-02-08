'use client'

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
import { LoginSchema, type LoginDto } from '@repo/schemas'
import Link from 'next/link'
import { useTeacherLogin } from '@/hooks/useAuth'

export function TeacherLoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const { mutate: login, isPending } = useTeacherLogin()

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
          <CardTitle className="font-display text-2xl font-bold">Teacher Sign In</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/teacher/register"
                  className="font-medium text-brand-accent underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherLoginForm
