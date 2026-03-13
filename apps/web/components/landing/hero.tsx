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

const ease = [0.22, 1, 0.36, 1] as const

export function LandingHero() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-background">
        {/* Decorative elements */}
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 size-[400px] rounded-full bg-primary/[0.03] blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20 text-center lg:px-8">
          {/* Badge */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium tracking-wide text-foreground/70"
          >
            <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
            Student Management System
          </m.div>

          {/* Headline */}
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease }}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl [text-wrap:balance]"
          >
            Manage your campus
            <br />
            <span className="relative inline-block">
              <span className="text-muted-foreground">with </span>
              <span className="relative inline-block">
                <span className="relative z-10">clarity</span>
                <m.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, ease }}
                  className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-primary/50"
                />
              </span>
              <span className="text-muted-foreground"> and confidence</span>
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A unified platform for students, teachers, and administrators to manage academics, track
            progress, and stay connected.
          </m.p>

          {/* CTAs */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="group h-12 px-8 text-sm font-semibold">
              <Link href="/register" className="cursor-pointer">
                Get started
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-8 text-sm font-semibold">
              <Link href="#features" className="cursor-pointer">
                Learn more
              </Link>
            </Button>
          </m.div>

          {/* Stats */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-16 inline-flex items-center divide-x divide-border"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="px-8 text-center first:pl-0 last:pr-0">
                <div className="text-2xl font-bold tabular-nums text-foreground">{stat.value}</div>
                <div className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </m.div>

          {/* Dashboard mockup */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease }}
            className="mt-16 mx-auto max-w-4xl rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/5 overflow-hidden"
          >
            {/* Window chrome */}
            <div className="h-10 bg-muted/50 border-b border-border/40 flex items-center px-4 gap-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>

            {/* Dashboard body */}
            <div className="p-6 space-y-4">
              {/* Stat cards row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/50 h-20 p-4 flex flex-col justify-between">
                  <div className="h-2 w-16 rounded-full bg-primary/20" />
                  <div className="h-3 w-10 rounded-full bg-foreground/10" />
                </div>
                <div className="rounded-lg bg-muted/50 h-20 p-4 flex flex-col justify-between">
                  <div className="h-2 w-20 rounded-full bg-primary/15" />
                  <div className="h-3 w-12 rounded-full bg-foreground/10" />
                </div>
                <div className="rounded-lg bg-muted/50 h-20 p-4 flex flex-col justify-between">
                  <div className="h-2 w-14 rounded-full bg-primary/25" />
                  <div className="h-3 w-8 rounded-full bg-foreground/10" />
                </div>
              </div>

              {/* Data table area */}
              <div className="h-40 rounded-lg bg-muted/30 border border-border/30 p-4 space-y-3">
                {/* Table header */}
                <div className="flex gap-3">
                  <div className="h-2 w-24 rounded-full bg-foreground/10" />
                  <div className="h-2 w-16 rounded-full bg-foreground/8" />
                  <div className="h-2 w-20 rounded-full bg-foreground/8" />
                  <div className="h-2 w-12 rounded-full bg-foreground/8" />
                </div>
                <div className="h-px bg-border/20" />
                {/* Table rows */}
                <div className="flex gap-3 items-center">
                  <div className="h-2 w-24 rounded-full bg-foreground/5" />
                  <div className="h-2 w-16 rounded-full bg-foreground/5" />
                  <div className="h-2 w-20 rounded-full bg-primary/15" />
                  <div className="h-2 w-12 rounded-full bg-foreground/5" />
                </div>
                <div className="h-px bg-border/20" />
                <div className="flex gap-3 items-center">
                  <div className="h-2 w-24 rounded-full bg-foreground/5" />
                  <div className="h-2 w-16 rounded-full bg-foreground/5" />
                  <div className="h-2 w-20 rounded-full bg-primary/10" />
                  <div className="h-2 w-12 rounded-full bg-foreground/5" />
                </div>
                <div className="h-px bg-border/20" />
                <div className="flex gap-3 items-center">
                  <div className="h-2 w-24 rounded-full bg-foreground/5" />
                  <div className="h-2 w-16 rounded-full bg-foreground/5" />
                  <div className="h-2 w-20 rounded-full bg-primary/20" />
                  <div className="h-2 w-12 rounded-full bg-foreground/5" />
                </div>
              </div>
            </div>
          </m.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>
    </LazyMotion>
  )
}
