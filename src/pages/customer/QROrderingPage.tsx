import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Bell, Minus, Plus, X, Check, ArrowRight, Leaf } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useCart } from '../../context/CartContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function QROrderingPage() {
  const { tableId } = useParams();
  const tableNumber = parseInt(tableId || '1');
  const { menuItems } = useAppData();
  const { items, addItem, updateQuantity, removeItem, total, itemCount, placeOrder } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [callSent, setCallSent] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const handleCallWaiter = () => {
    setCallSent(true);
    setTimeout(() => setCallSent(false), 3000);
  };

  const handlePlaceOrder = () => {
    placeOrder({
      customerName: `Table ${tableNumber}`,
      customerPhone: '',
      type: 'dine-in',
      tableNumber,
      paymentMethod: 'cash',
    });
    setOrdered(true);
    setShowCart(false);
    setTimeout(() => setOrdered(false), 3000);
  };

  const availableItems = menuItems.filter((m) => m.available);
  // Group by category
  const categories = [...new Set(availableItems.map((m) => m.category))];

  return (
    <div className="min-h-screen bg-chocolate-950 pb-28">
      {/* ── Header ── */}
      <div className="glass-solid sticky top-0 z-40 px-4 py-3.5 flex items-center justify-between border-b border-chocolate-800/50">
        <div>
          <h1 className="font-display text-gold-300 text-base tracking-wide">The Chocolate Room</h1>
          <p className="text-[10px] text-chocolate-500 uppercase tracking-widest font-medium mt-0.5">Table {tableNumber}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCallWaiter}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 ${
              callSent
                ? 'bg-emerald-600 text-white ring-1 ring-emerald-400/30'
                : 'bg-chocolate-800/60 text-gold-400 hover:bg-chocolate-700/60 ring-1 ring-gold-400/15'
            }`}
          >
            {callSent ? <Check size={13} /> : <Bell size={13} />}
            {callSent ? 'Notified!' : 'Call Waiter'}
          </button>
        </div>
      </div>

      {/* Order Success Toast */}
      <AnimatePresence>
        {ordered && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 z-50 bg-emerald-600 text-white py-3 px-5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <Check size={16} /> Order placed! Your waiter will attend shortly.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Menu Sections ── */}
      <div className="px-4 py-6 space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-semibold text-chocolate-400 uppercase tracking-widest">{category}</h2>
              <div className="flex-1 h-px bg-chocolate-800/50" />
            </div>
            <div className="space-y-2.5">
              {availableItems
                .filter((item) => item.category === category)
                .map((item) => {
                  const cartItem = items.find((i) => i.menuItem.id === item.id);
                  return (
                    <motion.div key={item.id} {...fadeUp} className="glass rounded-xl p-3 flex gap-3 hover:border-gold-400/10 transition-all duration-500">
                      <div className="relative">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 ring-1 ring-chocolate-800/50" />
                        {item.popular && (
                          <span className="absolute -top-1 -left-1 bg-gold-400 text-chocolate-950 text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase">Hot</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-chocolate-100 line-clamp-1">{item.name}</h3>
                            <p className="text-[10px] text-chocolate-600 line-clamp-1 mt-0.5">{item.description}</p>
                          </div>
                          {item.veg && (
                            <span className="bg-green-600/20 text-green-400 p-0.5 rounded shrink-0">
                              <Leaf size={10} />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="font-bold text-gold-400 text-sm">₹{item.price}</span>
                          {cartItem ? (
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateQuantity(item.id, cartItem.quantity - 1)} className="w-7 h-7 rounded-lg bg-chocolate-800/80 text-chocolate-300 flex items-center justify-center hover:bg-chocolate-700 transition-colors duration-300">
                                <Minus size={12} />
                              </button>
                              <span className="text-xs text-chocolate-100 font-bold w-5 text-center">{cartItem.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, cartItem.quantity + 1)} className="w-7 h-7 rounded-lg bg-gold-400 text-chocolate-950 flex items-center justify-center hover:bg-gold-300 transition-colors duration-300">
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => addItem(item)} className="bg-gold-400/10 text-gold-400 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold ring-1 ring-gold-400/20 hover:bg-gold-400 hover:text-chocolate-950 transition-all duration-300 active:scale-[0.95]">
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Cart Preview Bar ── */}
      <AnimatePresence>
        {itemCount > 0 && !showCart && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 glass-solid px-4 py-3.5 flex items-center justify-between z-50 border-t border-gold-400/10"
          >
            <div>
              <p className="text-sm text-chocolate-100 font-semibold">{itemCount} item{itemCount > 1 ? 's' : ''}</p>
              <p className="text-gold-400 font-bold text-sm">₹{total}</p>
            </div>
            <button onClick={() => setShowCart(true)} className="bg-gold-400 text-chocolate-950 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-gold-300 transition-all duration-300 active:scale-[0.97] text-sm">
              <ShoppingCart size={15} /> View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart Bottom Sheet ── */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowCart(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 bg-chocolate-900 border-t border-gold-400/10 rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Handle bar */}
                <div className="w-10 h-1 bg-chocolate-700 rounded-full mx-auto mb-5" />
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-lg text-chocolate-100">Your Order</h3>
                  <button onClick={() => setShowCart(false)} className="text-chocolate-500 hover:text-white transition-colors duration-300">
                    <X size={18} />
                  </button>
                </div>

                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center justify-between py-3 border-b border-chocolate-800/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-chocolate-100 font-medium">{item.menuItem.name}</p>
                      <p className="text-[11px] text-chocolate-600">₹{item.menuItem.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-gold-400 text-sm">₹{item.menuItem.price * item.quantity}</span>
                      <button onClick={() => removeItem(item.menuItem.id)} className="text-chocolate-600 hover:text-red-400 transition-colors duration-300">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="divider my-4" />
                <div className="flex justify-between items-center mb-5">
                  <span className="font-semibold text-chocolate-300 text-sm">Total</span>
                  <span className="text-xl font-bold text-gold-400">₹{total}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gold-400 text-chocolate-950 py-3.5 rounded-xl font-semibold hover:bg-gold-300 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  Place Order <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
