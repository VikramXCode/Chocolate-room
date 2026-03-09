import { motion } from 'framer-motion';
import { useAppData } from '../../../context/AppDataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function WaiterMenu() {
  const { menuItems, setMenuItems } = useAppData();

  const availableCount = menuItems.filter((m) => m.available).length;

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)),
    );
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div {...fadeUp}>
        <h2 className="text-lg font-display text-chocolate-100">Menu Availability</h2>
        <p className="text-sm text-chocolate-500 mt-1">
          {availableCount} of {menuItems.length} items available
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {/* Summary stat */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="flex gap-4">
        <div className="glass rounded-2xl p-4 ring-1 ring-emerald-500/20 flex-1 text-center">
          <p className="text-xl font-bold text-emerald-400">{availableCount}</p>
          <p className="text-[11px] text-chocolate-500 mt-0.5">Available</p>
        </div>
        <div className="glass rounded-2xl p-4 ring-1 ring-red-500/20 flex-1 text-center">
          <p className="text-xl font-bold text-red-400">{menuItems.length - availableCount}</p>
          <p className="text-[11px] text-chocolate-500 mt-0.5">Unavailable</p>
        </div>
        <div className="glass rounded-2xl p-4 ring-1 ring-chocolate-800/30 flex-1 text-center">
          <p className="text-xl font-bold text-chocolate-100">{menuItems.length}</p>
          <p className="text-[11px] text-chocolate-500 mt-0.5">Total Items</p>
        </div>
      </motion.div>

      {/* Menu items */}
      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.id}
            {...fadeUp}
            transition={{ delay: 0.15 + i * 0.03 }}
            className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-gold-400/15 transition-all duration-500"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-chocolate-800/40"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-chocolate-100 truncate">{item.name}</p>
              <p className="text-[11px] text-chocolate-500 mt-0.5">
                {item.category}
                <span className="mx-1.5 opacity-40">•</span>
                ₹{item.price}
              </p>
            </div>

            <button
              onClick={() => toggleAvailability(item.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold ring-1 active:scale-[0.97] transition-all duration-300 ${
                item.available
                  ? 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20 hover:bg-emerald-500/25'
                  : 'bg-red-500/15 text-red-400 ring-red-500/20 hover:bg-red-500/25'
              }`}
            >
              {item.available ? 'Available' : 'Unavailable'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
