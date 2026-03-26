import {
  ClipboardCheck,
  BarChart3,
  Calendar,
  BookOpen,
  MessageSquare,
  Bell,
  FileText,
  Users,
} from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: 'Attendance Tracking',
    description:
      'Real-time attendance monitoring with detailed reports and instant absence notifications for students and guardians.',
    accent: 'bg-primary/10 text-primary',
    span: 'sm:col-span-2',
  },
  {
    icon: BarChart3,
    title: 'Grade Management',
    description:
      'Semester-wise GPA tracking, CGPA analytics, and comprehensive grade reports for all subjects.',
    accent: 'bg-accent/10 text-accent',
    span: '',
  },
  {
    icon: Calendar,
    title: 'Course Scheduling',
    description:
      'Smart timetable with lab session management, room allocation, and conflict detection.',
    accent: 'bg-chart-3/10 text-chart-3',
    span: '',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description:
      'Access past papers, lab manuals, project documentation, and course materials in one place.',
    accent: 'bg-chart-4/10 text-chart-4',
    span: 'sm:col-span-2',
  },
  {
    icon: Bell,
    title: 'Announcements',
    description:
      'Stay updated with internship opportunities, hackathons, programming contests, and important notices.',
    accent: 'bg-chart-5/10 text-chart-5',
    span: '',
  },
  {
    icon: MessageSquare,
    title: 'Communication Hub',
    description:
      'Connect with peers through study groups, project collaboration, and direct messaging with faculty.',
    accent: 'bg-primary/10 text-primary',
    span: '',
  },
  {
    icon: Users,
    title: 'Student Analytics',
    description:
      'Data-driven insights into academic performance, attendance trends, and engagement metrics.',
    accent: 'bg-accent/10 text-accent',
    span: '',
  },
  {
    icon: FileText,
    title: 'Assignment Submission',
    description:
      'Submit projects and assignments with code attachments, track deadlines, and receive feedback.',
    accent: 'bg-chart-3/10 text-chart-3',
    span: '',
  },
] as const

export function LandingFeatures() {
  return (
    <section
      id="features"
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
            Features
          </MotionItem>
          <MotionItem
            index={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Everything You Need for <span className="text-gradient-accent">CSIT</span>
          </MotionItem>
          <MotionItem
            index={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A unified platform designed specifically for B.Sc. CSIT students and faculty at Prithvi
            Narayan Campus.
          </MotionItem>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <MotionItem
              key={feature.title}
              index={i}
              className={`group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 sm:p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${feature.span}`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div
                  className={`mb-5 inline-flex size-12 items-center justify-center rounded-xl ${feature.accent} transition-all duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </MotionItem>
          ))}
        </AnimatedSection>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
