import { motion } from 'framer-motion';
import { ShoppingBag, DollarSign, TrendingUp, Table2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppData } from '../../../context/AppDataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const CHART_COLORS = ['#D4AF37', '#B8960C', '#8B4513', '#6B3410', '#c08050', '#d4a574'];

const chartTooltipStyle = {
  background: '#221105',
  border: '1px solid rgba(212,175,55,0.1)',
  borderRadius: '12px',
  color: '#f0e4d4',
  fontSize: '12px',
};

export default function AdminDashboard() {
  const { orders, menuItems, tables } = useAppData();

  const todayOrders = orders.filter((o) => o.status !== 'cancelled');
  const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const activeTables = tables.filter((t) => t.status === 'occupied').length;

  const categoryData = menuItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.price;
    return acc;
  }, {});
  const barData = Object.entries(categoryData).map(([name, value]) => ({ name: name.slice(0, 12), value }));

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const popularItems = menuItems.filter((m) => m.popular);

  const stats = [
    { label: 'Orders Today', value: todayOrders.length, icon: <ShoppingBag size={22} />, iconColor: 'text-gold-400' },
    { label: 'Revenue Today', value: `₹${revenue.toLocaleString()}`, icon: <DollarSign size={22} />, iconColor: 'text-emerald-400' },
    { label: 'Popular Items', value: popularItems.length, icon: <TrendingUp size={22} />, iconColor: 'text-sky-400' },
    { label: 'Active Tables', value: activeTables, icon: <Table2 size={22} />, iconColor: 'text-violet-400' },
  ];

  return (
    <div>
      {/* Page header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">rajasaab</h2>
        <p className="text-2xl font-display text-chocolate-100 mt-1">Dashboard Overview</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500"
          >
            <div className={`${s.iconColor} opacity-70 group-hover:opacity-100 mb-3 transition-opacity duration-300`}>{s.icon}</div>
            <p className="text-2xl font-bold text-chocolate-100">{s.value}</p>
            <p className="text-[11px] text-chocolate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-5">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="value" fill="#D4AF37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.5 }} className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-5">Order Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Popular items */}
      <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }} className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500">
        <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-5">Popular Items</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ delay: 0.45 + i * 0.05, duration: 0.4 }}
              className="group flex items-center gap-3 p-3 rounded-xl bg-chocolate-900/40 ring-1 ring-chocolate-800/50 hover:ring-gold-400/20 transition-all duration-500"
            >
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover ring-1 ring-chocolate-800/50" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-chocolate-100 truncate">{item.name}</p>
                <p className="text-xs text-gold-400 font-bold mt-0.5">₹{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
