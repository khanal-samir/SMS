'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'motion/react'
import { GraduationCap, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

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

  const closeMobile = useCallback(() => setMobileOpen(false), [])

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
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <div className="relative flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="size-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-none tracking-tight text-foreground">
                SMS
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                College
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="cursor-pointer rounded-md px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="font-semibold">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative flex cursor-pointer items-center justify-center size-10 rounded-lg text-foreground transition-colors duration-200 hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <m.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <X className="size-5" />
                  </m.span>
                ) : (
                  <m.span
                    key="open"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Menu className="size-5" />
                  </m.span>
                )}
              </AnimatePresence>
            </button>
          </div>
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
                    onClick={closeMobile}
                    className="block cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 border-t border-border/50 pt-4 mt-3">
                  <Button variant="ghost" asChild className="w-full justify-center">
                    <Link href="/login" onClick={closeMobile}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-center font-semibold">
                    <Link href="/register" onClick={closeMobile}>
                      Get Started
                    </Link>
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
