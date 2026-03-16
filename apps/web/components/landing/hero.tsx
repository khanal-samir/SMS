'use client'

import Link from 'next/link'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '100+', label: 'Students' },
  { value: '20+', label: 'Faculty' },
  { value: '30+', label: 'Courses' },
] as const

const ease = [0.22, 1, 0.36, 1] as const

export function LandingHero() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-background px-6 lg:px-8">
        {/* Single subtle ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-3xl w-full text-center">
          {/* Campus badge */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
            className="mb-8"
          >
            <span className="inline-block rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground">
              Prithvi Narayan Campus
            </span>
          </m.div>

          {/* Headline */}
          <m.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground"
          >
            Your academics, <span className="text-primary">one place</span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease }}
            className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-lg mx-auto"
          >
            Grades, attendance, schedules, and resources for students and faculty at PNC —
            accessible from anywhere.
          </m.p>

          {/* CTAs */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" asChild className="group h-11 px-7 text-sm font-semibold rounded-lg">
              <Link href="/login" className="cursor-pointer">
                Student Login
                <ArrowRight className="ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-11 px-7 text-sm font-semibold rounded-lg border-border/60 hover:border-primary/30 transition-colors"
            >
              <Link href="/teacher/login" className="cursor-pointer">
                Teacher Login
              </Link>
            </Button>
          </m.div>

          {/* Stats row */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7, ease }}
            className="mt-14 flex items-center justify-center gap-10 sm:gap-14"
          >
            {stats.map((stat, i) => (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.5, ease }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </m.div>
            ))}
          </m.div>
        </div>

        {/* Editorial rule at bottom */}
        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease }}
          className="absolute bottom-12 left-6 right-6 lg:left-8 lg:right-8 mx-auto max-w-7xl editorial-rule origin-center"
        />
      </section>
    </LazyMotion>
  )
}
