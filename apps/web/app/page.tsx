import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingTestimonials } from '@/components/landing/testimonials'
import { LandingFooter } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'SMS College — Student Management System',
  description:
    'A unified platform for students, teachers, and administrators to manage academics, track progress, and build a thriving educational community.',
}

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <LandingHero />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingFooter />
    </main>
  )
}
