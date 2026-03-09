import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  QrCode,
  ShoppingBag,
  UtensilsCrossed,
  MapPin,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';

import ReviewCard from '../../components/ReviewCard';
import { useMenuStore } from '../../state/menuStore';
import type { MenuItem } from '../../types/menu.types';
import type { Review } from '../../types/review.types';

import menuData from '../../data/menu.json';
import reviewsData from '../../data/reviews.json';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */
const popularItems: MenuItem[] = (menuData as MenuItem[]).filter((i) => i.popular);
const topReviews: Review[] = (reviewsData as Review[])
  .filter((r) => r.rating >= 4)
  .slice(0, 3);

const stats = [
  { label: 'Items', value: '18+' },
  { label: 'Rating', value: '4.8★' },
  { label: 'Orders', value: '500+' },
];

const steps = [
  { icon: QrCode, title: 'Scan QR', desc: 'Scan the table QR code to access the menu' },
  { icon: ShoppingBag, title: 'Order', desc: 'Choose your favourites and place your order' },
  { icon: UtensilsCrossed, title: 'Enjoy', desc: 'Sit back and enjoy your chocolate experience' },
];

/* ================================================================== */
/*  HomePage                                                           */
/* ================================================================== */
export default function HomePage() {
  const navigate = useNavigate();
  const loadMenu = useMenuStore((s) => s.loadMenu);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return (
    <div className="min-h-screen bg-espresso text-cream">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Background gradient + radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso via-chocolate-900 to-espresso" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gold-400/5 blur-[120px]" />

        {/* Floating decorative circles */}
        <div className="animate-float pointer-events-none absolute left-[10%] top-[20%] h-48 w-48 rounded-full bg-gold-400/[0.04] blur-3xl" />
        <div className="animate-float pointer-events-none absolute right-[12%] bottom-[25%] h-64 w-64 rounded-full bg-chocolate-700/30 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="animate-float pointer-events-none absolute right-[30%] top-[15%] h-32 w-32 rounded-full bg-gold-300/[0.06] blur-2xl" style={{ animationDelay: '4s' }} />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="font-display text-5xl leading-tight md:text-7xl text-gradient"
          >
            The Chocolate Room
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-lg tracking-[0.25em] uppercase text-gold-300/80"
          >
            Tirupur
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="max-w-md text-base text-chocolate-300 md:text-lg"
          >
            Where every bite is a celebration of chocolate
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={3} className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app/menu')}
              className="rounded-full bg-gold-400 px-8 py-3 font-semibold text-espresso transition hover:bg-gold-300 active:scale-95"
            >
              Explore Menu
            </button>
            <button
              onClick={() => navigate('/app/menu')}
              className="rounded-full border border-gold-400/60 px-8 py-3 font-semibold text-gold-300 transition hover:bg-gold-400/10 active:scale-95"
            >
              Order Now
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} custom={4} className="mt-10 flex items-center gap-8 md:gap-14">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-gold-300 md:text-3xl">{s.value}</p>
                <p className="text-xs text-chocolate-400">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' as const }}
          className="absolute bottom-8 z-10 text-chocolate-500"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ── Featured Items ───────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mx-auto max-w-7xl px-4 py-24"
      >
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-gradient">Featured Delights</h2>
          <div className="divider mx-auto mt-3" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularItems.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              custom={i}
              className="glass group cursor-pointer rounded-xl overflow-hidden transition-transform hover:scale-[1.02]"
              onClick={() => navigate('/app/menu')}
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/80 via-transparent to-transparent" />
                {item.popular && (
                  <span className="absolute top-3 left-3 rounded-full bg-gold-400/90 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-espresso">
                    Popular
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-display text-lg text-cream">{item.name}</h3>
                  <p className="mt-0.5 text-sm text-gold-300 font-semibold">₹{item.price}</p>
                </div>
                <button
                  aria-label={`Add ${item.name} to cart`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 transition hover:bg-gold-400/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <button
            onClick={() => navigate('/app/menu')}
            className="inline-flex items-center gap-2 text-gold-300 transition hover:text-gold-200"
          >
            View Full Menu <ArrowRight size={16} />
          </button>
        </motion.div>
      </motion.section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="relative mx-auto max-w-5xl px-4 py-24"
      >
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-gradient">How It Works</h2>
          <div className="divider mx-auto mt-3" />
        </motion.div>

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute top-16 left-[16.6%] right-[16.6%] hidden h-px bg-gradient-to-r from-gold-400/0 via-gold-400/30 to-gold-400/0 md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              custom={i}
              className="glass flex flex-col items-center rounded-xl p-8 text-center"
            >
              <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/15">
                <step.icon size={24} className="text-gold-300" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-espresso">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl text-cream">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-chocolate-300">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Customer Testimonials ────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mx-auto max-w-7xl px-4 py-24"
      >
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-gradient">What Our Customers Say</h2>
          <div className="divider mx-auto mt-3" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topReviews.map((review, i) => (
            <motion.div key={review.id} variants={fadeUp} custom={i}>
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
        className="px-4 pb-24"
      >
        <div className="glass-solid mx-auto max-w-5xl rounded-2xl border border-gold-400/15 bg-gradient-to-br from-chocolate-900/80 to-espresso/80 p-10 text-center md:p-16">
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl text-gradient">
            Ready to indulge?
          </motion.h2>

          <motion.p variants={fadeUp} custom={1} className="mt-4 text-chocolate-300 md:text-lg">
            Visit us today or order from the comfort of your home
          </motion.p>

          <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app/menu')}
              className="rounded-full bg-gold-400 px-8 py-3 font-semibold text-espresso transition hover:bg-gold-300 active:scale-95"
            >
              View Menu
            </button>
            <button
              onClick={() => window.open('https://maps.google.com/?q=The+Chocolate+Room+Tirupur', '_blank')}
              className="inline-flex items-center gap-2 rounded-full border border-gold-400/60 px-8 py-3 font-semibold text-gold-300 transition hover:bg-gold-400/10 active:scale-95"
            >
              <MapPin size={16} /> Find Us
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
