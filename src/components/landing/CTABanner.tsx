import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, MapPin } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function CTABanner() {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
        className="mx-auto max-w-5xl px-4 sm:px-6"
      >
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/15 bg-gradient-to-br from-chocolate-900 via-espresso to-chocolate-950 p-8 sm:p-10 md:p-16 text-center shadow-2xl">
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-40 w-96 bg-gold-400/[0.06] blur-[80px]" />

          <motion.div variants={fadeUp} className="relative">
            <Heart size={24} className="sm:w-7 sm:h-7 mx-auto mb-3 sm:mb-4 text-gold-400/60" />
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient">Ready to Indulge?</h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-md text-sm sm:text-base md:text-lg text-chocolate-200 px-4 sm:px-0">
              Visit us today or order from the comfort of your home. Your chocolate adventure awaits.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="relative mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <button
              onClick={() => navigate('/app/menu')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-espresso transition hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20 active:scale-95"
            >
              Start Ordering
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => window.open('https://maps.google.com/?q=The+Chocolate+Room+Tirupur', '_blank')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/50 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-gold-300 transition hover:bg-gold-400/10 active:scale-95"
            >
              <MapPin size={16} /> Visit Us
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
