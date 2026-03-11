import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight } from 'lucide-react';

import type { Review } from '../../types/review.types';
import reviewsData from '../../data/reviews.json';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const reviews = (reviewsData as Review[]).filter((r) => r.rating >= 4).slice(0, 4);

export default function TestimonialsSection() {
  const navigate = useNavigate();

  return (
    <section id="reviews" className="relative overflow-hidden py-10 sm:py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-chocolate-950/50 via-transparent to-chocolate-950/50" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="relative mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">Love from Customers</span>
          <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient">What People Say</h2>
          <div className="divider mx-auto mt-3 sm:mt-4 max-w-xs" />
        </motion.div>

        <div className="mt-6 sm:mt-8 md:mt-10 grid gap-5 sm:gap-6 sm:grid-cols-2">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              variants={fadeUp}
              custom={i}
              className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all hover:border-gold-400/15"
            >
              <Quote size={18} className="sm:w-5 sm:h-5 mb-2 sm:mb-3 text-gold-400/40" />
              <p className="text-sm sm:text-base leading-relaxed text-chocolate-200 italic">"{r.comment}"</p>
              <div className="mt-4 sm:mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 text-xs sm:text-sm font-bold text-gold-300">
                  {r.avatar || r.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-cream">{r.customerName}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={11} className="fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-5 sm:mt-7 md:mt-8 text-center">
          <button
            onClick={() => navigate('/app/reviews')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 transition hover:text-gold-200"
          >
            Read All Reviews <ArrowRight size={14} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
