import Button from '../Button'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tea-plantation-hero.png"
          alt="Tea plantation in Sri Lanka"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay (50% opacity for maximum text contrast) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Brand Wordmark */}
          <div className="inline-block mb-8">
            <h1 className="font-heading text-7xl md:text-8xl font-bold text-white drop-shadow-lg tracking-wide">
              GIMORA
            </h1>
            <div className="h-1 w-24 bg-accent mx-auto mt-4 drop-shadow-md" />
          </div>

          {/* Subheading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold leading-tight text-white drop-shadow-lg">
            Premium Ceylon Tea & Pepper
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Discover the finest agricultural products from Sri Lanka. Crafted with heritage, quality, and sustainability at every step.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button href="#products" size="lg">
              Explore Products
            </Button>
            <Button href="#contact" size="lg">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="text-white text-center drop-shadow-md">
          <p className="text-sm mb-2">Scroll to discover</p>
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
