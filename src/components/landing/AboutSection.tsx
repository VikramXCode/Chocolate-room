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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
} as const;

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-chocolate-950/50 via-transparent to-chocolate-950/50" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="relative mx-auto max-w-6xl px-4 sm:px-6"
      >
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — Image collage */}
          <motion.div variants={scaleIn} className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=500&fit=crop"
                    alt="Hot Chocolate"
                    loading="lazy"
                    className="h-40 sm:h-56 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                    alt="Chocolate Cake"
                    loading="lazy"
                    className="h-32 sm:h-40 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop"
                    alt="Milkshake"
                    loading="lazy"
                    className="h-32 sm:h-40 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=500&fit=crop"
                    alt="Fondue"
                    loading="lazy"
                    className="h-40 sm:h-56 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 glass-solid rounded-xl sm:rounded-2xl border border-gold-400/15 px-4 sm:px-6 py-2 sm:py-3 text-center shadow-xl">
              <p className="text-xl sm:text-2xl font-bold text-gold-300">4.8 ★</p>
              <p className="text-[10px] sm:text-xs text-chocolate-400">Customer Rating</p>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div variants={fadeUp} className="order-1 lg:order-2 lg:pl-4">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">Our Story</span>
            <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-gradient">
              A Passion for <span className="italic">Chocolate</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-chocolate-200">
              Nestled in the heart of Tirupur, The Chocolate Room brings you an
              authentic Belgian chocolate experience like no other. From our signature
              dark hot chocolate to our handcrafted truffles, every item on our menu
              is a labour of love.
            </p>
            <p className="mt-4 leading-relaxed text-chocolate-300">
              We source the finest cocoa from around the world and blend it with
              local flavours to create desserts that tell a story. Whether you are
              celebrating a special occasion or simply treating yourself, we promise
              an unforgettable experience.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/10">
                  <Clock size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-cream">Open Daily</p>
                  <p className="text-xs text-chocolate-400">10 AM – 11 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/10">
                  <MapPin size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-cream">Location</p>
                  <p className="text-xs text-chocolate-400">Tirupur, Tamil Nadu</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/app/menu')}
              className="group mt-8 sm:mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-gold-400/10 px-6 py-3 text-sm font-semibold text-gold-300 ring-1 ring-gold-400/20 transition hover:bg-gold-400/20 active:scale-95 w-full sm:w-auto"
            >
              Enter the Café
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
