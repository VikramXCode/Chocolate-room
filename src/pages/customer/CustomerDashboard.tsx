import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, Star, Heart, TrendingUp, MapPin, ArrowRight, Utensils, MessageSquare, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAppData } from '../../context/AppDataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { orders, itemCount } = useCart();
  const { menuItems, reviews } = useAppData();

  const myReviews = reviews.filter((r) => r.customerName === user?.name);
  const popularItems = menuItems.filter((m) => m.popular && m.available).slice(0, 6);
  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const quickActions = [
    { label: 'Browse Menu', desc: 'Explore our offerings', icon: <Utensils size={22} />, to: '/menu', gradient: 'from-gold-400 to-gold-600', ring: 'ring-gold-400/20' },
    { label: 'View Cart', desc: `${itemCount} items`, icon: <ShoppingCart size={22} />, to: '/cart', gradient: 'from-emerald-500 to-emerald-800', ring: 'ring-emerald-500/20' },
    { label: 'Order History', desc: `${orders.length} orders`, icon: <Clock size={22} />, to: '#orders', gradient: 'from-sky-500 to-blue-800', ring: 'ring-sky-500/20' },
    { label: 'Write Review', desc: `${myReviews.length} written`, icon: <MessageSquare size={22} />, to: '/reviews', gradient: 'from-violet-500 to-purple-800', ring: 'ring-violet-500/20' },
  ];

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={20} />, color: 'text-gold-400' },
    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'text-emerald-400' },
    { label: 'Reviews', value: myReviews.length, icon: <Star size={20} />, color: 'text-amber-400' },
    { label: 'Favorites', value: 12, icon: <Heart size={20} />, color: 'text-rose-400' },
  ];

  return (
    <div className="px-4 md:px-8 py-12 max-w-7xl mx-auto">
      {/* ──── Welcome ──── */}
      <motion.div {...fadeUp} className="mb-10">
        <p className="text-chocolate-500 text-sm font-medium mb-1">{greeting}</p>
        <h1 className="font-display text-3xl md:text-4xl text-chocolate-50">{user?.name}</h1>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {/* ──── Stats ──── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div key={i} {...fadeUp} transition={{ delay: 0.05 * i }} className="glass rounded-2xl p-5 group hover:border-gold-400/15 transition-all duration-500">
            <div className={`${s.color} mb-2.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300`}>{s.icon}</div>
            <p className="text-2xl font-bold text-chocolate-100">{s.value}</p>
            <p className="text-[11px] text-chocolate-500 mt-0.5 uppercase tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ──── Quick Actions ──── */}
      <div className="mb-12">
        <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: 0.05 * i }}>
              <Link to={action.to} className={`block bg-gradient-to-br ${action.gradient} rounded-2xl p-5 ring-1 ${action.ring} hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] group`}>
                <div className="text-white/80 mb-3 group-hover:text-white transition-colors duration-300">{action.icon}</div>
                <p className="font-semibold text-white text-sm mb-0.5">{action.label}</p>
                <p className="text-[11px] text-white/60">{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ──── Recent Orders ──── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Recent Orders</h2>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <ShoppingBag size={40} className="text-chocolate-700 mx-auto mb-3" />
                <p className="text-chocolate-500 text-sm mb-5">No orders yet</p>
                <Link to="/app/menu" className="bg-gold-400 text-chocolate-950 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-300 transition-all duration-300 inline-flex items-center gap-2">
                  Start Ordering <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              recentOrders.map((order, i) => (
                <motion.div key={order.id} {...fadeUp} transition={{ delay: 0.05 * i }} className="glass rounded-xl p-4 hover:border-gold-400/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-chocolate-100">#{order.id.slice(-6)}</span>
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
                  </div>
                  <p className="text-[11px] text-chocolate-500 mb-2">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-chocolate-500">{order.items.length} items</span>
                    <span className="text-gold-400 font-bold">₹{order.total}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* ──── Trending ──── */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Trending Now</h2>
            <Link to="/app/menu" className="text-xs text-gold-400 hover:text-gold-300 transition-colors duration-300 flex items-center gap-1 group">
              View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularItems.map((item, i) => (
              <motion.div key={item.id} {...fadeUp} transition={{ delay: 0.05 * i }} className="glass rounded-xl overflow-hidden hover:border-gold-400/15 transition-all duration-500 group">
                <div className="h-28 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-chocolate-100 line-clamp-1 mb-1">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-400 font-bold text-sm">₹{item.price}</span>
                    <Link to="/app/menu" className="text-[10px] bg-gold-400/10 text-gold-400 px-2 py-0.5 rounded hover:bg-gold-400/20 transition-colors duration-300 font-medium">
                      Order
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ──── Promo Banner ──── */}
      <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-12 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.05),transparent)]" />
        <div className="relative px-8 py-10 text-center">
          <p className="text-chocolate-950/70 text-xs font-semibold uppercase tracking-widest mb-2">Limited Time</p>
          <h3 className="font-display text-2xl md:text-3xl text-chocolate-950 mb-2">20% Off on orders above ₹500</h3>
          <p className="text-chocolate-900/70 text-sm mb-5">Use any of our signature chocolates. Valid till end of month.</p>
          <Link to="/app/menu" className="inline-flex items-center gap-2 bg-chocolate-950 text-gold-300 px-7 py-3 rounded-xl font-semibold hover:bg-chocolate-900 transition-all duration-300 shadow-lg shadow-chocolate-950/20 active:scale-[0.97]">
            Order Now <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>

      {/* ──── Delivery ──── */}
      <div className="mt-8 glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-gold-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-chocolate-100">Delivery Address</h4>
            <p className="text-xs text-chocolate-500 mt-0.5">Save your address for faster checkout</p>
          </div>
        </div>
        <button className="bg-gold-400 text-chocolate-950 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gold-300 transition-all duration-300 active:scale-[0.97] shrink-0">
          Add Address
        </button>
      </div>
    </div>
  );
}
