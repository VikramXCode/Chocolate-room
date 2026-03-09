import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAppData } from '../../../context/AppDataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const ringMap: Record<string, string> = {
  available: 'ring-emerald-500/20',
  occupied: 'ring-amber-500/20',
  reserved: 'ring-sky-500/20',
};

const badgeMap: Record<string, string> = {
  available: 'bg-emerald-500/15 text-emerald-400',
  occupied: 'bg-amber-500/15 text-amber-400',
  reserved: 'bg-sky-500/15 text-sky-400',
};

export default function WaiterTables() {
  const { user } = useAuth();
  const { tables } = useAppData();
  const myTables = tables.filter((t) => t.assignedWaiter === user?.id);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div {...fadeUp}>
        <h2 className="text-lg font-display text-chocolate-100">My Tables</h2>
        <p className="text-sm text-chocolate-500 mt-1">
          {myTables.length} table{myTables.length !== 1 && 's'} assigned to you
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {/* Table grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {myTables.map((table, i) => (
          <motion.div
            key={table.id}
            {...fadeUp}
            transition={{ delay: i * 0.06 }}
            className={`group glass rounded-2xl p-5 text-center ring-1 ${ringMap[table.status] ?? 'ring-chocolate-800/30'} hover:border-gold-400/15 transition-all duration-500`}
          >
            <p className="text-3xl font-bold text-chocolate-100 mb-1">{table.number}</p>

            <div className="flex items-center justify-center gap-1 text-chocolate-500 mb-3">
              <Users size={13} className="opacity-70" />
              <span className="text-[11px]">{table.seats} seats</span>
            </div>

            <span
              className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeMap[table.status] ?? 'bg-chocolate-700/40 text-chocolate-400'}`}
            >
              {table.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
