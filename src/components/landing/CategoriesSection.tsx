import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Cake, IceCreamCone, Sparkles } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const categories = [
  { name: 'Hot Chocolate', icon: Coffee, count: 3 },
  { name: 'Cakes', icon: Cake, count: 2 },
  { name: 'Desserts', icon: IceCreamCone, count: 3 },
  { name: 'Specials', icon: Sparkles, count: 2 },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section id="menu" className="py-16 sm:py-20 md:py-28">
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

        <div className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              variants={fadeUp}
              custom={i}
              onClick={() => navigate('/app/menu')}
              className="group glass cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all hover:border-gold-400/20 hover:shadow-lg hover:shadow-gold-400/5 active:scale-95"
            >
              <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gold-400/10 transition group-hover:bg-gold-400/20">
                <cat.icon size={24} className="sm:w-7 sm:h-7 text-gold-300" />
              </div>
              <h3 className="font-display text-sm sm:text-base lg:text-lg text-cream">{cat.name}</h3>
              <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-chocolate-400">{cat.count} items</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
