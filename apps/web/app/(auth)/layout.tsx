import { AuthSidePanel } from '@/components/auth/auth-side-panel'
import { AuthMobileHeader } from '@/components/auth/auth-mobile-header'

function AuthContent({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-sm">{children}</div>
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <AuthSidePanel />
      <div className="flex flex-1 flex-col">
        <AuthMobileHeader />
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <AuthContent>{children}</AuthContent>
        </div>
      </div>
    </div>
  )
}
