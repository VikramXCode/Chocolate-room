import { motion } from 'framer-motion';

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function GallerySection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-chocolate-950/50 via-transparent to-chocolate-950/50" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="relative mx-auto max-w-5xl px-4 sm:px-6"
      >
        {/* Section label */}
        <motion.div variants={fadeUp} className="text-center mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">A Glimpse Inside</span>
          <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient">Our Café</h2>
          <div className="divider mx-auto mt-3 sm:mt-4 max-w-xs" />
        </motion.div>

        {/* Image collage */}
        <motion.div variants={scaleIn} className="relative pb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=500&fit=crop"
                  alt="Hot Chocolate"
                  loading="lazy"
                  className="h-44 sm:h-64 w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                  alt="Chocolate Cake"
                  loading="lazy"
                  className="h-36 sm:h-44 w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop"
                  alt="Milkshake"
                  loading="lazy"
                  className="h-36 sm:h-44 w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=500&fit=crop"
                  alt="Fondue"
                  loading="lazy"
                  className="h-44 sm:h-64 w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Floating rating badge */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 glass-solid rounded-xl border border-gold-400/15 px-5 py-2.5 text-center shadow-xl">
            <p className="text-xl sm:text-2xl font-bold text-gold-300">4.8 ★</p>
            <p className="text-[10px] sm:text-xs text-chocolate-400">Customer Rating</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
