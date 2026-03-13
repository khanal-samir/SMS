'use client'

import Link from 'next/link'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { value: '100+', label: 'Students' },
  { value: '20+', label: 'Faculty members' },
  { value: '30+', label: 'Courses' },
] as const

export function LandingHero() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-foreground noise-overlay">
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Subtle monochrome radial ambient */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 size-[800px] rounded-full bg-background/5 blur-[120px]" />
        <div className="absolute right-0 bottom-0 size-[400px] rounded-full bg-background/3 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/5 px-4 py-1.5 text-xs font-medium tracking-wide text-background/70"
          >
            <span className="inline-block size-1.5 rounded-full bg-background/50 animate-pulse" />
            Student Management System
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-background sm:text-5xl md:text-6xl lg:text-7xl [text-wrap:balance]"
          >
            Your campus,
            <br />
            <span className="relative">
              organized{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-background/60">and simplified</span>
                <m.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                  className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-background/30"
                />
              </span>
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-background/50 sm:text-lg md:text-xl"
          >
            A unified platform for students, teachers, and administrators to manage academics, track
            progress, and stay connected.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              asChild
              className="bg-background text-foreground hover:bg-background/90 group h-12 px-8 text-sm font-semibold shadow-lg"
            >
              <Link href="/register">
                Get started
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background h-12 px-8 text-sm font-semibold"
            >
              <Link href="/teacher/login">Teacher portal</Link>
            </Button>
          </m.div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-20 flex items-center justify-center gap-8 sm:gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold tabular-nums text-background sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs tracking-wider text-background/40 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </m.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
    </LazyMotion>
  )
}
