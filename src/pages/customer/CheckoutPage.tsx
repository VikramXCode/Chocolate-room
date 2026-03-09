import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Truck,
  ShoppingBag,
  Smartphone,
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../state/cartStore';
import { useOrderStore } from '../../state/orderStore';
import { useUserStore } from '../../state/userStore';
import type { OrderType, PaymentMethod } from '../../types/order.types';

const DELIVERY_FEE = 30;

/* ------------------------------------------------------------------ */
/*  Order‑type & payment‑method option configs                        */
/* ------------------------------------------------------------------ */

const orderTypeOptions: {
  value: OrderType;
  label: string;
  desc: string;
  icon: typeof UtensilsCrossed;
}[] = [
  {
    value: 'dine-in',
    label: 'Dine‑In',
    desc: 'Enjoy at the café',
    icon: UtensilsCrossed,
  },
  {
    value: 'delivery',
    label: 'Delivery',
    desc: 'To your doorstep',
    icon: Truck,
  },
  {
    value: 'takeaway',
    label: 'Takeaway',
    desc: 'Pick up & go',
    icon: ShoppingBag,
  },
];

const paymentOptions: {
  value: PaymentMethod;
  label: string;
  icon: typeof Smartphone;
}[] = [
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'cash', label: 'Cash', icon: Banknote },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const navigate = useNavigate();

  /* --- stores --- */
  const { items, subtotal, tax, total, clearCart } = useCartStore();
  const { placeOrder, loading } = useOrderStore();
  const { profile, tableNumber: storeTable } = useUserStore();

  /* --- local form state --- */
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [name, setName] = useState(profile.name === 'Guest' ? '' : profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [table, setTable] = useState<string>(storeTable?.toString() ?? '');
  const defaultAddr =
    profile.addresses.find((a) => a.isDefault)?.address ?? '';
  const [address, setAddress] = useState(defaultAddr);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  /* --- derived --- */
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const grandTotal = useMemo(() => total() + deliveryFee, [items, deliveryFee]);

  const isEmpty = items.length === 0;

  /* ---- validation + submit ---- */
  const handlePlaceOrder = async () => {
    setError('');

    if (!name.trim()) return setError('Please enter your name.');
    if (!phone.trim() || phone.length < 10)
      return setError('Please enter a valid phone number.');
    if (orderType === 'dine-in' && !table.trim())
      return setError('Please enter a table number.');
    if (orderType === 'delivery' && !address.trim())
      return setError('Please enter a delivery address.');

    try {
      const order = await placeOrder({
        items,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        type: orderType,
        tableNumber:
          orderType === 'dine-in' ? Number(table) : undefined,
        address: orderType === 'delivery' ? address.trim() : undefined,
        paymentMethod,
      });
      clearCart();
      setSuccess(true);

      // Short delay so user sees success flash, then redirect
      setTimeout(() => navigate(`/app/orders/${order.id}`), 1200);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  /* ---- empty guard ---- */
  if (isEmpty && !success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full glass">
          <ShoppingBag size={40} className="text-chocolate-500" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-cream">
          Nothing to check out
        </h2>
        <p className="mb-8 text-chocolate-400">
          Add some items to your cart first.
        </p>
        <Link
          to="/app/menu"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-espresso shadow-lg shadow-gold-500/20 transition-all hover:shadow-gold-500/30"
        >
          Browse Menu
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  /* ---- success overlay ---- */
  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 ring-2 ring-green-500/30"
        >
          <CheckCircle2 size={48} className="text-green-400" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold text-cream">
          Order Placed!
        </h2>
        <p className="text-chocolate-400">Redirecting to your order…</p>
      </div>
    );
  }

  /* ---- input classes ---- */
  const inputCls =
    'w-full rounded-xl border border-chocolate-800/50 bg-chocolate-900/60 px-4 py-3 text-cream placeholder:text-chocolate-600 focus:border-gold-400/30 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-colors';

  /* ================================================================ */
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
            Checkout
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ============ LEFT — FORM ============ */}
          <div className="space-y-6">
            {/* ---------- Order Type ---------- */}
            <section className="glass-solid rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-bold text-cream">
                Order Type
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {orderTypeOptions.map((opt) => {
                  const active = orderType === opt.value;
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.value}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setOrderType(opt.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                        active
                          ? 'border-gold-400/30 bg-gold-400/5 text-gold-400'
                          : 'border-chocolate-800/40 bg-chocolate-900/30 text-chocolate-300 hover:border-chocolate-700/50'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="font-semibold">{opt.label}</span>
                      <span className="text-xs text-chocolate-500">
                        {opt.desc}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* ---------- Customer Details ---------- */}
            <section className="glass-solid rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-bold text-cream">
                Customer Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-chocolate-400">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-chocolate-400">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10‑digit number"
                    className={inputCls}
                  />
                </div>
              </div>
            </section>

            {/* ---------- Conditional: Table / Address ---------- */}
            <AnimatePresence mode="wait">
              {orderType === 'dine-in' && (
                <motion.section
                  key="dine-in"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="glass-solid rounded-2xl p-6"
                >
                  <h2 className="mb-4 text-lg font-bold text-cream">
                    Table Number
                  </h2>
                  <input
                    type="number"
                    min={1}
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    placeholder="e.g. 5"
                    className={`${inputCls} max-w-[160px]`}
                  />
                </motion.section>
              )}

              {orderType === 'delivery' && (
                <motion.section
                  key="delivery"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="glass-solid rounded-2xl p-6"
                >
                  <h2 className="mb-4 text-lg font-bold text-cream">
                    Delivery Address
                  </h2>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full delivery address"
                    className={`${inputCls} resize-none`}
                  />
                  <p className="mt-2 text-xs text-chocolate-500">
                    Delivery fee: +₹{DELIVERY_FEE} will be added to your total.
                  </p>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ---------- Payment Method ---------- */}
            <section className="glass-solid rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-bold text-cream">
                Payment Method
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {paymentOptions.map((opt) => {
                  const active = paymentMethod === opt.value;
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.value}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPaymentMethod(opt.value)}
                      className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                        active
                          ? 'border-gold-400/30 bg-gold-400/5 text-gold-400'
                          : 'border-chocolate-800/40 bg-chocolate-900/30 text-chocolate-300 hover:border-chocolate-700/50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-semibold">{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* ============ RIGHT — ORDER SUMMARY ============ */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-solid rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-bold text-cream">
                Order Summary
              </h2>

              {/* Compact item list */}
              <ul className="mb-4 space-y-2 text-sm">
                {items.map((item) => (
                  <li
                    key={item.menuItem.id}
                    className="flex justify-between text-chocolate-300"
                  >
                    <span className="truncate pr-3">
                      {item.menuItem.name}{' '}
                      <span className="text-chocolate-500">×{item.quantity}</span>
                    </span>
                    <span className="flex-shrink-0 tabular-nums">
                      ₹{item.menuItem.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="divider" />

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-chocolate-300">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{subtotal()}</span>
                </div>
                <div className="flex justify-between text-chocolate-300">
                  <span>Tax (5% GST)</span>
                  <span className="tabular-nums">₹{tax()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-chocolate-300">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums">₹{deliveryFee}</span>
                  </div>
                )}

                <div className="divider" />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-cream">Grand Total</span>
                  <span className="text-gold-400 tabular-nums">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Place Order button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={handlePlaceOrder}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-3.5 font-semibold text-espresso shadow-lg shadow-gold-500/20 transition-shadow hover:shadow-gold-500/30 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  <>
                    Place Order — ₹{grandTotal}
                  </>
                )}
              </motion.button>

              <p className="mt-3 text-center text-xs text-chocolate-600">
                By placing this order you agree to our Terms&nbsp;of&nbsp;Service
                and Privacy&nbsp;Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
