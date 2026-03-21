import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, UserCog, ConciergeBell, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; path: string; gradient: string; ring: string }[] = [
  { role: 'superadmin', label: 'Super Admin', desc: 'System settings & analytics', icon: <Shield size={26} />, path: '/dashboard/superadmin', gradient: 'from-violet-600 to-purple-900', ring: 'ring-violet-500/30' },
  { role: 'admin', label: 'rajasaab', desc: 'Products, orders & tables', icon: <UserCog size={26} />, path: '/dashboard/admin', gradient: 'from-sky-500 to-blue-900', ring: 'ring-sky-500/30' },
  { role: 'waiter', label: 'Waiter', desc: 'Tables, orders & alerts', icon: <ConciergeBell size={26} />, path: '/dashboard/waiter', gradient: 'from-emerald-500 to-green-900', ring: 'ring-emerald-500/30' },
  { role: 'customer', label: 'Customer', desc: 'Browse & order', icon: <User size={26} />, path: '/app', gradient: 'from-gold-400 to-gold-600', ring: 'ring-gold-400/30' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole, path: string) => {
    login(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-chocolate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold-400/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-chocolate-500/[0.06] rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-chocolate-950 font-bold font-display text-2xl mx-auto mb-5 shadow-xl shadow-gold-400/20 rotate-3"
          >
            CR
          </motion.div>
          <h1 className="font-display text-3xl text-chocolate-50 tracking-wide">The Chocolate Room</h1>
          <p className="text-chocolate-500 text-sm mt-1.5 tracking-wider uppercase">Tirupur</p>
        </div>

        {/* Role cards */}
        <div className="glass rounded-2xl p-6">
          <p className="text-center text-chocolate-400 text-xs font-medium uppercase tracking-widest mb-5">
            Select a demo role
          </p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r, i) => (
              <motion.button
                key={r.role}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                onClick={() => handleLogin(r.role, r.path)}
                className={`group relative bg-gradient-to-br ${r.gradient} rounded-xl p-4 text-left cursor-pointer ring-1 ${r.ring} hover:ring-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="text-white/80 mb-2.5">{r.icon}</div>
                <p className="font-semibold text-white text-sm">{r.label}</p>
                <p className="text-[11px] text-white/60 mt-0.5 leading-snug">{r.desc}</p>
                <ArrowRight size={14} className="absolute bottom-3.5 right-3.5 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all duration-300" />
              </motion.button>
            ))}
          </div>
        </div>

        <p className="text-center text-chocolate-600 text-[11px] mt-6 tracking-wide">
          Demo application — no real authentication required
        </p>
      </motion.div>
    </div>
  );
}
