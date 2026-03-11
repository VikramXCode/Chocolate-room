import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogIn,
  UtensilsCrossed,
  ClipboardList,
  Star,
} from 'lucide-react';
import { useCartStore } from '../state/cartStore';
import { useUserStore } from '../state/userStore';

const navLinks = [
  { to: '/app/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/app/orders', label: 'Orders', icon: ClipboardList },
  { to: '/app/reviews', label: 'Reviews', icon: Star },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const itemCount = useCartStore((s) => s.itemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const profileName = useUserStore((s) => s.profile.name);

  // Track scroll position
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ——— Top bar ——— */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-solid shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-baseline gap-1.5">
            <span className="text-gradient font-display text-xl font-bold tracking-wide sm:text-2xl">
              The Chocolate Room
            </span>
            <span className="text-[10px] font-medium tracking-widest text-chocolate-300 opacity-80 transition-opacity group-hover:opacity-100">
              Tirupur
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/app/menu'}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={
                        isActive
                          ? 'text-gold-300'
                          : 'text-chocolate-200 hover:text-gold-400'
                      }
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-400"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <button
              onClick={openDrawer}
              aria-label="Open cart"
              className="relative rounded-full p-2 text-chocolate-200 transition-colors hover:bg-chocolate-800/60 hover:text-gold-400"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="pulse-gold absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-espresso"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              )}
            </button>

            {/* User / Login (desktop) */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/app/profile')}
                  className="flex items-center gap-1.5 rounded-full border border-gold-400/20 px-3 py-1.5 text-sm font-medium text-chocolate-100 transition-colors hover:border-gold-400/40 hover:text-gold-300"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{profileName}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3.5 py-1.5 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500/25"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="rounded-full p-2 text-chocolate-200 transition-colors hover:bg-chocolate-800/60 hover:text-gold-400 md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ——— Mobile menu overlay ——— */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Panel */}
            <motion.aside
              key="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-chocolate-950 shadow-2xl shadow-black/50 md:hidden"
            >
              {/* Close */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <span className="text-gradient font-display text-lg font-bold">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-1.5 text-chocolate-300 transition-colors hover:text-gold-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="divider mx-5" />

              {/* Links */}
              <nav className="flex flex-1 flex-col gap-1 px-4 pt-4">
                {navLinks.map((link) => {
                  const isActive = link.to === '/app/menu'
                    ? location.pathname === '/app/menu'
                    : location.pathname.startsWith(link.to);
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gold-500/10 text-gold-300'
                          : 'text-chocolate-200 hover:bg-chocolate-900 hover:text-gold-400'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {link.label}
                    </Link>
                  );
                })}

                {/* Cart link (mobile) */}
                <Link
                  to="/app/cart"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === '/app/cart'
                      ? 'bg-gold-500/10 text-gold-300'
                      : 'text-chocolate-200 hover:bg-chocolate-900 hover:text-gold-400'
                  }`}
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  Cart
                  {itemCount > 0 && (
                    <span className="ml-auto rounded-full bg-gold-500/20 px-2 py-0.5 text-xs font-semibold text-gold-300">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </nav>

              {/* Bottom auth section */}
              <div className="mt-auto px-4 pb-6">
                <div className="divider mb-4" />
                {isLoggedIn ? (
                  <Link
                    to="/app/profile"
                    className="flex items-center gap-3 rounded-lg border border-gold-400/15 px-3 py-2.5 text-sm font-medium text-chocolate-100 transition-colors hover:border-gold-400/30 hover:text-gold-300"
                  >
                    <User className="h-4.5 w-4.5 text-gold-400" />
                    <span className="truncate">{profileName}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500/15 px-4 py-2.5 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500/25"
                  >
                    <LogIn className="h-4 w-4" />
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ——— Mobile bottom navigation bar ——— */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-chocolate-800/60 bg-chocolate-950/95 backdrop-blur-md md:hidden">
        {/* Menu */}
        <Link
          to="/app/menu"
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
            location.pathname === '/app/menu'
              ? 'text-gold-400'
              : 'text-chocolate-400 hover:text-gold-400'
          }`}
        >
          <UtensilsCrossed className="h-5 w-5" />
          Menu
        </Link>

        {/* Orders */}
        <Link
          to="/app/orders"
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/app/orders')
              ? 'text-gold-400'
              : 'text-chocolate-400 hover:text-gold-400'
          }`}
        >
          <ClipboardList className="h-5 w-5" />
          Orders
        </Link>

        {/* Cart */}
        <button
          onClick={openDrawer}
          className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
            location.pathname === '/app/cart'
              ? 'text-gold-400'
              : 'text-chocolate-400 hover:text-gold-400'
          }`}
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold text-espresso"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </span>
          Cart
        </button>

        {/* Reviews */}
        <Link
          to="/app/reviews"
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
            location.pathname.startsWith('/app/reviews')
              ? 'text-gold-400'
              : 'text-chocolate-400 hover:text-gold-400'
          }`}
        >
          <Star className="h-5 w-5" />
          Reviews
        </Link>

        {/* Profile / Login */}
        <Link
          to={isLoggedIn ? '/app/profile' : '/login'}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
            location.pathname === '/app/profile'
              ? 'text-gold-400'
              : 'text-chocolate-400 hover:text-gold-400'
          }`}
        >
          {isLoggedIn ? (
            <>
              <User className="h-5 w-5" />
              Profile
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              Login
            </>
          )}
        </Link>
      </nav>
    </>
  );
}
