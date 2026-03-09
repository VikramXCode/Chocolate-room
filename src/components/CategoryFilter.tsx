import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  IceCream,
  Cake,
  CakeSlice,
  Sandwich,
  CupSoda,
  Cookie,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
}

const iconMap: Record<string, LucideIcon> = {
  'Hot Chocolate': Coffee,
  'Cold Beverages': IceCream,
  Desserts: CakeSlice,
  Cakes: Cake,
  Snacks: Sandwich,
  Shakes: CupSoda,
  Waffles: Cookie,
  Specials: Sparkles,
};

function getCategoryIcon(category: string) {
  return iconMap[category] ?? LayoutGrid;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const pills: { label: string; value: string | null }[] = [
    { label: 'All', value: null },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div
      className="relative flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory
        md:flex-wrap md:overflow-visible"
      style={{ scrollbarWidth: 'none' }}
    >
      <AnimatePresence mode="popLayout">
        {pills.map(({ label, value }) => {
          const isActive = selected === value;
          const Icon = value ? getCategoryIcon(value) : LayoutGrid;

          return (
            <motion.button
              key={label}
              layout
              onClick={() => onSelect(value)}
              className={`relative snap-start shrink-0 inline-flex items-center gap-1.5
                rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap
                ${
                  isActive
                    ? 'bg-gold-400 text-chocolate-950 shadow-lg shadow-gold-400/20'
                    : 'glass-light text-chocolate-200 hover:text-gold-300 hover:border-gold-400/20'
                }`}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated active background indicator */}
              {isActive && (
                <motion.span
                  layoutId="activePill"
                  className="absolute inset-0 rounded-full bg-gold-400"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon size={15} className={isActive ? 'text-chocolate-950' : ''} />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
