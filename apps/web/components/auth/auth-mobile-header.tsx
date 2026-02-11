import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function AuthMobileHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 p-6 lg:hidden">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
          <GraduationCap className="size-4" />
        </div>
        <span className="font-display text-base font-bold">SMS</span>
      </Link>
    </div>
  )
}
