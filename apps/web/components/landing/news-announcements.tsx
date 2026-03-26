'use client'
import { useState } from 'react'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { Bell, FileText, Calendar, Award, ArrowRight } from 'lucide-react'
import { AnimatedSection, MotionItem } from '@/components/landing/animated-section'

const NEWS = [
  {
    id: 1,
    type: 'news',
    title: 'PhD Research Dissemination Program',
    excerpt:
      'The 10th episode of PhD research dissemination program successfully conducted at PNC.',
    date: '2025-04-29',
    category: 'Research',
    image: '/images/campus-events.jpg',
  },
  {
    id: 2,
    type: 'news',
    title: 'PNC-MIT Collaborative Research Workshop',
    excerpt: 'International research collaboration workshop concluded with significant outcomes.',
    date: '2024-12-26',
    category: 'Workshop',
    image: '/images/campus-admin.jpg',
  },
  {
    id: 3,
    type: 'notice',
    title: 'Scholarship Application Notice',
    excerpt: 'Applications open for merit-based scholarships for eligible CSIT students.',
    date: '2026-03-10',
    category: 'Scholarship',
    icon: Award,
  },
  {
    id: 4,
    type: 'notice',
    title: 'Mini Research Grant Applications',
    excerpt: 'Call for applications for mini research grants for final year CSIT students.',
    date: '2026-01-30',
    category: 'Research',
    icon: FileText,
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function LandingNews() {
  const [activeTab, setActiveTab] = useState<'news' | 'notices'>('news')

  const filteredItems = NEWS.filter((item) =>
    activeTab === 'news' ? item.type === 'news' : item.type === 'notice',
  )

  return (
    <section id="news" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-muted/30">
      <div className="absolute inset-0 dot-pattern-light" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <MotionItem
            index={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Bell className="size-3.5" />
            Stay Updated
          </MotionItem>
          <MotionItem
            index={1}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            News & Announcements
          </MotionItem>
          <MotionItem
            index={2}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Latest updates, notices, and announcements from PNC CSIT Department.
          </MotionItem>
        </AnimatedSection>

        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease }}
            className="flex justify-center gap-2 mb-10"
          >
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'news'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="size-4" />
                News
              </span>
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'notices'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bell className="size-4" />
                Notices
              </span>
            </button>
          </m.div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredItems.map((item, index) => (
              <m.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5, ease }}
                className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                {'image' in item && item.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <m.img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                ) : (
                  <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      {'icon' in item && item.icon && (
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon className="size-6 text-primary" />
                        </div>
                      )}
                      <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <time className="text-xs text-muted-foreground uppercase tracking-wider">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.excerpt}
                  </p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Read more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </m.article>
            ))}
          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease }}
            className="mt-10 text-center"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all text-sm font-medium"
            >
              View all updates
              <ArrowRight className="size-4" />
            </a>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  )
}
