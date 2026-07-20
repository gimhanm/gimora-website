'use client'

import ReviewsList from '../reviews/ReviewsList'
import ReviewForm from '../reviews/ReviewForm'

export default function TestimonialsSection() {

  return (
    <section className="section-spacing bg-secondary/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Customer Reviews
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="h-1 w-12 bg-accent" />
            <div className="h-1 w-12 bg-accent/50" />
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            What our customers say about GIMORA products
          </p>
        </div>

        {/* Reviews List with Stats */}
        <div className="mb-16">
          <ReviewsList />
        </div>

        {/* Write a Review Section */}
        <div className="mt-20 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
              Share Your Review
            </h3>
            <p className="text-foreground/70">
              Help others discover the quality of GIMORA products
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg premium-border">
            <ReviewForm />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="p-8 bg-white rounded-lg premium-border text-center">
          <p className="text-foreground/70 mb-6 font-medium">
            Trusted by businesses across 40+ countries
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-center text-sm text-foreground/60">
            {[
              'Importers',
              'Chefs',
              'Wellness Brands',
              'Retailers',
              'Hotels',
              'Restaurants',
            ].map((category) => (
              <div key={category} className="px-4 py-2 bg-secondary rounded-full">
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
