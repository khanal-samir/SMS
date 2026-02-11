'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { GraduationCap } from 'lucide-react'

const QUOTES = [
  {
    text: 'The roots of education are bitter, but the fruit is sweet.',
    author: 'Aristotle',
  },
  {
    text: 'Education is not the filling of a pail, but the lighting of a fire.',
    author: 'W.B. Yeats',
  },
  {
    text: 'The beautiful thing about learning is that no one can take it away from you.',
    author: 'B.B. King',
  },
  {
    text: 'An investment in knowledge pays the best interest.',
    author: 'Benjamin Franklin',
  },
] as const

function GeometricPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`,
        }}
      />
      <div className="absolute -right-20 -top-20 size-80 rounded-full border border-current" />
      <div className="absolute -left-10 bottom-20 size-60 rounded-full border border-current" />
      <div className="absolute right-20 bottom-40 size-40 rounded-full border border-current" />
    </div>
  )
}

function getPageContext(pathname: string) {
  if (pathname.includes('teacher')) {
    return { portal: 'Teacher', accent: 'text-emerald-400' }
  }
  if (pathname.includes('admin')) {
    return { portal: 'Admin', accent: 'text-brand-foreground/70' }
  }
  return { portal: 'Student', accent: 'text-brand-accent' }
}

export function AuthSidePanel() {
  const pathname = usePathname()
  const { portal, accent } = getPageContext(pathname)

  const quoteIndex =
    pathname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % QUOTES.length
  const quote = QUOTES[quoteIndex]!

  return (
    <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-brand p-10 text-brand-foreground lg:flex noise-overlay">
      <GeometricPattern />

      <div className="absolute inset-0 grid-pattern" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-brand-accent/6 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative z-10"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand-accent text-brand-accent-foreground transition-transform duration-300 group-hover:scale-105">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold leading-tight">SMS</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-foreground/40">
              College
            </span>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative z-10 max-w-md"
      >
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-display text-2xl font-medium italic leading-relaxed text-brand-foreground/80">
              &ldquo;{quote.text}&rdquo;
            </p>
            <footer className="mt-4">
              <span className={`text-sm font-semibold ${accent}`}>&mdash; {quote.author}</span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 flex items-center gap-2"
      >
        <div
          className={`size-2 rounded-full ${
            accent === 'text-brand-accent'
              ? 'bg-brand-accent'
              : accent === 'text-emerald-400'
                ? 'bg-emerald-400'
                : 'bg-brand-foreground/50'
          }`}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-brand-foreground/40">
          {portal} Portal
        </span>
      </motion.div>
    </div>
  )
}
