import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-brand noise-overlay">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-accent text-brand-accent-foreground">
                <GraduationCap className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-brand-foreground">
                  PNC CSIT
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-foreground/40">
                  College
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-brand-foreground/50">
              Empowering education through intelligent management and modern technology.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-foreground/40">
              Platform
            </h4>
            <ul className="space-y-3">
              {['Features', 'Student Portal', 'Teacher Portal', 'Admin Access'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-brand-foreground/60 transition-colors hover:text-brand-accent"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-foreground/40">
              Institution
            </h4>
            <ul className="space-y-3">
              {['About PNC', 'Contact Us', 'Faculty', 'Campus Life'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-brand-foreground/60 transition-colors hover:text-brand-accent"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-foreground/40">
              Legal
            </h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Accessibility', 'Data Protection'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-brand-foreground/60 transition-colors hover:text-brand-accent"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-foreground/10 pt-8 sm:flex-row">
          <p className="text-xs text-brand-foreground/40">
            &copy; {new Date().getFullYear()} PNC CSIT College. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Twitter', 'Facebook', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-brand-foreground/40 transition-colors hover:text-brand-accent"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
