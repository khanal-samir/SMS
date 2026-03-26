import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Facebook, ExternalLink } from 'lucide-react'

const footerLinks = {
  portals: [
    { label: 'Student Portal', href: '/login' },
    { label: 'Faculty Portal', href: '/teacher/login' },
    { label: 'Admin Access', href: '/admin/access' },
  ],
  academics: [
    { label: 'CSIT Syllabus', href: '#' },
    { label: 'Past Papers', href: '#' },
    { label: 'Results', href: '#' },
    { label: 'Academic Calendar', href: '#' },
  ],
  resources: [
    { label: 'Downloads', href: '#' },
    { label: 'Library', href: '#' },
    { label: 'E-Journals', href: '#' },
    { label: 'Research', href: '#' },
  ],
  campus: [
    { label: 'About PNC', href: '#' },
    { label: 'Faculty & Staff', href: '#' },
    { label: 'Campus Life', href: '#' },
    { label: 'Contact Us', href: '#contact' },
  ],
}

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/pncampus.edu.np', icon: Facebook },
]

export function LandingFooter() {
  return (
    <footer className="relative bg-primary text-primary-foreground">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 group cursor-pointer mb-6">
                <div className="relative">
                  <Image
                    src="/images/prnc-logo.png"
                    alt="PRNC Logo"
                    width={56}
                    height={56}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-display font-bold leading-tight">
                    Prithvi Narayan Campus
                  </span>
                  <span className="text-xs text-primary-foreground/70 tracking-wider uppercase">
                    B.Sc. CSIT Department
                  </span>
                </div>
              </Link>
              <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-md mb-6">
                A unified platform for students and faculty of B.Sc. CSIT at Prithvi Narayan Campus
                — Tribhuvan University. Manage academics, attendance, grades, and resources in one
                place.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <MapPin className="size-4 shrink-0" />
                  <span>Bhimkali Patan, Bagar Pokhara, Nepal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Phone className="size-4 shrink-0" />
                  <span>061-576837</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                  <Mail className="size-4 shrink-0" />
                  <span>info@prnc.tu.edu.np</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                    aria-label={link.label}
                  >
                    <link.icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-4">
                Portals
              </h4>
              <ul className="space-y-3">
                {footerLinks.portals.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-4">
                Academics
              </h4>
              <ul className="space-y-3">
                {footerLinks.academics.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-4">
                Campus
              </h4>
              <ul className="space-y-3">
                {footerLinks.campus.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
              <span>&copy; {new Date().getFullYear()} Prithvi Narayan Campus.</span>
              <span>All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-primary-foreground/60">
              <a
                href="https://tu.edu.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary-foreground transition-colors"
              >
                Tribhuvan University
                <ExternalLink className="size-3" />
              </a>
              <span>|</span>
              <span>Student Management System</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
