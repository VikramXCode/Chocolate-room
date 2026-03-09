import { motion } from 'framer-motion';
import { Table2, ShoppingBag, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAppData } from '../../../context/AppDataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function WaiterDashboard() {
  const { user } = useAuth();
  const { tables, orders, notifications, setOrders } = useAppData();

  const myTables = tables.filter((t) => t.assignedWaiter === user?.id);
  const occupiedTables = myTables.filter((t) => t.status === 'occupied');
  const activeOrders = orders.filter(
    (o) => o.waiterId === user?.id && !['served', 'cancelled'].includes(o.status),
  );
  const unreadNotifs = notifications.filter((n) => !n.read);

  const markServed = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'served' as const } : o)),
    );
  };

  const stats = [
    { label: 'Assigned Tables', value: myTables.length, icon: <Table2 size={20} />, ring: 'ring-sky-500/20' },
    { label: 'Occupied', value: occupiedTables.length, icon: <Table2 size={20} />, ring: 'ring-amber-500/20' },
    { label: 'Active Orders', value: activeOrders.length, icon: <ShoppingBag size={20} />, ring: 'ring-emerald-500/20' },
    { label: 'Notifications', value: unreadNotifs.length, icon: <Bell size={20} />, ring: 'ring-red-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div {...fadeUp}>
        <h2 className="text-lg font-display text-chocolate-100">
          Welcome back, {user?.name}
        </h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ delay: i * 0.08 }}
            className={`group glass rounded-2xl p-5 ring-1 ${s.ring} hover:border-gold-400/15 transition-all duration-500`}
          >
            <div className="text-chocolate-400 mb-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-chocolate-100">{s.value}</p>
            <p className="text-[11px] text-chocolate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Notifications */}
      {unreadNotifs.length > 0 && (
        <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">
            Recent Alerts
          </h3>
          <div className="space-y-2">
            {unreadNotifs.map((n, i) => (
              <motion.div
                key={n.id}
                {...fadeUp}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="glass rounded-2xl p-4 flex items-start gap-3 border-l-4 border-gold-400/70 hover:border-gold-400/15 transition-all duration-500"
              >
                <Bell size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-chocolate-100 leading-snug">
                    Table {n.tableNumber} — {n.message}
                  </p>
                  <p className="text-[11px] text-chocolate-500 mt-1">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Orders */}
      <motion.div {...fadeUp} transition={{ delay: 0.5 }}>
        <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">
          Active Orders
        </h3>

        <div className="space-y-3">
          {activeOrders.length === 0 && (
            <p className="text-chocolate-500 text-sm">No active orders right now.</p>
          )}
          {activeOrders.map((order, i) => (
            <motion.div
              key={order.id}
              {...fadeUp}
              transition={{ delay: 0.55 + i * 0.06 }}
              className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-chocolate-100">
                    Table {order.tableNumber}
                  </span>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </div>
                <span className="text-gold-400 font-bold text-sm">₹{order.total}</span>
              </div>

              <div className="text-xs text-chocolate-400 leading-relaxed">
                {order.items.map((item) => `${item.name} ×${item.quantity}`).join(', ')}
              </div>

              {order.status === 'ready' && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                    <CheckCircle size={14} /> Ready to serve
                  </div>
                  <button
                    onClick={() => markServed(order.id)}
                    className="bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20 px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-emerald-500/25 active:scale-[0.97] transition-all duration-300"
                  >
                    Mark as served
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
