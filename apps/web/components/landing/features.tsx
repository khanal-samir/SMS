import { ClipboardCheck, BarChart3, Calendar, MessageSquare, BookOpen, Users } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: 'Attendance Tracking',
    description: 'Automated daily attendance with real-time reporting and absence notifications.',
  },
  {
    icon: BarChart3,
    title: 'Grade Management',
    description: 'Comprehensive gradebook with analytics, GPA calculations, and progress tracking.',
  },
  {
    icon: Calendar,
    title: 'Course Scheduling',
    description: 'Smart timetable generation with conflict detection and room allocation.',
  },
  {
    icon: Users,
    title: 'Student Analytics',
    description: 'Data-driven insights into student performance, engagement, and academic trends.',
  },
  {
    icon: MessageSquare,
    title: 'Communication Hub',
    description: 'Seamless messaging between students, teachers, and administration.',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description:
      'Centralized repository for course materials, assignments, and academic resources.',
  },
] as const

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <MotionItem
            index={0}
            className="text-sm font-semibold tracking-widest text-brand-accent uppercase"
          >
            Platform Capabilities
          </MotionItem>
          <MotionItem
            index={1}
            className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything Your Institution Needs
          </MotionItem>
          <MotionItem index={2} className="mt-4 text-base leading-relaxed text-muted-foreground">
            Purpose-built tools that streamline academic operations and enhance the educational
            experience for everyone.
          </MotionItem>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <MotionItem
                key={feature.title}
                index={i}
                className="group relative rounded-2xl border border-border/60 bg-card p-8 transition-all duration-300 hover:border-brand-accent/30 hover:shadow-lg hover:shadow-brand-accent/5"
              >
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-brand/5 text-brand transition-colors duration-300 group-hover:bg-brand-accent/10 group-hover:text-brand-accent">
                  <feature.icon className="size-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
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
