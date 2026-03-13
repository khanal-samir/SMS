import { ClipboardCheck, BarChart3, Calendar, Users, MessageSquare, BookOpen } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: 'Attendance tracking',
    description: 'Automated daily attendance with real-time reporting and instant absence alerts.',
  },
  {
    icon: BarChart3,
    title: 'Grade management',
    description: 'Comprehensive gradebook with GPA tracking, analytics, and progress reports.',
  },
  {
    icon: Calendar,
    title: 'Course scheduling',
    description: 'Smart timetable generation with conflict detection and room allocation.',
  },
  {
    icon: Users,
    title: 'Student analytics',
    description: 'Data-driven insights into performance, engagement, and academic trends.',
  },
  {
    icon: MessageSquare,
    title: 'Communication hub',
    description: 'Instant messaging between students, teachers, and staff with group channels.',
  },
  {
    icon: BookOpen,
    title: 'Resource library',
    description: 'Centralized repository for materials, assignments, and academic resources.',
  },
] as const

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Decorative blurred gradient behind the grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center"
      >
        <div className="h-[480px] w-[480px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <MotionItem index={0} className="text-sm font-semibold tracking-wide text-primary">
            Platform capabilities
          </MotionItem>
          <MotionItem
            index={1}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl [text-wrap:balance]"
          >
            Everything your institution needs
          </MotionItem>
          <MotionItem index={2} className="mt-4 text-base leading-relaxed text-muted-foreground">
            Purpose-built tools that streamline academic operations and enhance the educational
            experience for everyone.
          </MotionItem>
        </AnimatedSection>

        {/* Feature cards */}
        <AnimatedSection className="mt-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <MotionItem
                key={feature.title}
                index={i}
                className="group cursor-pointer rounded-xl border border-border/60 bg-card p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                  <feature.icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </MotionItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
