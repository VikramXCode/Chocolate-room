import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Leaf, AlertTriangle, Star } from 'lucide-react';
import type { MenuItem } from '../types/menu.types';
import { useCartStore } from '../state/cartStore';
import QuantitySelector from './QuantitySelector';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const { items, addItem, updateQuantity } = useCartStore();

  const cartEntry = item ? items.find((i) => i.menuItem.id === item.id) : undefined;

  // Close on Escape key
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            key="modal-card"
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl glass-solid shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center
                rounded-full bg-black/50 text-chocolate-200 backdrop-blur-sm
                transition-colors hover:text-cream"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-4 p-5 sm:p-6">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-chocolate-700/50 text-chocolate-200">
                  {item.category}
                </span>

                {item.veg && (
                  <span className="badge bg-emerald-500/15 text-emerald-400">
                    <Leaf size={12} /> Veg
                  </span>
                )}

                {item.popular && (
                  <span className="badge bg-gold-400/15 text-gold-400">
                    <Star size={12} /> Popular
                  </span>
                )}
              </div>

              {/* Name */}
              <h2 className="font-display text-2xl font-bold text-cream">
                {item.name}
              </h2>

              {/* Description */}
              <p className="text-sm leading-relaxed text-chocolate-200">
                {item.description}
              </p>

              {/* Price */}
              <p className="font-display text-2xl font-semibold text-gradient">
                ₹{item.price}
              </p>

              {/* Unavailable notice */}
              {!item.available && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  <AlertTriangle size={16} />
                  Currently Unavailable
                </div>
              )}

              {/* Action */}
              {item.available && (
                <div className="pt-1">
                  {cartEntry ? (
                    <div className="flex items-center justify-between rounded-xl bg-chocolate-800/60 px-4 py-2.5">
                      <span className="text-sm text-chocolate-200">In cart</span>
                      <QuantitySelector
                        quantity={cartEntry.quantity}
                        onIncrement={() => updateQuantity(item.id, cartEntry.quantity + 1)}
                        onDecrement={() => updateQuantity(item.id, cartEntry.quantity - 1)}
                        size="md"
                      />
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addItem(item)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl
                        bg-gold-400 px-4 py-3 font-semibold text-espresso
                        transition-colors hover:bg-gold-300"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
