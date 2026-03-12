import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* Build categories dynamically from menu data */
const allItems = menuData as MenuItem[];
const categoryMap = allItems.reduce<Record<string, { count: number; image: string }>>((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = { count: 0, image: item.image };
  }
  acc[item.category].count++;
  return acc;
}, {});

const categories = Object.entries(categoryMap).map(([name, data]) => ({
  name,
  count: data.count,
  image: data.image,
}));

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section id="menu" className="py-10 sm:py-14 md:py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">What We Serve</span>
          <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient">Our Categories</h2>
          <div className="divider mx-auto mt-3 sm:mt-4 max-w-xs" />
        </motion.div>

        <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              variants={fadeUp}
              custom={i}
              onClick={() => navigate('/app/menu')}
              className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl aspect-[4/3] active:scale-95 transition-transform"
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/90 via-chocolate-950/40 to-chocolate-950/20 transition-all duration-500 group-hover:from-chocolate-950/80" />
              {/* Content */}
              <div className="relative flex h-full flex-col items-center justify-end p-4 sm:p-5 text-center">
                <h3 className="font-display text-sm sm:text-base lg:text-lg text-cream drop-shadow-lg">{cat.name}</h3>
                <p className="mt-0.5 text-[10px] sm:text-xs text-gold-300/80">{cat.count} items</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
