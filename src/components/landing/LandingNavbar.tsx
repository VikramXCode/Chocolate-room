import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const anchorLinks = ['Menu', 'About', 'Reviews', 'Contact'] as const;

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-10 transition-all duration-500 ${
          scrolled ? 'glass-solid shadow-lg shadow-black/30' : ''
        }`}
      >
        {!scrolled && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso via-espresso/80 to-transparent" />
        )}

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <span className="font-display text-base sm:text-lg md:text-xl text-gradient">The Chocolate Room</span>
        </Link>

        <nav className="relative z-10 hidden items-center gap-8 md:flex">
          {anchorLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-chocolate-200 transition hover:text-gold-300"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/app/menu')}
            className="rounded-full bg-gold-400 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-espresso transition hover:bg-gold-300 active:scale-95"
          >
            Order Now
          </button>
          <button
            onClick={() => navigate('/login')}
            className="hidden rounded-full border border-gold-400/40 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gold-300 transition hover:bg-gold-400/10 active:scale-95 sm:block"
          >
            Sign In
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full p-1.5 sm:p-2 text-chocolate-200 transition-colors hover:bg-chocolate-800/60 hover:text-gold-400 active:scale-95 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="landing-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="landing-mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[280px] sm:w-72 flex-col bg-chocolate-950 shadow-2xl shadow-black/50 md:hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <span className="text-gradient font-display text-lg font-bold">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-full p-1.5 text-chocolate-300 transition-colors hover:text-gold-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="divider mx-5" />
              <nav className="flex flex-1 flex-col gap-1 px-4 pt-4">
                {anchorLinks.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-chocolate-200 hover:bg-chocolate-900 hover:text-gold-400 transition-colors active:scale-95"
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <div className="mt-auto px-4 pb-6 space-y-3">
                <div className="divider mb-4" />
                <button
                  onClick={() => { setMobileOpen(false); navigate('/app/menu'); }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-400 px-4 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-gold-300 active:scale-95"
                >
                  Order Now
                </button>
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold-400/40 px-4 py-3 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-400/10 active:scale-95"
                >
                  Sign In
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
