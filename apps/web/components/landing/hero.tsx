'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { LazyMotion, domAnimation, m } from 'motion/react'
import {
  ArrowRight,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const SLIDES = [
  {
    src: '/images/campus-admin.jpg',
    alt: 'Prithvi Narayan Campus Administrative Building',
    caption: 'Administrative Building',
  },
  {
    src: '/images/campus-sports.jpg',
    alt: 'Students participating in sports activities',
    caption: 'Campus Life & Sports',
  },
  {
    src: '/images/campus-events.jpg',
    alt: 'Academic events and seminars',
    caption: 'Academic Events',
  },
  {
    src: '/images/campus-convocation.jpg',
    alt: 'Convocation ceremony',
    caption: 'Convocation Ceremony',
  },
]

const STATS = [
  { value: '400+', label: 'Students', icon: Users },
  { value: '50+', label: 'Faculty', icon: GraduationCap },
  { value: '8', label: 'Semesters', icon: BookOpen },
  { value: '4+', label: 'Electives', icon: Layers },
]

const ease = [0.22, 1, 0.36, 1] as const

export function LandingHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = useCallback(() => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative min-h-[85vh] flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 hero-overlay" />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setCurrentSlide(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="size-6 text-white" />
        </button>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Image
                src="/images/tu-logo.png"
                alt="TU Logo"
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="text-xs font-medium text-white/90 tracking-wider uppercase">
                Tribhuvan University — Institute of Science & Technology
              </span>
            </div>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white text-center leading-tight"
          >
            Your <span className="text-accent">CSIT</span> journey
            <br />
            starts here
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease }}
            className="mt-6 text-lg sm:text-xl text-white/80 text-center max-w-2xl mx-auto leading-relaxed"
          >
            Manage your academics, attendance, grades, and resources — all in one unified platform
            for B.Sc. CSIT students at Prithvi Narayan Campus.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="group h-12 px-8 text-base font-semibold rounded-lg bg-accent hover:bg-accent/90"
            >
              <Link href="/login">
                Student Portal
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 px-8 text-base font-semibold rounded-lg bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Link href="/teacher/login">Faculty Portal</Link>
            </Button>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease }}
            className="mt-16 w-full max-w-4xl"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat, index) => (
                <m.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5, ease }}
                  className="flex flex-col items-center p-4 sm:p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="size-5 text-accent" />
                    <span className="text-3xl sm:text-4xl font-display font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
      </section>
    </LazyMotion>
  )
}
