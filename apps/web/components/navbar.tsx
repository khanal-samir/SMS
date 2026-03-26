'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'motion/react'
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Calendar,
  Bell,
  BookOpen,
  Users,
  Briefcase,
  GraduationCap,
  Library,
  Newspaper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const NAV_SECTIONS = [
  {
    label: 'Home',
    href: '/',
    icon: null,
  },
  {
    label: 'Features',
    href: '#features',
    icon: null,
  },
  {
    label: 'Academics',
    href: '#tech-stack',
    dropdown: [
      { label: 'Curriculum', href: '#tech-stack', icon: BookOpen },
      { label: 'Career Paths', href: '#careers', icon: Briefcase },
      { label: 'Tech Stack', href: '#tech-stack', icon: GraduationCap },
    ],
  },
  {
    label: 'Campus Life',
    href: '#events',
    dropdown: [
      { label: 'Events', href: '#events', icon: Calendar },
      { label: 'News & Notices', href: '#news', icon: Bell },
      { label: 'Alumni', href: '#alumni', icon: Users },
    ],
  },
  {
    label: 'Resources',
    href: '#',
    dropdown: [
      { label: 'Library', href: '#', icon: Library },
      { label: 'News', href: '#news', icon: Newspaper },
    ],
  },
]

const TOP_LINKS = [
  { label: 'TU Portal', href: 'https://tu.edu.np', external: true },
  { label: 'CSIT Syllabus', href: '#', external: false },
  { label: 'Contact', href: '#contact', external: false },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

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
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-8 text-xs">
              <div className="flex items-center gap-4">
                {TOP_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="hover:text-white/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="font-medium">Bhimkali Patan, Bagar Pokhara, Nepal</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            scrolled ? 'py-3' : 'py-4'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            >
              <div className="relative flex items-center gap-2">
                <Image
                  src="/images/prnc-logo.png"
                  alt="PRNC Logo"
                  width={scrolled ? 48 : 56}
                  height={scrolled ? 48 : 56}
                  className="transition-all duration-300"
                  priority
                />
                <div className="flex flex-col">
                  <span
                    className={`font-display font-bold text-primary leading-tight transition-all duration-300 ${
                      scrolled ? 'text-lg' : 'text-xl'
                    }`}
                  >
                    Prithvi Narayan Campus
                  </span>
                  <span className="text-xs font-medium text-muted-foreground tracking-wide">
                    B.Sc. CSIT Department
                  </span>
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_SECTIONS.map((section) => (
                <div
                  key={section.label}
                  className="relative"
                  onMouseEnter={() => section.dropdown && setActiveDropdown(section.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {section.dropdown ? (
                    <>
                      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg">
                        {section.label}
                        <ChevronDown
                          className={`size-3.5 transition-transform ${activeDropdown === section.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === section.label && (
                          <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 pt-2"
                          >
                            <div className="bg-card border border-border rounded-xl shadow-lg py-2 min-w-48">
                              {section.dropdown.map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                                >
                                  {item.icon && (
                                    <item.icon className="size-4 text-muted-foreground" />
                                  )}
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={section.href}
                      className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg"
                    >
                      {section.label}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
                <Link href="/login">Student Portal</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="group font-semibold gap-1.5 rounded-lg bg-accent hover:bg-accent/90"
              >
                <Link href="/teacher/login">
                  Faculty Portal
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="relative flex items-center justify-center size-10 rounded-xl text-foreground transition-colors hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.label}>
                    {section.dropdown ? (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {section.label}
                        </div>
                        {section.dropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={closeMobile}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                          >
                            {item.icon && <item.icon className="size-4" />}
                            {item.label}
                          </a>
                        ))}
                      </>
                    ) : (
                      <a
                        href={section.href}
                        onClick={closeMobile}
                        className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      >
                        {section.label}
                      </a>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 border-t border-border pt-4 mt-3">
                  <Button variant="ghost" asChild className="w-full justify-center">
                    <Link href="/login" onClick={closeMobile}>
                      Student Portal
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-center font-semibold bg-accent hover:bg-accent/90"
                  >
                    <Link href="/teacher/login" onClick={closeMobile}>
                      Faculty Portal
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
