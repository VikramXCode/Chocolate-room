import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useCartStore } from '../state/cartStore';
import QuantitySelector from './QuantitySelector';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: {
    x: '100%',
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
} as const;

const itemVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40, height: 0, marginBottom: 0, transition: { duration: 0.25 } },
};

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
  } = useCartStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="cart-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col glass-solid shadow-2xl"
          >
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between border-b border-gold-400/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-cream">Your Cart</h2>
                {itemCount() > 0 && (
                  <span className="badge bg-gold-400/15 text-gold-300">{itemCount()}</span>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={closeDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-full glass-light text-chocolate-200 hover:text-cream transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* ---- Body ---- */}
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full glass-light">
                  <ShoppingBag size={36} className="text-chocolate-400" />
                </div>
                <p className="text-lg font-semibold text-chocolate-200">Your cart is empty</p>
                <p className="text-sm text-chocolate-400">
                  Looks like you haven't added anything yet.
                </p>
                <Link
                  to="/app/menu"
                  onClick={closeDrawer}
                  className="mt-2 rounded-full bg-gold-400/15 px-6 py-2.5 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-400/25"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              /* Cart items */
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.menuItem.id}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      className="mb-3 flex gap-3 rounded-xl glass-light p-3"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                      />

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between gap-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-cream truncate">
                            {item.menuItem.name}
                          </p>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeItem(item.menuItem.id)}
                            className="flex-shrink-0 text-chocolate-400 hover:text-red-400 transition-colors"
                            aria-label={`Remove ${item.menuItem.name}`}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gold-300">
                            ₹{item.menuItem.price * item.quantity}
                          </span>
                          <QuantitySelector
                            quantity={item.quantity}
                            onIncrement={() =>
                              updateQuantity(item.menuItem.id, item.quantity + 1)
                            }
                            onDecrement={() =>
                              updateQuantity(item.menuItem.id, item.quantity - 1)
                            }
                            size="sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* ---- Bottom sticky section ---- */}
            {items.length > 0 && (
              <div className="border-t border-gold-400/10 px-5 pb-5 pt-4">
                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-chocolate-200">
                    <span>Subtotal</span>
                    <span>₹{subtotal()}</span>
                  </div>
                  <div className="flex justify-between text-chocolate-300">
                    <span>Tax (5% GST)</span>
                    <span>₹{tax()}</span>
                  </div>

                  <div className="divider my-2" />

                  <div className="flex justify-between text-base font-bold text-cream">
                    <span>Total</span>
                    <span className="text-gradient">₹{total()}</span>
                  </div>
                </div>

                {/* Actions */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    closeDrawer();
                    navigate('/app/checkout');
                  }}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 py-3 text-center text-sm font-bold text-espresso shadow-lg transition-shadow hover:shadow-gold-400/25"
                >
                  Proceed to Checkout — ₹{total()}
                </motion.button>

                <button
                  onClick={clearCart}
                  className="mt-2 w-full py-2 text-center text-xs font-medium text-chocolate-400 transition-colors hover:text-red-400"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
