import ProductCard from './ProductCard'

export default function ProductsSection() {
  const products = [
    {
      id: 1,
      image: '/images/tea-product.png',
      name: 'Pure Ceylon Black Tea',
      description: 'Single-origin Ceylon Black Tea from the highlands of Sri Lanka. Rich, smooth, and full-bodied with natural sweetness.',
      isComingSoon: false,
    },
    {
      id: 2,
      image: '/images/pepper-product.png',
      name: 'Black Pepper',
      description: 'Premium black pepper with distinctive aroma and pungent heat. Sourced from the finest pepper gardens.',
      isComingSoon: false,
    },
    {
      id: 3,
      image: '/images/cinnamon-product.png',
      name: 'Ceylon Cinnamon',
      description: 'Authentic Ceylon cinnamon with warm, sweet notes. A versatile spice for culinary excellence.',
      isComingSoon: true,
    },
    {
      id: 4,
      image: '/images/cloves-product.png',
      name: 'Cloves',
      description: 'Hand-picked cloves with intense aroma. Perfect for spice blends and traditional recipes.',
      isComingSoon: true,
    },
  ]

  return (
    <section id="products" className="section-spacing bg-secondary/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Featured Products
          </h2>
          <div className="flex justify-center gap-2 mb-8">
            <div className="h-1 w-12 bg-accent" />
            <div className="h-1 w-12 bg-accent/50" />
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover our premium selection of Ceylon agricultural products. Each carefully cultivated and expertly processed for maximum quality.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              description={product.description}
              isComingSoon={product.isComingSoon}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-foreground/70 mb-6">
            Looking for specific products or have bulk inquiries?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium"
          >
            Contact Our Sales Team
          </a>
        </div>
      </div>
    </section>
  )
}
