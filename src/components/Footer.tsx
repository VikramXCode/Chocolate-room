import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const quickLinks = [
  { to: '/app/menu', label: 'Menu' },
  { to: '/app/reviews', label: 'Reviews' },
  { to: '/app/profile', label: 'Profile' },
] as const;

const hours = [
  { day: 'Mon – Fri', time: '10 AM – 10 PM' },
  { day: 'Saturday', time: '10 AM – 11 PM' },
  { day: 'Sunday', time: '11 AM – 10 PM' },
] as const;

const socials = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
] as const;

const MotionLink = motion.create(Link);

export default function Footer() {
  return (
    <footer className="bg-chocolate-950">
      {/* Top divider */}
      <div className="divider" />

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* ——— Column 1: Brand ——— */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-gradient font-display text-xl sm:text-2xl font-bold tracking-wide">
              The Chocolate Room
            </h3>
            <p className="mt-2 max-w-xs text-xs sm:text-sm leading-relaxed text-chocolate-300">
              Premium handcrafted chocolates, artisan beverages &amp; cozy café
              experiences — crafted with passion in the heart of Tirupur.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs font-medium tracking-widest text-chocolate-400">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-400" />
              TIRUPUR, TAMIL NADU
            </p>
          </div>

          {/* ——— Column 2: Quick Links ——— */}
          <div>
            <h4 className="mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <MotionLink
                    to={link.to}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="group inline-flex items-center gap-1 text-xs sm:text-sm text-chocolate-200 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </MotionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ——— Column 3: Hours ——— */}
          <div>
            <h4 className="mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Opening Hours
            </h4>
            <ul className="space-y-2">
              {hours.map((h) => (
                <li
                  key={h.day}
                  className="flex items-start gap-1.5 text-xs sm:text-sm text-chocolate-200"
                >
                  <Clock className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-gold-500" />
                  <span>
                    <span className="font-medium text-chocolate-100">
                      {h.day}
                    </span>
                    <br />
                    <span className="text-chocolate-300">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ——— Column 4: Contact ——— */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              Contact Us
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="tel:+914212345678"
                  className="flex items-center gap-2 text-xs sm:text-sm text-chocolate-200 transition-colors hover:text-gold-300"
                >
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold-500" />
                  +91 421 234 5678
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@thechocolateroom.in"
                  className="flex items-center gap-2 text-xs sm:text-sm text-chocolate-200 transition-colors hover:text-gold-300 break-all"
                >
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-gold-500" />
                  hello@thechocolateroom.in
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-xs sm:text-sm text-chocolate-200">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-gold-500" />
                  45 Anna Nagar Main Rd, Tirupur, Tamil Nadu 641601
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="divider" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:py-6 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] sm:text-xs text-chocolate-400">
          © 2026 The Chocolate Room – Tirupur. All rights reserved.
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-2.5">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                whileHover={{ y: -2, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="rounded-full border border-chocolate-800 p-1.5 sm:p-2 text-chocolate-400 transition-colors hover:border-gold-400/30 hover:text-gold-400"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
