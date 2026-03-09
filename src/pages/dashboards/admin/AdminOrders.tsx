import { motion } from 'framer-motion';
import { useAppData } from '../../../context/AppDataContext';
import type { OrderStatus } from '../../../types';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];

export default function AdminOrders() {
  const { orders, setOrders } = useAppData();

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div>
      {/* Page header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Operations</h2>
        <p className="text-2xl font-display text-chocolate-100 mt-1">Order Management</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.15, duration: 0.5 }} className="glass rounded-2xl mt-8 overflow-hidden hover:border-gold-400/15 transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-chocolate-800/60">
                <th className="py-3 px-4 text-[11px] font-semibold text-chocolate-500 uppercase tracking-wider text-left">Order</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-chocolate-500 uppercase tracking-wider text-left">Customer</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-chocolate-500 uppercase tracking-wider text-left hidden md:table-cell">Type</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-chocolate-500 uppercase tracking-wider text-left hidden lg:table-cell">Items</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-chocolate-500 uppercase tracking-wider text-left">Total</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-chocolate-500 uppercase tracking-wider text-left">Status</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-chocolate-500 uppercase tracking-wider text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-chocolate-800/30 hover:bg-gold-400/[0.02] transition-colors duration-300">
                  <td className="py-3.5 px-4 text-chocolate-100 font-medium text-xs">#{order.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="text-sm text-chocolate-200">{order.customerName}</p>
                    <p className="text-[11px] text-chocolate-600">{order.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-chocolate-400 hidden md:table-cell capitalize">{order.type}</td>
                  <td className="py-3.5 px-4 text-chocolate-500 hidden lg:table-cell text-[11px] max-w-[200px] truncate">
                    {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-gold-400 font-bold text-sm">₹{order.total}</td>
                  <td className="py-3.5 px-4">
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-chocolate-900/60 border border-chocolate-800/50 text-chocolate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-gold-400/30 transition-colors duration-300"
                    >
                      {statusSteps.map((s) => <option key={s} value={s}>{s}</option>)}
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
