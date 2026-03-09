import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, QrCode } from 'lucide-react';
import { useAppData } from '../../../context/AppDataContext';
import { mockUsers } from '../../../data/mockData';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const waiters = mockUsers.filter((u) => u.role === 'waiter');

const statusRing: Record<string, string> = {
  available: 'ring-emerald-500/25',
  occupied: 'ring-amber-500/25',
  reserved: 'ring-sky-500/25',
};

export default function AdminTables() {
  const { tables, setTables } = useAppData();
  const [showAdd, setShowAdd] = useState(false);
  const [newTable, setNewTable] = useState({ seats: 4 });

  const addTable = () => {
    const maxNumber = Math.max(...tables.map((t) => t.number), 0);
    setTables((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        number: maxNumber + 1,
        seats: newTable.seats,
        status: 'available' as const,
      },
    ]);
    setShowAdd(false);
    setNewTable({ seats: 4 });
  };

  const assignWaiter = (tableId: string, waiterId: string) => {
    setTables((prev) => prev.map((t) => t.id === tableId ? { ...t, assignedWaiter: waiterId || undefined } : t));
  };

  return (
    <div>
      {/* Page header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Floor Plan</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-2xl font-display text-chocolate-100">Table Management</p>
            <span className="text-[11px] font-semibold text-gold-400 bg-gold-400/10 px-2.5 py-0.5 rounded-full">{tables.length} tables</span>
          </div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-gold-400 text-chocolate-950 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-gold-300 active:scale-[0.97] transition-all duration-300"
        >
          <Plus size={16} /> Add Table
        </button>
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-5 mb-6 flex items-end gap-4 hover:border-gold-400/15 transition-all duration-500"
          >
            <div>
              <label className="text-[11px] text-chocolate-500 uppercase tracking-wider mb-1.5 block">Seats</label>
              <input
                type="number"
                value={newTable.seats}
                onChange={(e) => setNewTable({ seats: Number(e.target.value) })}
                className="w-24 px-3 py-2 rounded-xl bg-chocolate-900/60 border border-chocolate-800/50 text-chocolate-100 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300"
              />
            </div>
            <button
              onClick={addTable}
              className="bg-gold-400 text-chocolate-950 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gold-300 active:scale-[0.97] transition-all duration-300"
            >
              Create
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables.map((table, i) => (
          <motion.div
            key={table.id}
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className={`group glass rounded-2xl p-4 ring-1 ${statusRing[table.status] || 'ring-chocolate-800/50'} hover:border-gold-400/15 transition-all duration-500`}
          >
            <div className="text-center mb-3">
              <p className="text-2xl font-bold text-chocolate-100">{table.number}</p>
              <p className="text-[11px] text-chocolate-500 mt-0.5">{table.seats} seats</p>
              <span className={`inline-block mt-1.5 badge badge-${
                table.status === 'available' ? 'ready' :
                table.status === 'occupied' ? 'pending' :
                'confirmed'
              } capitalize`}>{table.status}</span>
            </div>

            <div className="mb-3">
              <label className="text-[11px] text-chocolate-600 block mb-1">Waiter</label>
              <select
                value={table.assignedWaiter || ''}
                onChange={(e) => assignWaiter(table.id, e.target.value)}
                className="w-full bg-chocolate-900/60 border border-chocolate-800/50 text-chocolate-300 text-[11px] rounded-xl px-2 py-1.5 focus:outline-none focus:border-gold-400/30 transition-colors duration-300"
              >
                <option value="">Unassigned</option>
                {waiters.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 text-chocolate-500 text-[11px] py-1.5 rounded-xl hover:text-gold-400 hover:bg-gold-400/5 active:scale-[0.97] transition-all duration-300">
              <QrCode size={13} /> QR Code
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
