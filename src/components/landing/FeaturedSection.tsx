import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

import type { MenuItem } from '../../types/menu.types';
import menuData from '../../data/menu.json';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const featured = (menuData as MenuItem[]).filter((i) => i.popular).slice(0, 6);

export default function FeaturedSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-chocolate-950/40 via-transparent to-chocolate-950/40" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="relative mx-auto max-w-7xl px-4 sm:px-6"
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">Chef's Picks</span>
          <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient">Featured Delights</h2>
          <div className="divider mx-auto mt-3 sm:mt-4 max-w-xs" />
        </motion.div>

        <div className="mt-10 sm:mt-12 md:mt-16 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              custom={i}
              className="glass group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl transition-all hover:border-gold-400/20 hover:shadow-xl hover:shadow-gold-400/5 active:scale-[0.98]"
              onClick={() => navigate('/app/menu')}
            >
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/90 via-chocolate-950/20 to-transparent" />
                <span className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 rounded-full bg-gold-400/90 px-2.5 sm:px-3 py-1 text-xs font-bold text-espresso">₹{item.price}</span>
                {item.popular && (
                  <span className="absolute top-3 sm:top-4 right-3 sm:right-4 inline-flex items-center gap-1 rounded-full bg-espresso/80 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur-sm">
                    <Star size={10} className="fill-gold-400 text-gold-400" /> Popular
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-display text-base sm:text-lg text-cream">{item.name}</h3>
                <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm leading-relaxed text-chocolate-300 line-clamp-2">{item.description}</p>
                <button
                  className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gold-300 transition hover:text-gold-200"
                  onClick={(e) => { e.stopPropagation(); navigate('/app/menu'); }}
                >
                  Order Now <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-8 sm:mt-10 md:mt-12 text-center">
          <button
            onClick={() => navigate('/app/menu')}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/40 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-gold-300 transition hover:bg-gold-400/10 active:scale-95 w-full max-w-xs sm:w-auto"
          >
            View Full Menu
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
