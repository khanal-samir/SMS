'use client'

import { useActionState } from 'react'
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
    return <AdminLoginForm />
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-display text-xl">Access Portal</CardTitle>
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
                required
              />
              {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
