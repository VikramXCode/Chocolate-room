import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Loader2 } from 'lucide-react';
import { callWaiter } from '../lib/api';

interface CallWaiterButtonProps {
  tableNumber: number;
  onCalled?: () => void;
}

export default function CallWaiterButton({ tableNumber, onCalled }: CallWaiterButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (status !== 'idle') return;
    setStatus('loading');

    try {
      await callWaiter(tableNumber);
      setStatus('success');
      onCalled?.();
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('idle');
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={status === 'loading'}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center
        rounded-full glass-solid ring-2 ring-gold-400/40 shadow-lg
        transition-colors hover:ring-gold-400/70
        ${status === 'idle' ? 'pulse-gold' : ''}
        ${status === 'success' ? 'ring-emerald-400/60' : ''}
        disabled:cursor-wait sm:h-16 sm:w-16`}
      aria-label="Call waiter"
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.span
            key="bell"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Bell size={24} className="text-gold-400" />
          </motion.span>
        )}

        {status === 'loading' && (
          <motion.span
            key="loader"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 size={24} className="animate-spin text-gold-300" />
          </motion.span>
        )}

        {status === 'success' && (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={24} className="text-emerald-400" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* "Waiter notified!" tooltip after success */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-emerald-600/90
              px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm"
          >
            Waiter notified!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
