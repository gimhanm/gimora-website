import Navbar from '@/components/navbar/Navbar'
import HeroSection from '@/components/hero/HeroSection'
import AboutSection from '@/components/about/AboutSection'
import ProductsSection from '@/components/products/ProductsSection'
import FeaturesSection from '@/components/features/FeaturesSection'
import OriginsSection from '@/components/origins/OriginsSection'
import SustainabilitySection from '@/components/sustainability/SustainabilitySection'
import TestimonialsSection from '@/components/testimonials/TestimonialsSection'
import ContactSection from '@/components/contact/ContactSection'
import Footer from '@/components/footer/Footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <FeaturesSection />
        <OriginsSection />
        <SustainabilitySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
