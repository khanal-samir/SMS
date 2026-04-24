import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/navbar'
import { LandingHero } from '@/components/landing/hero'
import { LandingFooter } from '@/components/landing/footer'

const LandingTechStack = dynamic(
  () => import('@/components/landing/tech-stack').then((module) => module.LandingTechStack),
)

const LandingNews = dynamic(
  () =>
    import('@/components/landing/news-announcements').then((module) => module.LandingNews),
)

const LandingEvents = dynamic(
  () => import('@/components/landing/events').then((module) => module.LandingEvents),
)

const LandingCareers = dynamic(
  () => import('@/components/landing/careers').then((module) => module.LandingCareers),
)

const LandingAlumni = dynamic(
  () => import('@/components/landing/alumni').then((module) => module.LandingAlumni),
)

const LandingTestimonials = dynamic(
  () =>
    import('@/components/landing/testimonials').then((module) => module.LandingTestimonials),
)

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
