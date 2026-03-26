import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingTechStack } from '@/components/landing/tech-stack'
import { LandingNews } from '@/components/landing/news-announcements'
import { LandingEvents } from '@/components/landing/events'
import { LandingCareers } from '@/components/landing/careers'
import { LandingAlumni } from '@/components/landing/alumni'
import { LandingTestimonials } from '@/components/landing/testimonials'
import { LandingFooter } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'PNC CSIT Portal — Prithvi Narayan Campus, B.Sc. CSIT',
  description:
    'Student Portal for B.Sc. CSIT at Prithvi Narayan Campus, Tribhuvan University. Manage academics, attendance, grades, and resources.',
  keywords: [
    'PNC',
    'CSIT',
    'Prithvi Narayan Campus',
    'Tribhuvan University',
    'B.Sc. CSIT',
    'Student Portal',
  ],
  openGraph: {
    title: 'PNC CSIT Portal — Prithvi Narayan Campus',
    description: 'Student Portal for B.Sc. CSIT at Prithvi Narayan Campus, Tribhuvan University.',
    type: 'website',
    locale: 'en_NP',
  },
}

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <LandingHero />
      <LandingTechStack />
      <LandingNews />
      <LandingEvents />
      <LandingCareers />
      <LandingAlumni />
      <LandingTestimonials />
      <LandingFooter />
    </main>
  )
}
