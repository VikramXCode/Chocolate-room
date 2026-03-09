import { motion } from 'framer-motion';
import { Users, Settings, BarChart3, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAppData } from '../../../context/AppDataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const weeklyData = [
  { day: 'Mon', orders: 32, revenue: 12400 },
  { day: 'Tue', orders: 28, revenue: 10800 },
  { day: 'Wed', orders: 45, revenue: 18200 },
  { day: 'Thu', orders: 38, revenue: 15600 },
  { day: 'Fri', orders: 52, revenue: 22400 },
  { day: 'Sat', orders: 65, revenue: 28800 },
  { day: 'Sun', orders: 58, revenue: 25200 },
];

const chartTooltipStyle = {
  background: '#221105',
  border: '1px solid rgba(212,175,55,0.1)',
  borderRadius: '12px',
  color: '#f0e4d4',
  fontSize: '12px',
};

export default function SuperAdminDashboard() {
  const { orders, menuItems, tables, reviews } = useAppData();

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <BarChart3 size={22} />, iconColor: 'text-gold-400' },
    { label: 'Menu Items', value: menuItems.length, icon: <Settings size={22} />, iconColor: 'text-sky-400' },
    { label: 'Total Tables', value: tables.length, icon: <Shield size={22} />, iconColor: 'text-violet-400' },
    { label: 'Total Reviews', value: reviews.length, icon: <Users size={22} />, iconColor: 'text-emerald-400' },
  ];

  return (
    <div>
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">System Overview</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500"
          >
            <div className={`${s.iconColor} opacity-70 group-hover:opacity-100 transition-opacity duration-300 mb-2`}>{s.icon}</div>
            <p className="text-2xl font-bold text-chocolate-100">{s.value}</p>
            <p className="text-[11px] text-chocolate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }} className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">Weekly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fill="url(#goldGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.5 }} className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="orders" fill="#8B4513" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
