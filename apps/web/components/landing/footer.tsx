import Link from 'next/link'
import { GraduationCap, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  portals: [
    { label: 'Student Login', href: '/login' },
    { label: 'Teacher Login', href: '/teacher/login' },
    { label: 'Admin Access', href: '/admin/access' },
  ],
  campus: [
    { label: 'About PNC', href: '/' },
    { label: 'Contact us', href: '/' },
    { label: 'Faculty', href: '/' },
    { label: 'Campus life', href: '/' },
  ],
  legal: [
    { label: 'Privacy policy', href: '/' },
    { label: 'Terms of service', href: '/' },
    { label: 'Accessibility', href: '/' },
  ],
}

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border/40 bg-background">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px editorial-rule" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* CTA band */}
        <div className="py-16 sm:py-20 border-b border-border/30">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-lg">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Ready to get started?
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Log in to access your dashboard, grades, schedules, and everything else you need at
                PNC.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Student Login
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/teacher/login"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Teacher Login
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="py-12 grid gap-10 md:grid-cols-5">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3.5 cursor-pointer group">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                <GraduationCap className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold leading-none tracking-tight text-foreground">
                  SMS
                </span>
                <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  College
                </span>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground max-w-xs">
              The student management system for Prithvi Narayan Campus — managing academics,
              attendance, and campus operations.
            </p>
          </div>

          {/* Portal links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Portals
            </h4>
            <ul className="space-y-3">
              {footerLinks.portals.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Campus
            </h4>
            <ul className="space-y-3">
              {footerLinks.campus.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/30 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Prithvi Narayan Campus. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">Student Management System</p>
        </div>
      </div>
    </footer>
  )
}
