import { motion } from 'framer-motion';
import { QrCode, ShoppingBag, UtensilsCrossed } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' as const },
  }),
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const steps = [
  {
    icon: QrCode,
    title: 'Scan QR Code',
    desc: 'Scan the QR code at your table to instantly access our digital menu',
  },
  {
    icon: ShoppingBag,
    title: 'Place Your Order',
    desc: 'Browse, customise, and order your favourite chocolate treats',
  },
  {
    icon: UtensilsCrossed,
    title: 'Enjoy!',
    desc: 'Sit back, relax, and let us serve you a delightful experience',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="mx-auto max-w-5xl px-4 sm:px-6"
      >
        <motion.div variants={fadeUp} className="text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">Simple & Easy</span>
          <h2 className="mt-2 sm:mt-3 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gradient">How It Works</h2>
          <div className="divider mx-auto mt-3 sm:mt-4 max-w-xs" />
        </motion.div>

        <div className="relative mt-10 sm:mt-12 md:mt-16 grid gap-6 sm:gap-8 md:grid-cols-3 md:gap-6">
          {/* Connecting line */}
          <div className="pointer-events-none absolute top-20 left-[16%] right-[16%] hidden h-px bg-gradient-to-r from-gold-400/0 via-gold-400/25 to-gold-400/0 md:block" />

          {steps.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp} custom={i} className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
              <div className="relative mx-auto mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gold-400/10">
                <step.icon size={24} className="sm:w-7 sm:h-7 text-gold-300" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-espresso shadow-lg shadow-gold-400/20">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl text-cream">{step.title}</h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-chocolate-300">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
