'use client'
import React, { useActionState } from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import { AdminLoginForm } from '@/components/form/admin-login-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { verifyAdminSecret } from '@/actions/admin'

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(verifyAdminSecret, {
    isAuthorized: false,
    error: null,
  })

  if (state.isAuthorized) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            PNC CSIT
          </a>
          <AdminLoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          PNC CSIT
        </a>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Access Portal</CardTitle>
            <CardDescription>Enter access key to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="secret" className="text-sm font-medium">
                  Access Key
                </label>
                <Input
                  id="secret"
                  name="secret"
                  type="password"
                  placeholder="Enter access key"
                  autoFocus
                  required
                />
                {state.error && <p className="text-sm text-red-500">{state.error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
