import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

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
    <section className="py-10 sm:py-14 md:py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
        className="mx-auto max-w-5xl px-4 sm:px-6"
      >
        {/* Section header */}
        <motion.div variants={fadeUp} className="text-center mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">Find Us</span>
          <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient">Visit Our Café</h2>
          <div className="divider mx-auto mt-3 sm:mt-4 max-w-xs" />
        </motion.div>

        {/* Map + Info card */}
        <motion.div variants={fadeUp} custom={1} className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-400/15 bg-gradient-to-br from-chocolate-900 via-espresso to-chocolate-950 shadow-2xl">
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-40 w-96 bg-gold-400/[0.06] blur-[80px]" />

          <div className="grid lg:grid-cols-2">
            {/* Embedded map */}
            <div className="relative h-56 sm:h-72 lg:h-auto lg:min-h-[320px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.968593548359!2d77.33167437504683!3d11.115716989054425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907424abbadb5%3A0xc352e7daa4a901ba!2sThe%20Chocolate%20Room%20-%20Tirupur!5e0!3m2!1sen!2sin!4v1773294963700!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Chocolate Room – Tirupur location"
                className="absolute inset-0 h-full w-full"
              />
            </div>

            {/* Info side */}
            <div className="relative p-6 sm:p-8 md:p-10 flex flex-col justify-center">
              <h3 className="font-display text-xl sm:text-2xl text-gradient">The Chocolate Room</h3>
              <p className="mt-3 text-sm leading-relaxed text-chocolate-200">
                Your chocolate adventure awaits. Visit us today or order from the comfort of your home.
              </p>

              <div className="mt-5 sm:mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/10">
                    <MapPin size={16} className="text-gold-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-chocolate-300">Kamaraj Road, Tirupur, Tamil Nadu 641601</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/10">
                    <Clock size={16} className="text-gold-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-chocolate-300">Open Daily · 10 AM – 11 PM</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/menu')}
                className="group mt-7 sm:mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-8 py-3.5 text-sm sm:text-base font-semibold text-espresso transition hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20 active:scale-95"
              >
                Start Ordering
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
