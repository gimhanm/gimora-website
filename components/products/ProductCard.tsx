import Image from 'next/image'

interface ProductCardProps {
  image: string
  name: string
  description: string
  isComingSoon?: boolean
}

export default function ProductCard({
  image,
  name,
  description,
  isComingSoon = false,
}: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg premium-border transition-all-smooth hover:shadow-lg hover:border-accent/50">
      {/* Image Container */}
      <div className="relative h-64 md:h-72 w-full overflow-hidden bg-secondary">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isComingSoon && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-accent text-white px-6 py-3 rounded-full font-semibold text-sm">
              Coming Soon
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <h3 className="font-heading text-xl font-semibold text-primary mb-2">
          {name}
        </h3>
        <p className="text-foreground/70 text-sm leading-relaxed mb-4">
          {description}
        </p>
        {!isComingSoon && (
          <button className="text-accent font-medium text-sm hover:text-accent/80 transition-colors flex items-center gap-2">
            Learn More →
          </button>
        )}
      </div>
    </div>
  )
}
