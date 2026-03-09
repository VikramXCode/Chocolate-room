import { motion } from 'framer-motion';
import { TableProperties } from 'lucide-react';

interface TableInfoBannerProps {
  tableNumber: number;
  seats?: number;
}

export default function TableInfoBanner({ tableNumber, seats }: TableInfoBannerProps) {
  return (
    <motion.div
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="sticky top-0 z-40 glass-solid border-b border-gold-400/30"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-400/10">
          <TableProperties size={20} className="text-gold-400" />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-cream sm:text-xl">
            Table {tableNumber}
          </span>

          {seats !== undefined && (
            <span className="text-sm text-chocolate-300">
              · {seats} seat{seats !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
