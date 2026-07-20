import { Award, Leaf, Truck, Zap, Users, CheckCircle } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Award,
      title: '100% Sri Lankan',
      description: 'All products sourced directly from verified Sri Lankan farms and plantations.',
    },
    {
      icon: Zap,
      title: 'Premium Quality',
      description: 'Rigorous quality control at every stage from cultivation to final packaging.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Sourcing',
      description: 'Committed to environmentally responsible farming practices and farmer welfare.',
    },
    {
      icon: Truck,
      title: 'Export Ready',
      description: 'Certified and compliant with international standards and regulations.',
    },
    {
      icon: Users,
      title: 'Farmer Partnerships',
      description: 'Direct relationships with local farming families ensuring fair compensation.',
    },
    {
      icon: CheckCircle,
      title: 'Carefully Selected',
      description: 'Hand-curated selection ensuring only the best products reach our customers.',
    },
  ]

  return (
    <section className="section-spacing bg-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Why Choose GIMORA
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="h-1 w-12 bg-accent" />
            <div className="h-1 w-12 bg-accent/50" />
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            We stand apart through our commitment to authenticity, quality, and sustainable practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group p-8 bg-white premium-border rounded-lg transition-all duration-300 hover:shadow-lg hover:border-accent/50"
              >
                <div className="mb-4">
                  <div className="inline-block p-3 bg-secondary rounded-lg group-hover:bg-accent/10 transition-colors">
                    <Icon size={28} className="text-primary" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
