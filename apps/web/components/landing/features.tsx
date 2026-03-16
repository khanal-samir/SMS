import { ClipboardCheck, BarChart3, Calendar, Users, MessageSquare, BookOpen } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: 'Attendance tracking',
    description: 'Automated daily attendance with real-time reporting and instant absence alerts.',
    accent: 'bg-primary/10 text-primary',
    span: 'sm:col-span-2',
  },
  {
    icon: BarChart3,
    title: 'Grade management',
    description: 'Comprehensive gradebook with GPA tracking, analytics, and progress reports.',
    accent: 'bg-success/10 text-success',
    span: '',
  },
  {
    icon: Calendar,
    title: 'Course scheduling',
    description: 'Smart timetable generation with conflict detection and room allocation.',
    accent: 'bg-warning/10 text-warning',
    span: '',
  },
  {
    icon: Users,
    title: 'Student analytics',
    description: 'Data-driven insights into performance, engagement, and academic trends.',
    accent: 'bg-info/10 text-info',
    span: 'sm:col-span-2',
  },
  {
    icon: MessageSquare,
    title: 'Communication hub',
    description: 'Instant messaging between students, teachers, and staff with group channels.',
    accent: 'bg-chart-5/10 text-chart-5',
    span: '',
  },
  {
    icon: BookOpen,
    title: 'Resource library',
    description: 'Centralized repository for materials, assignments, and academic resources.',
    accent: 'bg-chart-2/10 text-chart-2',
    span: '',
  },
] as const

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center"
      >
        <div className="h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <AnimatedSection className="max-w-3xl">
          <MotionItem
            index={0}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-primary"
          >
            <span className="inline-block w-8 h-px bg-primary/50" />
            What you get
          </MotionItem>
          <MotionItem
            index={1}
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] [text-wrap:balance]"
          >
            Everything our campus needs
          </MotionItem>
          <MotionItem
            index={2}
            className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl"
          >
            Purpose-built tools that streamline academic operations and enhance the experience for
            students and faculty at PNC.
          </MotionItem>
        </AnimatedSection>

        {/* Bento grid */}
        <AnimatedSection className="mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <MotionItem
                key={feature.title}
                index={i}
                className={`group relative cursor-pointer rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-7 sm:p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.04] hover:-translate-y-1 ${feature.span}`}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div
                    className={`mb-5 inline-flex size-12 items-center justify-center rounded-xl ${feature.accent} transition-all duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </MotionItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
