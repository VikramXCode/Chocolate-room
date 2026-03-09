import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
}

const config = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-600/90',
    border: 'border-emerald-400/30',
    iconColor: 'text-emerald-200',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-600/90',
    border: 'border-red-400/30',
    iconColor: 'text-red-200',
  },
  info: {
    icon: Info,
    bg: 'bg-gold-500/90',
    border: 'border-gold-300/30',
    iconColor: 'text-gold-100',
  },
} as const;

export default function NotificationToast({
  message,
  type = 'info',
  visible,
  onClose,
}: NotificationToastProps) {
  const { icon: Icon, bg, border, iconColor } = config[type];

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className={`fixed left-1/2 top-4 z-[60] -translate-x-1/2
            flex max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3
            shadow-xl backdrop-blur-md ${bg} ${border}`}
          role="alert"
        >
          <Icon size={18} className={`shrink-0 ${iconColor}`} />

          <span className="text-sm font-medium text-white">{message}</span>

          <button
            onClick={onClose}
            className="ml-2 shrink-0 rounded-full p-0.5 text-white/60
              transition-colors hover:text-white"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
