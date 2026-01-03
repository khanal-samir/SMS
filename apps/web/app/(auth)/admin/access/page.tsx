'use client'

import React, { useState } from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import { AdminLoginForm } from '@/components/admin-login-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [secretKey, setSecretKey] = useState('')
  const [error, setError] = useState('')

  const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (secretKey === ADMIN_SECRET_KEY) {
      setIsAuthorized(true)
    } else {
      setError('Invalid access key')
      setSecretKey('')
    }
  }

  if (!isAuthorized) {
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
              <form onSubmit={handleSecretSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="secret" className="text-sm font-medium">
                    Access Key
                  </label>
                  <Input
                    id="secret"
                    type="password"
                    value={secretKey}
                    onChange={(e) => {
                      setSecretKey(e.target.value)
                      setError('')
                    }}
                    placeholder="Enter access key"
                    autoFocus
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
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
