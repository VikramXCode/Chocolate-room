import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Phone, MapPin, Clock } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer id="contact" className="border-t border-gold-400/10 bg-chocolate-950">
      {/* Embedded Map */}
      <div className="w-full overflow-hidden border-b border-gold-400/10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.968593548359!2d77.33167437504683!3d11.115716989054425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907424abbadb5%3A0xc352e7daa4a901ba!2sThe%20Chocolate%20Room%20-%20Tirupur!5e0!3m2!1sen!2sin!4v1773294963700!5m2!1sen!2sin"
          width="100%"
          height="320"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="The Chocolate Room – Tirupur location"
          className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg sm:text-xl text-gradient">The Chocolate Room</h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-chocolate-400">
              Premium artisan chocolate café in the heart of Tirupur.
              Crafting moments of pure indulgence since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-gold-400">Quick Links</h4>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {[
                { label: 'Menu', to: '/app/menu' },
                { label: 'Reviews', to: '/app/reviews' },
                { label: 'Profile', to: '/app/profile' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs sm:text-sm text-chocolate-300 transition hover:text-gold-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-gold-400">Opening Hours</h4>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-chocolate-300">
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-gold-400/60" />
                Mon – Sat: 10 AM – 11 PM
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-gold-400/60" />
                Sunday: 11 AM – 10 PM
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-gold-400">Contact Us</h4>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-chocolate-300">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold-400/60" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold-400/60" />
                The Chocolate Room, Kamaraj Road, Tirupur, Tamil Nadu 641601
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-8 sm:my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[10px] sm:text-xs text-chocolate-500 text-center sm:text-left">
            © 2026 The Chocolate Room – Tirupur. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/5 text-chocolate-400 transition hover:bg-gold-400/15 hover:text-gold-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
