import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">SMS</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  College
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A modern platform for managing students, teachers, courses, and academic operations.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Student portal
                </Link>
              </li>
              <li>
                <Link
                  href="/teacher/login"
                  className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Teacher portal
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/access"
                  className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Admin access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Institution
            </h4>
            <ul className="space-y-3">
              {['About PNC', 'Contact us', 'Faculty', 'Campus life'].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-3">
              {['Privacy policy', 'Terms of service', 'Accessibility'].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 mt-12">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SMS College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
