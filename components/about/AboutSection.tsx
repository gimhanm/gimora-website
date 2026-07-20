export default function AboutSection() {
  const highlights = [
    {
      title: 'Heritage',
      description: 'Generations of agricultural expertise passed down through Sri Lankan farming families.',
    },
    {
      title: 'Quality',
      description: 'Premium control at every step, from cultivation to harvest to final export packaging.',
    },
    {
      title: 'Sustainability',
      description: 'Committed to responsible sourcing practices that protect our environment and communities.',
    },
  ]

  return (
    <section id="about" className="section-spacing bg-white">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
              About GIMORA
            </h2>
            <div className="flex justify-center gap-2 mb-8">
              <div className="h-1 w-12 bg-accent" />
              <div className="h-1 w-12 bg-accent/50" />
            </div>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Founded on the principles of authenticity and excellence, GIMORA represents the best of Sri Lankan agriculture. We partner directly with local farmers to bring you products that embody our commitment to quality and sustainability.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="text-center">
                <div className="mb-4">
                  <div className="inline-block p-4 bg-secondary rounded-lg">
                    <div className="text-3xl font-heading font-bold text-primary">
                      {highlight.title.charAt(0)}
                    </div>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                  {highlight.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>

          {/* Brand Statement */}
          <div className="mt-16 p-8 bg-secondary/50 border-l-4 border-accent rounded-lg">
            <p className="text-lg text-foreground leading-relaxed italic">
              "At GIMORA, we believe that premium quality isn't just about the product—it's about the story, the people, and the land behind it. Every cup of tea and every grain of pepper carries the heritage of Sri Lanka."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
