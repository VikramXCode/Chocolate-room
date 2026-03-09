import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const navLinks: { to: string; label: string }[] = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reviews', label: 'Reviews' },
];

const footerQuickLinks: { to: string; label: string }[] = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/cart', label: 'Cart' },
];

const socialLinks: { label: string; href: string }[] = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'Twitter', href: '#' },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-chocolate-950 font-sans text-chocolate-100">
      {/* ───── Navbar ───── */}
      <nav
        className={`sticky top-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-chocolate-950/80 backdrop-blur-xl shadow-lg shadow-chocolate-950/50 border-b border-gold-400/10'
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center text-chocolate-950 font-bold font-display text-lg shadow-md shadow-gold-400/20 group-hover:shadow-gold-400/40 transition-shadow duration-300">
            CR
          </div>
          <span className="font-display text-xl text-gold-300 hidden sm:block tracking-wide group-hover:text-gold-400 transition-colors duration-300">
            The Chocolate Room
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative text-sm font-medium transition-colors duration-300 hover:text-gold-400 ${
                pathname === l.to ? 'text-gold-400' : 'text-chocolate-200'
              }`}
            >
              {l.label}
              {pathname === l.to && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* Cart */}
          <Link
            to="/app/cart"
            className="relative text-chocolate-200 hover:text-gold-400 transition-colors duration-300"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2.5 bg-gold-400 text-chocolate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-chocolate-700/50">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-chocolate-200 hover:text-gold-400 transition-colors duration-300 group"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-chocolate-700 group-hover:ring-gold-400/50 transition-all duration-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-chocolate-700 flex items-center justify-center text-xs text-gold-300 font-semibold ring-2 ring-chocolate-600 group-hover:ring-gold-400/50 transition-all duration-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-chocolate-400 hover:text-red-400 transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-gold-400 text-chocolate-950 px-5 py-2 rounded-lg font-semibold hover:bg-gold-300 transition-all duration-300 shadow-md shadow-gold-400/10 hover:shadow-gold-400/25"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/app/cart" className="relative text-chocolate-200 hover:text-gold-400 transition-colors duration-300">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-gold-400 text-chocolate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="text-chocolate-200 hover:text-gold-400 transition-colors duration-300"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ───── Mobile menu ───── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="mx-4 mt-1 rounded-xl bg-chocolate-900/90 backdrop-blur-xl border border-chocolate-700/40 p-4 flex flex-col gap-1 shadow-xl shadow-chocolate-950/60">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-200 ${
                      pathname === l.to
                        ? 'text-gold-400 bg-chocolate-800/60'
                        : 'text-chocolate-200 hover:text-gold-400 hover:bg-chocolate-800/30'
                    }`}
                  >
                    {l.label}
                    <ChevronRight size={14} className="opacity-40" />
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent my-2" />

              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 hover:bg-chocolate-800/30 transition-all duration-200 rounded-lg"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-chocolate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-chocolate-700 flex items-center justify-center text-sm text-gold-300 font-semibold ring-2 ring-chocolate-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-chocolate-100 font-medium">{user.name}</p>
                      <p className="text-xs text-chocolate-500">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-chocolate-400 hover:text-red-400 py-2.5 px-3 rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm bg-gold-400 text-chocolate-950 px-4 py-2.5 rounded-lg font-semibold text-center hover:bg-gold-300 transition-colors duration-200 mt-1"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── Main content ───── */}
      <main className="min-h-[60vh]">{children}</main>

      {/* ───── Footer ───── */}
      <footer className="mt-20 border-t border-gold-400/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center text-chocolate-950 font-bold font-display text-lg shadow-md shadow-gold-400/20">
                  CR
                </div>
                <span className="font-display text-lg text-gold-300 tracking-wide">
                  The Chocolate Room
                </span>
              </div>
              <p className="text-chocolate-400 text-sm leading-relaxed max-w-xs">
                A premium café experience in Tirupur, serving handcrafted chocolates,
                artisan beverages, and gourmet desserts since 2020.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-gold-400 text-sm uppercase tracking-widest mb-5">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-3">
                {footerQuickLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-chocolate-300 hover:text-gold-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <ChevronRight
                        size={14}
                        className="text-gold-400/40 group-hover:text-gold-400 transition-colors duration-300 group-hover:translate-x-0.5 transform"
                      />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-display text-gold-400 text-sm uppercase tracking-widest mb-5">
                Contact
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-chocolate-300">
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-gold-400/60 mt-0.5 shrink-0" />
                  <span>123 Chocolate Lane, Tirupur,&nbsp;Tamil&nbsp;Nadu&nbsp;641604</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="text-gold-400/60 shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-gold-400 transition-colors duration-300">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <User size={16} className="text-gold-400/60 shrink-0" />
                  <a href="mailto:hello@thechocolateroom.in" className="hover:text-gold-400 transition-colors duration-300">
                    hello@thechocolateroom.in
                  </a>
                </li>
              </ul>
            </div>

            {/* Social & Hours */}
            <div>
              <h4 className="font-display text-gold-400 text-sm uppercase tracking-widest mb-5">
                Hours & Social
              </h4>
              <div className="flex items-start gap-2.5 text-sm text-chocolate-300 mb-4">
                <Clock size={16} className="text-gold-400/60 mt-0.5 shrink-0" />
                <div>
                  <p>Mon – Fri: 10 AM – 11 PM</p>
                  <p>Sat – Sun: 9 AM – 11:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-chocolate-700/60 flex items-center justify-center text-chocolate-400 hover:text-gold-400 hover:border-gold-400/40 transition-all duration-300 text-xs font-semibold"
                    title={s.label}
                  >
                    {s.label.charAt(0)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-6 border-t border-gold-400/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-chocolate-500">
            <p>© {new Date().getFullYear()} The Chocolate Room, Tirupur. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <span className="text-gold-400">♥</span> for chocolate lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
