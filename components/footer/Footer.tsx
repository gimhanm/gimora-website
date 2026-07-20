import Link from 'next/link'
import { Mail, Phone, MapPin, Link2, Share2 } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-3 text-accent">
              GIMORA
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Premium Ceylon Black Tea and Black Pepper from Sri Lanka. Sustainably sourced
              for discerning customers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '#about', label: 'About Us' },
                { href: '#products', label: 'Products' },
                { href: '#sustainability', label: 'Sustainability' },
                { href: '#contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-white">Products</h4>
            <ul className="space-y-2">
              {[
                'Ceylon Black Tea',
                'Black Pepper',
                'Cinnamon (Coming Soon)',
                'Cloves (Coming Soon)',
              ].map((product) => (
                <li key={product}>
                  <span className="text-white/70 text-sm">{product}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-accent mt-1 flex-shrink-0" />
                <a
                  href="mailto:contactgimora@gmail.com"
                  className="text-white/70 hover:text-accent transition-colors text-sm"
                >
                  contactgimora@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-accent mt-1 flex-shrink-0" />
                <a
                  href="tel:+94784230450"
                  className="text-white/70 hover:text-accent transition-colors text-sm"
                >
                  +94 (0) 784230450
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-1 flex-shrink-0" />
                <p className="text-white/70 text-sm">
                  Colombo, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="#"
              className="text-white/70 hover:text-accent transition-colors"
              aria-label="Facebook"
              title="Facebook"
            >
              <Share2 size={20} />
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-accent transition-colors"
              aria-label="Instagram"
              title="Instagram"
            >
              <Link2 size={20} />
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-accent transition-colors"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Share2 size={20} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-white/60 text-sm">
            © {currentYear} GIMORA. All rights reserved. | Premium Sri Lankan Agricultural Exports
          </p>
        </div>
      </div>
    </footer>
  )
}
