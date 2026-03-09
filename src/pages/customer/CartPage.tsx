import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../state/cartStore';
import QuantitySelector from '../../components/QuantitySelector';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal, tax, total, itemCount } =
    useCartStore();

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-chocolate-400 transition-colors hover:text-gold-400"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gradient sm:text-4xl">
            Your Cart
          </h1>
          {!isEmpty && (
            <p className="mt-1 text-chocolate-400">
              {itemCount()} {itemCount() === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full glass">
              <ShoppingBag size={40} className="text-chocolate-500" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-cream">
              Your cart is empty
            </h2>
            <p className="mb-8 max-w-sm text-chocolate-400">
              Looks like you haven't added any delicious treats yet. Browse our
              menu and discover something you'll love.
            </p>
            <Link
              to="/app/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-espresso shadow-lg shadow-gold-500/20 transition-all hover:shadow-gold-500/30"
            >
              Browse Menu
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          /* Cart Content — 2 column on lg */
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left — Items List */}
            <div className="space-y-0">
              <AnimatePresence mode="popLayout">
                {items.map((item, idx) => (
                  <motion.div
                    key={item.menuItem.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex gap-4 py-5">
                      {/* Thumbnail */}
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-chocolate-800/40"
                      />

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-cream">
                            {item.menuItem.name}
                          </h3>
                          <span className="text-xs text-chocolate-500">
                            {item.menuItem.category}
                          </span>
                          <p className="mt-0.5 text-sm text-chocolate-300">
                            ₹{item.menuItem.price}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                          <QuantitySelector
                            quantity={item.quantity}
                            onIncrement={() =>
                              updateQuantity(
                                item.menuItem.id,
                                item.quantity + 1,
                              )
                            }
                            onDecrement={() =>
                              updateQuantity(
                                item.menuItem.id,
                                item.quantity - 1,
                              )
                            }
                            size="md"
                          />

                          <button
                            onClick={() => removeItem(item.menuItem.id)}
                            className="rounded-lg p-1.5 text-chocolate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Remove ${item.menuItem.name}`}
                          >
                            <Trash2 size={18} />
                          </button>

                          <span className="min-w-[4.5rem] text-right font-semibold text-cream tabular-nums">
                            ₹{item.menuItem.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    {idx < items.length - 1 && <div className="divider" />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-solid rounded-2xl p-6">
                <h2 className="mb-5 text-lg font-bold text-cream">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-chocolate-300">
                    <span>Subtotal</span>
                    <span className="tabular-nums">₹{subtotal()}</span>
                  </div>
                  <div className="flex justify-between text-chocolate-300">
                    <span>Tax (5% GST)</span>
                    <span className="tabular-nums">₹{tax()}</span>
                  </div>

                  <div className="divider" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-cream">Total</span>
                    <span className="text-gold-400 tabular-nums">
                      ₹{total()}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/app/checkout')}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-3.5 font-semibold text-espresso shadow-lg shadow-gold-500/20 transition-shadow hover:shadow-gold-500/30"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </motion.button>

                <Link
                  to="/app/menu"
                  className="mt-3 block text-center text-sm text-chocolate-400 transition-colors hover:text-gold-400"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
