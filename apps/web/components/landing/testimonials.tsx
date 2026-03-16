import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'
import { UserAvatar } from '@/components/ui/user-avatar'

const TESTIMONIALS = [
  {
    quote:
      'SMS has transformed how we manage our department. What used to take hours of paperwork now takes minutes.',
    name: 'Dr. Ramesh Adhikari',
    role: 'Head of Department, CSIT',
  },
  {
    quote:
      'Having my grades, schedules, and resources all in one place has made my academic life so much smoother.',
    name: 'Priya Sharma',
    role: 'BSc. CSIT, 4th Semester',
  },
  {
    quote:
      'The attendance tracking and grade management tools have given me more time to focus on what matters most: teaching.',
    name: 'Suman Karki',
    role: 'Associate Professor',
  },
] as const

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 dot-pattern opacity-15" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimatedSection className="max-w-3xl">
          <MotionItem
            index={0}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-primary"
          >
            <span className="inline-block w-8 h-px bg-primary/50" />
            Testimonials
          </MotionItem>
          <MotionItem
            index={1}
            className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] [text-wrap:balance]"
          >
            Trusted across our campus
          </MotionItem>
        </AnimatedSection>

        {/* Testimonials — featured + two stacked */}
        <AnimatedSection className="mt-16">
          <div className="grid gap-5 md:grid-cols-5">
            {/* Featured testimonial */}
            <MotionItem
              index={0}
              className="md:col-span-3 relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 sm:p-10 transition-all duration-500 hover:shadow-xl hover:shadow-primary/[0.04] hover:border-primary/15 cursor-pointer group"
            >
              <div className="absolute top-6 right-8 text-[8rem] leading-none text-primary/[0.06] select-none font-serif">
                &ldquo;
              </div>
              <div className="relative">
                <blockquote className="text-xl sm:text-2xl lg:text-3xl leading-snug text-foreground/90 max-w-lg">
                  {TESTIMONIALS[0].quote}
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <UserAvatar name={TESTIMONIALS[0].name} size="lg" className="rounded-xl" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {TESTIMONIALS[0].name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {TESTIMONIALS[0].role}
                    </div>
                  </div>
                </div>
              </div>
            </MotionItem>

            {/* Stacked testimonials */}
            <div className="md:col-span-2 flex flex-col gap-5">
              {TESTIMONIALS.slice(1).map((t, i) => (
                <MotionItem
                  key={t.name}
                  index={i + 1}
                  className="flex-1 relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7 transition-all duration-500 hover:shadow-lg hover:shadow-primary/[0.04] hover:border-primary/15 cursor-pointer group"
                >
                  <div className="absolute top-4 right-6 text-5xl leading-none text-primary/[0.08] select-none font-serif">
                    &ldquo;
                  </div>
                  <div className="relative">
                    <blockquote className="text-sm leading-relaxed text-foreground/80">
                      {t.quote}
                    </blockquote>
                    <div className="mt-5 flex items-center gap-3 border-t border-border/30 pt-4">
                      <UserAvatar name={t.name} size="lg" className="rounded-lg" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </MotionItem>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
