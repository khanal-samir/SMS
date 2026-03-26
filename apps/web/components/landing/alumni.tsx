'use client'

import Image from 'next/image'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const ALUMNI = [
  {
    name: 'Rajesh Adhikari',
    batch: '2018',
    role: 'Senior Software Engineer',
    company: 'Smart Tech Solutions',
    quote:
      'The CSIT program at PNC gave me a strong foundation in software development. The practical approach to learning prepared me perfectly for the industry.',
    image: '/images/campus-convocation.jpg',
  },
  {
    name: 'Priya Sharma',
    batch: '2019',
    role: 'Data Scientist',
    company: 'Fusemachines Nepal',
    quote:
      'The mathematics and programming courses helped me transition into data science. I always received support from faculty during my research projects.',
    image: '/images/campus-admin.jpg',
  },
  {
    name: 'Bikash Gurung',
    batch: '2020',
    role: 'Full Stack Developer',
    company: 'Tech innovators',
    quote:
      'The curriculum was comprehensive and the lab sessions were incredibly helpful. PNC prepared me not just technically, but also professionally.',
    image: '/images/campus-events.jpg',
  },
  {
    name: 'Anisha Thapa',
    batch: '2017',
    role: 'IT Manager',
    company: 'Nepal Bank Ltd',
    quote:
      'The networking opportunities and industry exposure at PNC helped me land my first job. I credit my success to the strong foundation from CSIT.',
    image: '/images/campus-sports.jpg',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function LandingAlumni() {
  return (
    <section id="alumni" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-muted/30">
      <div className="absolute inset-0 dot-pattern-light" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <MotionItem
            index={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
          >
            Alumni
          </MotionItem>
          <MotionItem
            index={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            Success Stories
          </MotionItem>
          <MotionItem
            index={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Our graduates are making an impact across industries. Here are some of their stories.
          </MotionItem>
        </AnimatedSection>

        <LazyMotion features={domAnimation}>
          <div className="grid gap-8 md:grid-cols-2">
            {ALUMNI.map((alumni, index) => (
              <m.div
                key={alumni.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.6, ease }}
                className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-6 right-6 text-7xl leading-none text-primary/[0.06] select-none font-serif">
                  &ldquo;
                </div>

                <div className="relative flex flex-col sm:flex-row gap-6">
                  <div className="relative shrink-0">
                    <div className="size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-primary/20">
                      <Image
                        src={alumni.image}
                        alt={alumni.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <blockquote className="text-base sm:text-lg leading-relaxed text-foreground/90 mb-4">
                      &ldquo;{alumni.quote}&rdquo;
                    </blockquote>
                    <div>
                      <div className="font-semibold text-foreground">{alumni.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {alumni.role} at {alumni.company}
                      </div>
                      <div className="text-xs text-primary mt-1">Batch of {alumni.batch}</div>
                    </div>
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-6">
              Join hundreds of CSIT graduates building successful careers in technology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                View all alumni
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors text-sm font-medium"
              >
                Connect on LinkedIn
              </a>
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  )
}
