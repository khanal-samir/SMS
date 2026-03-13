import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'
import { UserAvatar } from '@/components/ui/user-avatar'

const TESTIMONIALS = [
  {
    quote:
      'The platform has transformed how we manage our academic operations. What used to take hours now takes minutes.',
    name: 'Dr. Ramesh Adhikari',
    role: 'Head of Department, CSIT',
  },
  {
    quote:
      'Having everything in one place — grades, schedules, resources — has made my academic life significantly smoother.',
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
    <section id="testimonials" className="relative py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <MotionItem index={0} className="text-primary text-sm font-semibold tracking-wide">
            Testimonials
          </MotionItem>
          <MotionItem
            index={1}
            className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight [text-wrap:balance]"
          >
            Trusted by educators worldwide
          </MotionItem>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <MotionItem
                key={t.name}
                index={i}
                className="rounded-xl border border-border/60 bg-card p-8 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="mb-4 text-4xl font-serif leading-none text-primary/20 select-none">
                  &ldquo;
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/80">
                  {t.quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-5">
                  <UserAvatar name={t.name} size="lg" />
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
