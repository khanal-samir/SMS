'use client'

import { LazyMotion, domAnimation, m } from 'motion/react'
import { Briefcase, Code, Database, Globe, Shield, Server, Building } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const CAREERS = [
  {
    title: 'Software Engineer',
    description:
      'Design and build scalable software applications using modern frameworks and best practices.',
    icon: Code,
    salary: 'NPR 5-15 LPA',
    companies: ['Tech Companies', 'Startups', 'IT Firms'],
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Data Scientist',
    description:
      'Analyze complex datasets, build ML models, and derive insights for data-driven decisions.',
    icon: Database,
    salary: 'NPR 6-18 LPA',
    companies: ['Banks', 'Tech Corps', 'Research'],
    color: 'bg-accent/10 text-accent',
  },
  {
    title: 'Web Developer',
    description:
      'Create responsive, interactive web experiences using frontend and backend technologies.',
    icon: Globe,
    salary: 'NPR 4-12 LPA',
    companies: ['Agencies', 'Startups', 'Freelance'],
    color: 'bg-chart-3/10 text-chart-3',
  },
  {
    title: 'System Administrator',
    description: 'Manage IT infrastructure, servers, and ensure system reliability and security.',
    icon: Server,
    salary: 'NPR 4-10 LPA',
    companies: ['Banks', 'ISPs', 'Enterprises'],
    color: 'bg-chart-4/10 text-chart-4',
  },
  {
    title: 'Security Analyst',
    description:
      'Protect organizations from cyber threats through security audits and penetration testing.',
    icon: Shield,
    salary: 'NPR 5-14 LPA',
    companies: ['Banks', 'Govt', 'Security Firms'],
    color: 'bg-chart-5/10 text-chart-5',
  },
  {
    title: 'IT Consultant',
    description:
      'Advise organizations on technology strategy, digital transformation, and IT solutions.',
    icon: Briefcase,
    salary: 'NPR 6-20 LPA',
    companies: ['Consulting', 'Enterprises', 'Govt'],
    color: 'bg-primary/10 text-primary',
  },
]

const STATS = [
  { value: '85%', label: 'Employment Rate', sublabel: 'within 6 months' },
  { value: '50+', label: 'Hiring Partners', sublabel: 'tech companies' },
  { value: '12+', label: 'Career Paths', sublabel: 'to choose from' },
]

const ease = [0.22, 1, 0.36, 1] as const

export function LandingCareers() {
  return (
    <section
      id="careers"
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
            <Building className="size-3.5" />
            Career Paths
          </MotionItem>
          <MotionItem
            index={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Where Our <span className="text-gradient-accent">Graduates</span> Go
          </MotionItem>
          <MotionItem
            index={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            CSIT graduates pursue diverse and rewarding careers in technology, research, and
            innovation.
          </MotionItem>
        </AnimatedSection>

        <LazyMotion features={domAnimation}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {CAREERS.map((career, index) => (
              <m.div
                key={career.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease }}
                className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div
                    className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl ${career.color}`}
                  >
                    <career.icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {career.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {career.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {career.salary}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {career.companies.map((company) => (
                      <span
                        key={company}
                        className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {STATS.map((stat, index) => (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5, ease }}
                className="text-center p-6 rounded-2xl bg-muted/50 border border-border/50"
              >
                <div className="text-4xl sm:text-5xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
              </m.div>
            ))}
          </div>
        </LazyMotion>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
