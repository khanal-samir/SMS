import { Quote } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const TESTIMONIALS = [
  {
    quote:
      'The platform has transformed how we manage our academic operations. What used to take hours now takes minutes.',
    name: 'Dr. Ramesh Adhikari',
    role: 'Head of Department, CSIT',
    initials: 'RA',
  },
  {
    quote:
      'As a student, having everything in one place — grades, schedules, resources — has made my academic life significantly smoother.',
    name: 'Priya Sharma',
    role: 'BSc. CSIT, 4th Semester',
    initials: 'PS',
  },
  {
    quote:
      'The attendance tracking and grade management tools have given me more time to focus on what matters most: teaching.',
    name: 'Suman Karki',
    role: 'Associate Professor',
    initials: 'SK',
  },
] as const

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <MotionItem
            index={0}
            className="text-sm font-semibold tracking-widest text-brand-accent uppercase"
          >
            What People Say
          </MotionItem>
          <MotionItem
            index={1}
            className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Trusted by Our Academic Community
          </MotionItem>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <MotionItem
                key={t.name}
                index={i}
                className="relative rounded-2xl border border-border/60 bg-card p-8"
              >
                <Quote className="mb-4 size-8 text-brand-accent/20" strokeWidth={1.5} />
                <blockquote className="font-display text-base italic leading-relaxed text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </MotionItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
