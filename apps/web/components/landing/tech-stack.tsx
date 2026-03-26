'use client'

import { LazyMotion, domAnimation, m } from 'motion/react'
import { Code, Terminal, Layers, Cpu, Cloud } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const TECH_CATEGORIES = [
  {
    title: 'Programming Languages',
    description: 'Core languages taught throughout the CSIT curriculum',
    items: [
      { name: 'Python', icon: '🐍' },
      { name: 'Java', icon: '☕' },
      { name: 'C/C++', icon: '⚙️' },
      { name: 'JavaScript', icon: '📜' },
      { name: 'PHP', icon: '🐘' },
    ],
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Databases',
    description: 'Database management systems you will master',
    items: [
      { name: 'MySQL', icon: '🗄️' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'Oracle', icon: '🔴' },
    ],
    color: 'bg-accent/10 text-accent',
  },
  {
    title: 'Web Technologies',
    description: 'Frontend and backend web development',
    items: [
      { name: 'HTML/CSS', icon: '🎨' },
      { name: 'React', icon: '⚛️' },
      { name: 'Node.js', icon: '🟢' },
      { name: 'Express', icon: '🚂' },
      { name: 'Django', icon: '🎸' },
    ],
    color: 'bg-chart-3/10 text-chart-3',
  },
  {
    title: 'Tools & Environments',
    description: 'Development tools and platforms',
    items: [
      { name: 'Git', icon: '📦' },
      { name: 'Linux', icon: '🐧' },
      { name: 'Docker', icon: '🐳' },
      { name: 'VS Code', icon: '💻' },
      { name: 'Postman', icon: '📮' },
    ],
    color: 'bg-chart-4/10 text-chart-4',
  },
]

const ELECTIVES = [
  { name: 'Machine Learning & AI', icon: Cpu },
  { name: 'Mobile App Development', icon: Layers },
  { name: 'Cloud Computing', icon: Cloud },
  { name: 'Cyber Security', icon: Terminal },
]

const ease = [0.22, 1, 0.36, 1] as const

export function LandingTechStack() {
  return (
    <section
      id="tech-stack"
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-muted/30"
    >
      <div className="absolute inset-0 dot-pattern-light" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <MotionItem
            index={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Code className="size-3.5" />
            Curriculum
          </MotionItem>
          <MotionItem
            index={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Technologies You&apos;ll Master
          </MotionItem>
          <MotionItem
            index={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            B.Sc. CSIT curriculum covers a comprehensive range of programming languages, frameworks,
            and tools.
          </MotionItem>
        </AnimatedSection>

        <LazyMotion features={domAnimation}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TECH_CATEGORIES.map((category, catIndex) => (
              <m.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + catIndex * 0.1, duration: 0.5, ease }}
                className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl ${category.color}`}
                >
                  <Code className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </span>
                  ))}
                </div>
              </m.div>
            ))}
          </div>

          <AnimatedSection className="mt-12">
            <MotionItem index={0} className="text-center mb-6">
              <h3 className="text-xl font-display font-bold text-foreground">Elective Tracks</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Specialize in cutting-edge technology domains
              </p>
            </MotionItem>
            <div className="flex flex-wrap justify-center gap-4">
              {ELECTIVES.map((elective, index) => (
                <m.div
                  key={elective.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4, ease }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <elective.icon className="size-5 text-primary" />
                  <span className="font-medium text-foreground">{elective.name}</span>
                </m.div>
              ))}
            </div>
          </AnimatedSection>
        </LazyMotion>
      </div>
    </section>
  )
}
