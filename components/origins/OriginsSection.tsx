import Image from 'next/image'

export default function OriginsSection() {
  const origins = [
    {
      title: 'Ceylon Black Tea',
      region: 'The Highlands',
      description:
        'Grown in the misty highlands of central Sri Lanka at elevations between 2,000-6,000 feet. The cool temperatures and abundant rainfall create ideal conditions for cultivating tea with distinctive flavor profiles. Our tea undergoes traditional oxidation and processing methods that have been perfected over centuries.',
      highlights: ['Rich, full-bodied flavor', 'Natural sweetness', 'Smooth finish', 'Antioxidant-rich'],
    },
    {
      title: 'Black Pepper',
      region: 'The Spice Gardens',
      description:
        'Cultivated in the southwestern regions of Sri Lanka where tropical climate and fertile soil create perfect conditions. Our pepper is hand-picked at peak ripeness and sun-dried using traditional methods. The result is pepper with distinctive pungency and complex aromatic qualities.',
      highlights: ['Distinctive aroma', 'Pungent heat', 'Fresh flavor profile', 'Premium grade'],
    },
  ]

  return (
    <section id="origins" className="section-spacing bg-secondary/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Origins of Excellence
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="h-1 w-12 bg-accent" />
            <div className="h-1 w-12 bg-accent/50" />
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover the heritage and terroir behind GIMORA&apos;s premium products.
          </p>
        </div>

        {/* Origin Stories */}
        <div className="space-y-16">
          {origins.map((origin, index) => (
            <div
              key={origin.title}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                index === 1 ? 'md:grid-flow-col-dense' : ''
              }`}
            >
              {/* Image */}
              <div className={index === 1 ? 'md:order-2' : ''}>
                <div className="relative h-80 rounded-lg overflow-hidden premium-border">
                  <Image
                    src={index === 0 ? '/images/tea-origins.png' : '/images/pepper-origins.png'}
                    alt={origin.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={index === 1 ? 'md:order-1' : ''}>
                <div className="space-y-4">
                  <div>
                    <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-2">
                      {origin.region}
                    </p>
                    <h3 className="font-heading text-3xl font-bold text-primary mb-4">
                      {origin.title}
                    </h3>
                  </div>

                  <p className="text-foreground/70 leading-relaxed">
                    {origin.description}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {origin.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-accent/20"
                      >
                        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
