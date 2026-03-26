'use client'

import Image from 'next/image'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const EVENTS = [
  {
    id: 1,
    title: 'PhD Research Dissemination Program',
    description: 'The 10th episode featuring research presentations from faculty members.',
    date: '2025-04-29',
    time: '10:00 AM - 1:00 PM',
    location: 'Seminar Hall, Science Building',
    image: '/images/campus-events.jpg',
    type: 'Academic',
  },
  {
    id: 2,
    title: 'Inter-Faculty Sports Competition',
    description: 'Annual sports competition featuring football, basketball, and athletics.',
    date: '2024-12-25',
    time: '9:00 AM - 5:00 PM',
    location: 'Campus Sports Ground',
    image: '/images/campus-sports.jpg',
    type: 'Sports',
  },
  {
    id: 3,
    title: 'PNC-MIT Collaborative Workshop',
    description: 'International research collaboration workshop on emerging technologies.',
    date: '2024-12-26',
    time: '10:00 AM - 4:00 PM',
    location: 'Administrative Building',
    image: '/images/campus-admin.jpg',
    type: 'Workshop',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function LandingEvents() {
  return (
    <section id="events" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-pattern-light" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <MotionItem
            index={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Calendar className="size-3.5" />
            Upcoming Events
          </MotionItem>
          <MotionItem
            index={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Campus Activities
          </MotionItem>
          <MotionItem
            index={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Stay connected with academic events, workshops, and extracurricular activities at PNC.
          </MotionItem>
        </AnimatedSection>

        <LazyMotion features={domAnimation}>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((event, index) => (
              <m.article
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.6, ease }}
                className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {event.type}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View details
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </m.article>
            ))}
          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease }}
            className="mt-10 text-center"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all text-sm font-medium"
            >
              View all events
              <ArrowRight className="size-4" />
            </a>
          </m.div>
        </LazyMotion>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
