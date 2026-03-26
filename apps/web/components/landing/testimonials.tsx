'use client'

import { LazyMotion, domAnimation, m } from 'motion/react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const TESTIMONIALS = [
  {
    quote:
      'The CSIT portal has transformed how we manage our department. Attendance tracking, grade management, and announcements all in one place makes administration seamless.',
    name: 'Dr. Ramesh Adhikari',
    role: 'Head of Department, CSIT',
    batch: 'Faculty',
    featured: true,
  },
  {
    quote:
      'Having my grades, schedules, and resources accessible from anywhere has made my academic life so much easier. The interface is intuitive and the updates are instant.',
    name: 'Priya Sharma',
    role: 'B.Sc. CSIT, 6th Semester',
    batch: '2022',
  },
  {
    quote:
      'The attendance tracking and assignment submission features have given me more time to focus on what matters — teaching and mentoring students.',
    name: 'Suman Karki',
    role: 'Associate Professor, CSIT',
    batch: 'Faculty',
  },
  {
    quote:
      'The CSIT portal helped me stay organized throughout my final year. Project submissions, lab resources, and CGPA tracking were all easily accessible.',
    name: 'Bikash Gurung',
    role: 'B.Sc. CSIT Graduate',
    batch: '2023',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function LandingTestimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 grid-pattern-light" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <MotionItem
            index={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
          >
            Testimonials
          </MotionItem>
          <MotionItem
            index={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Trusted Across Our <span className="text-gradient-accent">Campus</span>
          </MotionItem>
          <MotionItem
            index={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Faculty and students share their experience with the CSIT portal.
          </MotionItem>
        </AnimatedSection>

        <LazyMotion features={domAnimation}>
          <div className="grid gap-6 lg:grid-cols-5">
            {TESTIMONIALS.map((testimonial) => {
              if (testimonial.featured) {
                return (
                  <m.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease }}
                    className="lg:col-span-3 relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 sm:p-10 transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04]"
                  >
                    <div className="absolute top-6 right-8 text-8xl leading-none text-primary/[0.06] select-none font-serif">
                      &ldquo;
                    </div>
                    <div className="relative">
                      <blockquote className="text-xl sm:text-2xl lg:text-3xl leading-snug text-foreground/90 max-w-2xl">
                        {testimonial.quote}
                      </blockquote>
                      <div className="mt-8 flex items-center gap-4">
                        <UserAvatar name={testimonial.name} size="lg" className="rounded-xl" />
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          <div className="text-xs text-primary mt-0.5">{testimonial.batch}</div>
                        </div>
                      </div>
                    </div>
                  </m.div>
                )
              }
              return null
            })}

            <div className="lg:col-span-2 flex flex-col gap-6">
              {TESTIMONIALS.filter((t) => !t.featured).map((testimonial) => (
                <m.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease }}
                  className="flex-1 relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04]"
                >
                  <div className="absolute top-4 right-6 text-5xl leading-none text-primary/[0.08] select-none font-serif">
                    &ldquo;
                  </div>
                  <div className="relative">
                    <blockquote className="text-sm leading-relaxed text-foreground/80 mb-4">
                      {testimonial.quote}
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={testimonial.name} size="lg" className="rounded-lg" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        <div className="text-xs text-primary">{testimonial.batch}</div>
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </LazyMotion>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
