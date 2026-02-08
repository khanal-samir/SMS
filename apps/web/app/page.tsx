import { Navbar } from '@/components/navbar'
import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingTestimonials } from '@/components/landing/testimonials'
import { LandingFooter } from '@/components/landing/footer'

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
