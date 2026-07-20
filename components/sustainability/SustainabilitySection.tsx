import { TreePine, Heart, Droplet, Users } from 'lucide-react'

export default function SustainabilitySection() {
  const initiatives = [
    {
      icon: TreePine,
      title: 'Environmental Conservation',
      description:
        'We invest in reforestation programs and use sustainable farming practices that protect soil health and biodiversity.',
    },
    {
      icon: Heart,
      title: 'Fair Trade Practices',
      description:
        'Direct partnerships with farming families ensure fair compensation and improved living standards in rural communities.',
    },
    {
      icon: Droplet,
      title: 'Water Management',
      description:
        'Responsible water usage and conservation techniques minimize environmental impact while maintaining crop quality.',
    },
    {
      icon: Users,
      title: 'Community Development',
      description:
        'Supporting education initiatives and healthcare programs in farming communities across Sri Lanka.',
    },
  ]

  return (
    <section id="sustainability" className="section-spacing bg-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Our Sustainability Commitment
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="h-1 w-12 bg-accent" />
            <div className="h-1 w-12 bg-accent/50" />
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Sustainability isn&apos;t just a responsibility—it&apos;s a core value that guides every decision we make.
          </p>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {initiatives.map((initiative) => {
            const Icon = initiative.icon
            return (
              <div
                key={initiative.title}
                className="p-8 bg-secondary/50 rounded-lg premium-border transition-all duration-300 hover:bg-secondary hover:border-accent/50"
              >
                <div className="mb-4">
                  <Icon size={32} className="text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                  {initiative.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {initiative.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Mission Statement */}
        <div className="bg-primary rounded-lg p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
          {/* Overlay for text visibility */}
          <div className="absolute inset-0 bg-black/30 rounded-lg" />
          <div className="relative z-10">
            <h3 className="font-heading text-3xl font-bold mb-4 text-white drop-shadow-xl">Our Mission</h3>
            <p className="text-lg leading-relaxed text-white drop-shadow-lg font-light">
              To deliver premium agricultural products while championing sustainable practices, supporting farming communities, and protecting the natural heritage of Sri Lanka for future generations.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { number: '500+', label: 'Farming Families Supported' },
            { number: '100%', label: 'Traceable & Certified' },
            { number: '15+', label: 'Years of Excellence' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6">
              <div className="font-heading text-4xl font-bold text-accent mb-2">
                {stat.number}
              </div>
              <p className="text-foreground/70 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
