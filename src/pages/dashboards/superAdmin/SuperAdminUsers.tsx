import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Edit3, Trash2, Shield, UserCog, ConciergeBell } from 'lucide-react';
import { mockUsers } from '../../../data/mockData';
import type { User, UserRole } from '../../../types';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const roleIcons: Record<UserRole, React.ReactNode> = {
  superadmin: <Shield size={14} />,
  admin: <UserCog size={14} />,
  waiter: <ConciergeBell size={14} />,
  customer: null,
};

const roleColors: Record<UserRole, string> = {
  superadmin: 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-400/20',
  admin: 'bg-sky-500/10 text-sky-400 ring-1 ring-sky-400/20',
  waiter: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20',
  customer: 'bg-chocolate-700/30 text-chocolate-400 ring-1 ring-chocolate-400/20',
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'waiter' as UserRole });

  const addUser = () => {
    if (!form.name || !form.email) return;
    setUsers((prev) => [...prev, { id: `u${Date.now()}`, ...form }]);
    setForm({ name: '', email: '', role: 'waiter' });
    setShowForm(false);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div>
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">User Management</h2>
            <span className="text-[11px] font-medium text-chocolate-500 bg-chocolate-800/60 px-2.5 py-0.5 rounded-full ring-1 ring-chocolate-700/30">
              {users.length} users
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold-400 text-chocolate-950 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-gold-300 active:scale-[0.97] transition-all duration-300"
        >
          <UserPlus size={16} /> Add User
        </button>
      </motion.div>

      {showForm && (
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="glass rounded-2xl p-5 mb-6 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-xs font-semibold text-chocolate-400 uppercase tracking-widest mb-4">New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 block">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-chocolate-900/60 border border-chocolate-800/50 rounded-xl text-chocolate-100 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-chocolate-900/60 border border-chocolate-800/50 rounded-xl text-chocolate-100 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 block">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                className="w-full px-3 py-2.5 bg-chocolate-900/60 border border-chocolate-800/50 rounded-xl text-chocolate-100 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300"
              >
                <option value="admin">Admin</option>
                <option value="waiter">Waiter</option>
              </select>
            </div>
            <button
              onClick={addUser}
              className="bg-gold-400 text-chocolate-950 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-300 active:scale-[0.97] transition-all duration-300"
            >
              Create
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {users.map((user, i) => (
          <motion.div
            key={user.id}
            {...fadeUp}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="group glass rounded-2xl p-4 flex items-center gap-4 hover:border-gold-400/15 ring-1 ring-transparent hover:ring-gold-400/10 transition-all duration-500"
          >
            <div className="w-10 h-10 rounded-full bg-chocolate-800/80 flex items-center justify-center text-sm text-gold-300 font-semibold flex-shrink-0 ring-1 ring-chocolate-700/30">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-chocolate-100">{user.name}</p>
              <p className="text-[11px] text-chocolate-500">{user.email}</p>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${roleColors[user.role]}`}>
              {roleIcons[user.role]}
              {user.role}
            </span>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-chocolate-800/50 text-chocolate-400 hover:text-gold-400 active:scale-[0.97] transition-all duration-300">
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="p-2 rounded-xl bg-chocolate-800/50 text-chocolate-400 hover:text-red-400 active:scale-[0.97] transition-all duration-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
