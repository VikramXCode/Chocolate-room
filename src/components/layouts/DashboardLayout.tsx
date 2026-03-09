import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Star, Settings, Table2, LogOut, Menu, X, ChevronRight, Bell, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(role: UserRole): NavItem[] {
  const base = `/dashboard/${role === 'superadmin' ? 'superadmin' : role}`;
  const common: NavItem[] = [{ to: base, label: 'Dashboard', icon: <LayoutDashboard size={18} /> }];

  if (role === 'waiter') {
    return [
      ...common,
      { to: `${base}/tables`, label: 'My Tables', icon: <Table2 size={18} /> },
      { to: `${base}/orders`, label: 'Active Orders', icon: <ShoppingBag size={18} /> },
      { to: `${base}/menu`, label: 'Menu Status', icon: <Package size={18} /> },
    ];
  }
  if (role === 'admin') {
    return [
      ...common,
      { to: `${base}/products`, label: 'Products', icon: <Package size={18} /> },
      { to: `${base}/orders`, label: 'Orders', icon: <ShoppingBag size={18} /> },
      { to: `${base}/tables`, label: 'Tables', icon: <Table2 size={18} /> },
      { to: `${base}/reviews`, label: 'Reviews', icon: <Star size={18} /> },
    ];
  }
  // superadmin
  return [
    ...common,
    { to: `${base}/users`, label: 'Users', icon: <Users size={18} /> },
    { to: `${base}/settings`, label: 'Settings', icon: <Settings size={18} /> },
    { to: `${base}/analytics`, label: 'Analytics', icon: <BarChart3 size={18} /> },
  ];
}

const roleColor: Record<UserRole, string> = {
  superadmin: 'from-violet-600 to-purple-800',
  admin: 'from-sky-600 to-blue-800',
  waiter: 'from-emerald-600 to-green-800',
  customer: 'from-gold-400 to-gold-600',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = user.role === 'superadmin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Brand */}
      <div className="p-5 border-b border-chocolate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-chocolate-950 font-bold font-display text-sm shadow-lg shadow-gold-400/15">
            CR
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-gold-300 text-sm tracking-wide">The Chocolate Room</p>
            <p className="text-[10px] text-chocolate-500 uppercase tracking-widest font-medium">{roleLabel} Panel</p>
          </div>
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-chocolate-500 hover:text-white transition-colors duration-300">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] text-chocolate-600 uppercase tracking-widest font-semibold px-3 mb-2">Navigation</p>
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                active
                  ? 'bg-gold-400/10 text-gold-400 ring-1 ring-gold-400/15'
                  : 'text-chocolate-400 hover:text-chocolate-100 hover:bg-chocolate-800/40'
              }`}
            >
              <span className={`transition-colors duration-300 ${active ? 'text-gold-400' : 'text-chocolate-600 group-hover:text-chocolate-300'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-gold-400/50" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-chocolate-800/50">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColor[user.role]} flex items-center justify-center text-xs text-white font-semibold shadow-md`}>
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-chocolate-100 truncate font-medium">{user.name}</p>
            <p className="text-[10px] text-chocolate-600 truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-chocolate-500 hover:text-red-400 text-xs transition-colors duration-300 w-full px-1 font-medium">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-chocolate-950 flex font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 glass-solid fixed h-screen">
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-40 glass-solid px-4 md:px-6 py-3 flex items-center justify-between border-b border-chocolate-800/30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-chocolate-400 hover:text-gold-400 transition-colors duration-300">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-chocolate-200">{roleLabel} Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-chocolate-500 hover:text-gold-400 transition-colors duration-300 p-2 rounded-xl hover:bg-chocolate-800/40">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-400 rounded-full ring-2 ring-chocolate-950" />
            </button>
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${roleColor[user.role]} flex items-center justify-center text-[10px] text-white font-semibold shadow-md`}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'tween', duration: 0.25 }} className="lg:hidden fixed left-0 top-0 h-full w-60 bg-chocolate-900 border-r border-chocolate-800/50 z-50 flex flex-col">
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
