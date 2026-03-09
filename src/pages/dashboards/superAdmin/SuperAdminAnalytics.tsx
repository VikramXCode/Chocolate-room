import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const monthlyData = [
  { month: 'Oct', revenue: 85000, orders: 420 },
  { month: 'Nov', revenue: 92000, orders: 480 },
  { month: 'Dec', revenue: 125000, orders: 620 },
  { month: 'Jan', revenue: 108000, orders: 540 },
  { month: 'Feb', revenue: 115000, orders: 575 },
  { month: 'Mar', revenue: 134000, orders: 650 },
];

const categoryBreakdown = [
  { name: 'Hot Chocolate', value: 28 },
  { name: 'Desserts', value: 22 },
  { name: 'Cakes', value: 18 },
  { name: 'Shakes', value: 15 },
  { name: 'Waffles', value: 10 },
  { name: 'Others', value: 7 },
];

const COLORS = ['#D4AF37', '#B8960C', '#8B4513', '#6B3410', '#c08050', '#d4a574'];

const chartTooltipStyle = {
  background: '#221105',
  border: '1px solid rgba(212,175,55,0.1)',
  borderRadius: '12px',
  color: '#f0e4d4',
  fontSize: '12px',
};

const iconColors = ['text-gold-400', 'text-emerald-400', 'text-sky-400', 'text-violet-400'];

const metrics = [
  { label: 'Monthly Revenue', value: '₹1,34,000', change: '+16.5%', up: true, icon: <TrendingUp size={20} /> },
  { label: 'Monthly Orders', value: '650', change: '+13.0%', up: true, icon: <ShoppingBag size={20} /> },
  { label: 'New Customers', value: '128', change: '+8.2%', up: true, icon: <Users size={20} /> },
  { label: 'Avg Rating', value: '4.5', change: '-0.1', up: false, icon: <Star size={20} /> },
];

export default function SuperAdminAnalytics() {
  return (
    <div>
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Analytics Overview</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${iconColors[i]} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}>{m.icon}</div>
              <span className={`text-[11px] font-medium flex items-center gap-0.5 ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {m.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {m.change}
              </span>
            </div>
            <p className="text-xl font-bold text-chocolate-100">{m.value}</p>
            <p className="text-[11px] text-chocolate-500 mt-1">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }} className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">Revenue Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="goldGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B4513', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fill="url(#goldGrad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.5 }} className="glass rounded-2xl p-5 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">Category Breakdown (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}%`}>
                {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
