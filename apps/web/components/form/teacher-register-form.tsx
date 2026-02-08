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
import { CreateUserSchema, type CreateUserDto } from '@repo/schemas'
import Link from 'next/link'
import { useTeacherRegister } from '@/hooks/useAuth'
import { useState } from 'react'
import { VerifyEmailDialog } from '@/components/form/verify-email-dialog'
import { useRouter } from 'next/navigation'

export function TeacherRegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const { mutate: register, isPending } = useTeacherRegister(setShowVerifyDialog)
  const router = useRouter()
  const form = useForm<CreateUserDto>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: CreateUserDto) => {
    register({ ...data, role: 'TEACHER' })
  }
  const handleVerified = () => {
    setShowVerifyDialog(false)
    router.push('/teacher/login')
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-display text-2xl font-bold">Create teacher account</CardTitle>
          <CardDescription>Sign up with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Password</FormLabel>
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
                {isPending ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/teacher/login"
                  className="font-medium text-brand-accent underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
      <VerifyEmailDialog
        open={showVerifyDialog}
        onOpenChange={setShowVerifyDialog}
        email={form.getValues('email') || ''}
        onVerified={handleVerified}
      />
    </div>
  )
}

export default TeacherRegisterForm
