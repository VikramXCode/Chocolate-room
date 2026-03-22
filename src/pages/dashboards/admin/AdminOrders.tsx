import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../../../context/AppDataContext';
import type { OrderStatus, Order, MenuItem } from '../../../types';
import { Clock, AlertCircle, CheckCircle, ChefHat } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];

const formatStatus = (status: OrderStatus) => {
  if (status === 'preparing') return 'To be prepared';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function AdminOrders() {
  const { orders, setOrders, menuItems } = useAppData();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const calculatePrepTime = (order: Order) => {
    let maxPrepTime = 0;
    order.items.forEach(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (menuItem?.prepTimeMinutes && menuItem.prepTimeMinutes > maxPrepTime) {
        maxPrepTime = menuItem.prepTimeMinutes;
      }
    });
    return maxPrepTime || 15; // default 15 mins if not set
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Page header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Operations</h2>
        <p className="text-2xl font-display text-chocolate-100 mt-1">Order Management</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      <motion.div 
        {...fadeUp} 
        transition={{ delay: 0.15, duration: 0.5 }} 
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {orders.map((order) => {
            const prepTime = calculatePrepTime(order);
            const placedAt = new Date(order.createdAt);
            const dueAt = new Date(placedAt.getTime() + prepTime * 60000);
            const minsRemaining = Math.round((dueAt.getTime() - now.getTime()) / 60000);
            
            // To make mock data look realistic, let's just show an absolute difference if it's very old/future, 
            // but for real usage minsRemaining controls the urgency
            const isLate = minsRemaining < 0;
            const isUrgent = !isLate && minsRemaining <= 5;
            const isPreparingOrPending = ['pending', 'confirmed', 'preparing'].includes(order.status);
            
            return (
              <motion.div 
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass rounded-2xl overflow-hidden border ${isUrgent && isPreparingOrPending ? 'border-orange-500/50' : isLate && isPreparingOrPending ? 'border-red-500/50' : 'border-chocolate-800/60'} hover:border-gold-400/30 transition-all duration-300 flex flex-col`}
              >
                {/* Header */}
                <div className={`p-4 border-b border-chocolate-800/40 flex justify-between items-start ${(isUrgent || isLate) && isPreparingOrPending ? 'bg-red-500/5' : ''}`}>
                  <div>
                    <span className="text-chocolate-100 font-bold mb-1 block">#{order.id}</span>
                    <h3 className="text-sm font-medium text-chocolate-200">{order.customerName}</h3>
                    <p className="text-[11px] text-chocolate-500">{order.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'preparing' ? 'bg-orange-500/20 text-orange-400' :
                      order.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                      'bg-chocolate-800 text-chocolate-300'
                    }`}>
                      {formatStatus(order.status)}
                    </span>
                    <p className="text-xs font-semibold text-gold-400 mt-2 capitalize">{order.type}</p>
                  </div>
                </div>

                {/* Tracking Info */}
                {isPreparingOrPending && (
                  <div className={`px-4 py-3 border-b border-chocolate-800/40 flex items-center justify-between text-xs ${(isUrgent || isLate) ? 'bg-red-500/10' : 'bg-chocolate-900/40'}`}>
                    <div className="flex items-center gap-2 text-chocolate-300">
                      <Clock size={14} className="text-chocolate-400" />
                      <span>Placed: {placedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    {isLate ? (
                      <div className="flex items-center gap-1.5 text-red-400 font-semibold animate-pulse">
                        <AlertCircle size={14} />
                        <span>Late by {Math.abs(minsRemaining)}m</span>
                      </div>
                    ) : isUrgent ? (
                      <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                        <ChefHat size={14} />
                        <span>Due in {minsRemaining}m</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-chocolate-400">
                        <CheckCircle size={14} />
                        <span>{minsRemaining}m remaining</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Items */}
                <div className="p-4 flex-grow">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start text-sm">
                        <div className="flex gap-2 text-chocolate-200">
                          <span className="font-semibold text-gold-400">×{item.quantity}</span>
                          <span className="line-clamp-2">{item.name}</span>
                        </div>
                        <span className="text-chocolate-400 text-xs">
                          {menuItems.find(m => m.id === item.menuItemId)?.category || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-4 bg-chocolate-900/30 border-t border-chocolate-800/40 flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-gold-400">₹{order.total}</span>
                  
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-chocolate-950/80 border border-chocolate-700/50 text-chocolate-100 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-gold-400/50 transition-colors duration-300 shadow-inner"
                  >
                    {statusSteps.map((s) => (
                      <option key={s} value={s}>{formatStatus(s)}</option>
                    ))}
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
