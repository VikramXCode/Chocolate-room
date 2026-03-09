import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: {
    wrapper: 'gap-1.5',
    button: 'h-7 w-7',
    icon: 14,
    text: 'text-sm min-w-[1.25rem]',
  },
  md: {
    wrapper: 'gap-2.5',
    button: 'h-9 w-9',
    icon: 16,
    text: 'text-base min-w-[1.5rem]',
  },
};

export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  size = 'sm',
}: QuantitySelectorProps) {
  const s = sizeClasses[size];

  return (
    <div className={`inline-flex items-center ${s.wrapper}`}>
      {/* Decrement / Remove */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        className={`${s.button} flex items-center justify-center rounded-full glass-light
          hover:border-gold-400/40 transition-colors
          ${quantity <= 1 ? 'text-red-400 hover:text-red-300' : 'text-chocolate-200 hover:text-gold-300'}`}
        aria-label={quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
      >
        {quantity <= 1 ? <Trash2 size={s.icon} /> : <Minus size={s.icon} />}
      </motion.button>

      {/* Quantity display */}
      <span className={`${s.text} text-center font-semibold text-cream tabular-nums select-none`}>
        {quantity}
      </span>

      {/* Increment */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        className={`${s.button} flex items-center justify-center rounded-full glass-light
          text-chocolate-200 hover:text-gold-300 hover:border-gold-400/40 transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus size={s.icon} />
      </motion.button>
    </div>
  );
}
