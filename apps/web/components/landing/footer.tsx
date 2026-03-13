import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-foreground noise-overlay">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-background text-foreground">
                <GraduationCap className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-background">SMS</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-background/40">
                  College
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-background/50">
              A modern platform for managing students, teachers, courses, and academic operations.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-background/40">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-background/60 transition-colors hover:text-background"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-background/60 transition-colors hover:text-background"
                >
                  Student portal
                </Link>
              </li>
              <li>
                <Link
                  href="/teacher/login"
                  className="text-sm text-background/60 transition-colors hover:text-background"
                >
                  Teacher portal
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/access"
                  className="text-sm text-background/60 transition-colors hover:text-background"
                >
                  Admin access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-background/40">
              Institution
            </h4>
            <ul className="space-y-3">
              {['About PNC', 'Contact us', 'Faculty', 'Campus life'].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-background/40">
              Legal
            </h4>
            <ul className="space-y-3">
              {['Privacy policy', 'Terms of service', 'Accessibility'].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-xs text-background/40">
            &copy; {new Date().getFullYear()} SMS College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
