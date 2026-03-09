import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAppData } from '../../../context/AppDataContext';
import type { OrderStatus } from '../../../types';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];

export default function WaiterOrders() {
  const { user } = useAuth();
  const { orders, setOrders } = useAppData();
  const myOrders = orders.filter((o) => o.waiterId === user?.id && o.status !== 'cancelled');

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = statusSteps.indexOf(current);
    if (idx < 0 || idx >= statusSteps.length - 1) return null;
    return statusSteps[idx + 1];
  };

  const updateStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const ns = nextStatus(o.status);
        return ns ? { ...o, status: ns } : o;
      }),
    );
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div {...fadeUp}>
        <h2 className="text-lg font-display text-chocolate-100">Active Orders</h2>
        <p className="text-sm text-chocolate-500 mt-1">
          {myOrders.length} order{myOrders.length !== 1 && 's'} in progress
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {/* Orders list */}
      <div className="space-y-4">
        {myOrders.length === 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-10 text-center hover:border-gold-400/15 transition-all duration-500"
          >
            <ShoppingBag size={32} className="mx-auto text-chocolate-600 mb-3" />
            <p className="text-sm text-chocolate-500">No orders at the moment.</p>
          </motion.div>
        )}

        {myOrders.map((order, i) => {
          const ns = nextStatus(order.status);
          return (
            <motion.div
              key={order.id}
              {...fadeUp}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-chocolate-100">
                    Order #{order.id}
                  </span>
                  {order.tableNumber && (
                    <span className="text-[11px] text-chocolate-500">• Table {order.tableNumber}</span>
                  )}
                </div>
                <span className={`badge badge-${order.status}`}>{order.status}</span>
              </div>

              {/* Items */}
              <div className="text-xs text-chocolate-300 space-y-1 mb-4">
                {order.items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between py-0.5">
                    <span>
                      {item.name}
                      <span className="text-chocolate-500 ml-1">×{item.quantity}</span>
                    </span>
                    <span className="text-chocolate-500">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-chocolate-800/60">
                <span className="text-gold-400 font-bold text-sm">₹{order.total}</span>
                {ns && (
                  <button
                    onClick={() => updateStatus(order.id)}
                    className="bg-gold-400/10 text-gold-400 ring-1 ring-gold-400/20 px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-gold-400/20 active:scale-[0.97] transition-all duration-300"
                  >
                    Mark as {ns}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
