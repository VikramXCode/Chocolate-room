import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section id="about" className="relative overflow-hidden py-10 sm:py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-chocolate-950/50 via-transparent to-chocolate-950/50" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center"
      >
        <motion.span variants={fadeUp} custom={0} className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">
          Our Story
        </motion.span>

        <motion.h2 variants={fadeUp} custom={1} className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-gradient">
          A Passion for <span className="italic">Chocolate</span>
        </motion.h2>

        <div className="divider mx-auto mt-3 sm:mt-4 max-w-xs" />

        <motion.p variants={fadeUp} custom={2} className="mt-6 sm:mt-8 text-sm sm:text-base leading-relaxed text-chocolate-200">
          Nestled in the heart of Tirupur, The Chocolate Room brings you an authentic Belgian chocolate
          experience like no other. From our signature dark hot chocolate to our handcrafted truffles,
          every item on our menu is a labour of love.
        </motion.p>

        <motion.p variants={fadeUp} custom={3} className="mt-4 text-sm sm:text-base leading-relaxed text-chocolate-300">
          We source the finest cocoa from around the world and blend it with local flavours to create
          desserts that tell a story. Whether you are celebrating a special occasion or simply treating
          yourself, we promise an unforgettable experience.
        </motion.p>

        {/* Info chips */}
        <motion.div variants={fadeUp} custom={4} className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/10">
              <Clock size={18} className="text-gold-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-cream">Open Daily</p>
              <p className="text-xs text-chocolate-400">10 AM – 11 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/10">
              <MapPin size={18} className="text-gold-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-cream">Location</p>
              <p className="text-xs text-chocolate-400">Tirupur, Tamil Nadu</p>
            </div>
          </div>
        </motion.div>

        <motion.button
          variants={fadeUp}
          custom={5}
          onClick={() => navigate('/app/menu')}
          className="group mt-8 sm:mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-gold-400/10 px-8 py-3 text-sm font-semibold text-gold-300 ring-1 ring-gold-400/20 transition hover:bg-gold-400/20 active:scale-95"
        >
          Enter the Café
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </section>
  );
}
