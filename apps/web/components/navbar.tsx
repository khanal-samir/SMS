'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'motion/react'
import { GraduationCap, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#testimonials', label: 'Testimonials' },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <m.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex size-10 items-center justify-center rounded-lg bg-brand-accent text-brand-accent-foreground transition-transform duration-300 group-hover:scale-105">
              <GraduationCap className="size-5" />
              <div className="absolute inset-0 rounded-lg gold-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold leading-tight tracking-tight">
                SMS
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                College
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Student Login</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 font-semibold"
            >
              <Link href="/teacher/login">Teacher Portal</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center size-10 rounded-lg text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-1 px-6 pb-6 pt-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Student Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
                  >
                    <Link href="/teacher/login">Teacher Portal</Link>
                  </Button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.header>
    </LazyMotion>
  )
}
