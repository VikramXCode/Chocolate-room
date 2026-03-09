import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, CreditCard, ArrowLeft, Check, User, Smartphone, Banknote, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const paymentIcons = { upi: <Smartphone size={14} />, card: <CreditCard size={14} />, cash: <Banknote size={14} /> };

export default function DeliveryPage() {
  const { items, total, placeOrder } = useCart();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    paymentMethod: 'upi' as 'upi' | 'card' | 'cash',
  });

  const tax = Math.round(total * 0.05);
  const deliveryFee = 30;
  const grandTotal = total + tax + deliveryFee;

  const handleOrder = () => {
    if (!form.customerName || !form.customerPhone || !form.address) return;
    placeOrder({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      type: 'delivery',
      address: form.address,
      paymentMethod: form.paymentMethod,
    });
    setOrdered(true);
    setTimeout(() => navigate('/'), 2500);
  };

  if (ordered) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="text-center glass rounded-2xl p-12 max-w-sm mx-auto">
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-600/20">
            <Check size={36} className="text-white" />
          </div>
          <h2 className="font-display text-2xl text-chocolate-50 mb-2">Order Confirmed!</h2>
          <p className="text-chocolate-400 text-sm">Your delivery order is being prepared.</p>
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent mx-auto mt-5" />
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div {...fadeUp} className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-chocolate-800/50 flex items-center justify-center mx-auto mb-4">
            <Truck size={24} className="text-chocolate-600" />
          </div>
          <p className="text-chocolate-400 text-sm mb-5">No items in cart for delivery</p>
          <button onClick={() => navigate('/app/menu')} className="bg-gold-400 text-chocolate-950 px-7 py-3 rounded-xl font-semibold hover:bg-gold-300 transition-all duration-300 active:scale-[0.97]">Browse Menu</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-12 max-w-2xl mx-auto">
      <motion.div {...fadeUp}>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-chocolate-500 hover:text-gold-400 mb-6 transition-colors duration-300 text-xs font-medium uppercase tracking-wider">
          <ArrowLeft size={14} /> Back
        </button>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="mb-8">
        <p className="text-xs font-semibold text-chocolate-400 uppercase tracking-widest mb-2">Delivery</p>
        <h1 className="font-display text-3xl text-chocolate-50">Complete Your Order</h1>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 space-y-6">
        {/* Order summary */}
        <div className="pb-5 border-b border-chocolate-800/50">
          <h3 className="text-[11px] text-chocolate-500 uppercase tracking-widest font-semibold mb-3">Order Items</h3>
          {items.map((i) => (
            <div key={i.menuItem.id} className="flex justify-between text-sm text-chocolate-400 py-1.5">
              <span className="text-chocolate-300">{i.menuItem.name} <span className="text-chocolate-600">× {i.quantity}</span></span>
              <span className="text-chocolate-300">₹{i.menuItem.price * i.quantity}</span>
            </div>
          ))}
          <div className="divider my-3" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-chocolate-500"><span>Subtotal</span><span>₹{total}</span></div>
            <div className="flex justify-between text-chocolate-500"><span>Tax (5%)</span><span>₹{tax}</span></div>
            <div className="flex justify-between text-chocolate-500"><span>Delivery</span><span>₹{deliveryFee}</span></div>
          </div>
          <div className="divider my-3" />
          <div className="flex justify-between text-gold-400 font-bold text-base">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        {/* Delivery form */}
        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-chocolate-500 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider font-medium"><User size={11} /> Full Name</label>
            <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-chocolate-900/60 border border-chocolate-800/50 text-chocolate-100 placeholder:text-chocolate-600 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300" placeholder="Your name" />
          </div>
          <div>
            <label className="text-[11px] text-chocolate-500 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider font-medium"><Phone size={11} /> Phone Number</label>
            <input type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-chocolate-900/60 border border-chocolate-800/50 text-chocolate-100 placeholder:text-chocolate-600 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="text-[11px] text-chocolate-500 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider font-medium"><MapPin size={11} /> Delivery Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-chocolate-900/60 border border-chocolate-800/50 text-chocolate-100 placeholder:text-chocolate-600 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300 resize-none" placeholder="Full address with landmark..." />
          </div>
          <div>
            <label className="text-[11px] text-chocolate-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider font-medium"><CreditCard size={11} /> Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {(['upi', 'card', 'cash'] as const).map((m) => (
                <button key={m} onClick={() => setForm({ ...form, paymentMethod: m })} className={`py-3 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${form.paymentMethod === m ? 'bg-gold-400 text-chocolate-950 ring-1 ring-gold-300/30' : 'bg-chocolate-800/60 text-chocolate-400 hover:text-chocolate-200 ring-1 ring-chocolate-700/50'}`}>
                  {paymentIcons[m]} {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleOrder} disabled={!form.customerName || !form.customerPhone || !form.address} className="w-full bg-gold-400 text-chocolate-950 py-3.5 rounded-xl font-semibold hover:bg-gold-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] mt-2">
          Place Delivery Order — ₹{grandTotal}
        </button>
      </motion.div>
    </div>
  );
}
