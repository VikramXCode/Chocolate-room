import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const stats = [
  { value: '18+', label: 'Menu Items' },
  { value: '4.8', label: 'Average Rating' },
  { value: '500+', label: 'Happy Customers' },
  { value: '2+', label: 'Years of Joy' },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity: heroOpacity, scale: heroScale }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-16 pb-10 sm:py-16 text-center"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-chocolate-950 via-espresso to-chocolate-950" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-gold-400/[0.06] blur-[140px]" />
      <div className="animate-float pointer-events-none absolute left-[8%] top-[18%] h-56 w-56 rounded-full bg-gold-400/[0.03] blur-3xl" />
      <div className="animate-float pointer-events-none absolute right-[10%] bottom-[20%] h-72 w-72 rounded-full bg-chocolate-700/20 blur-3xl" style={{ animationDelay: '2s' }} />
      <div className="animate-float pointer-events-none absolute right-[30%] top-[12%] h-40 w-40 rounded-full bg-gold-300/[0.04] blur-2xl" style={{ animationDelay: '4s' }} />

      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 flex flex-col items-center max-w-5xl w-full my-auto">
        {/* Pre-title */}
        <motion.div variants={fadeUp} custom={0} className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/[0.06] px-5 py-2 sm:px-5 sm:py-2">
          <Sparkles size={16} className="sm:w-3.5 sm:h-3.5 text-gold-400" />
          <span className="text-xs sm:text-xs font-medium tracking-wider uppercase text-gold-300">Premium Chocolate Café</span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-8xl text-gradient">
          The Chocolate
          <br />
          Room
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} className="mt-3 sm:mt-3 text-lg sm:text-lg md:text-xl tracking-[0.3em] uppercase text-gold-300/70">
          Tirupur
        </motion.p>

        <motion.p variants={fadeUp} custom={3} className="mt-5 sm:mt-6 max-w-lg px-6 text-base leading-relaxed text-chocolate-200 sm:text-base md:text-lg">
          An exquisite journey through the world of artisan chocolate. Every sip, every bite — crafted to perfection.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp} custom={4} className="mt-7 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:w-auto">
          <button
            onClick={() => navigate('/app/menu')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-8 sm:px-8 py-3.5 sm:py-3.5 text-base sm:text-base font-semibold text-espresso transition hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20 active:scale-95"
          >
            Explore Menu
            <ArrowRight size={18} className="sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto rounded-full border border-gold-400/50 px-8 sm:px-8 py-3.5 sm:py-3.5 text-base sm:text-base font-semibold text-gold-300 transition hover:bg-gold-400/10 active:scale-95"
          >
            Discover More
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeUp} custom={5} className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-2 gap-x-8 gap-y-5 sm:gap-6 lg:grid-cols-4 lg:gap-10 w-full max-w-2xl px-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-3xl lg:text-4xl font-bold text-gold-300">{s.value}</p>
              <p className="mt-1.5 sm:mt-1 text-xs sm:text-sm text-chocolate-400">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' as const }}
        className="absolute bottom-4 sm:bottom-8 z-10 text-chocolate-500"
      >
        <ChevronDown size={24} className="sm:w-7 sm:h-7" />
      </motion.div>
    </motion.section>
  );
}
