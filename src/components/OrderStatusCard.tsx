import { motion } from 'framer-motion';
import {
  Check,
  Clock,
  MapPin,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
// Clock is used for estimated time display

import type { Order, OrderStatus, OrderType } from '../types/order.types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

interface Step {
  label: string;
  status: 'completed' | 'active' | 'pending';
}

const DINE_IN_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];
const DELIVERY_STEPS: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'out-for-delivery',
  'delivered',
];
const TAKEAWAY_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready'];

const STEP_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
};

function getSteps(order: Order): Step[] {
  let statuses: OrderStatus[];
  if (order.type === 'delivery') statuses = DELIVERY_STEPS;
  else if (order.type === 'takeaway') statuses = TAKEAWAY_STEPS;
  else statuses = DINE_IN_STEPS;

  const currentIdx = statuses.indexOf(order.status);

  return statuses.map((s, i) => ({
    label: STEP_LABELS[s],
    status: i < currentIdx ? 'completed' : i === currentIdx ? 'active' : 'pending',
  }));
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
}

const typeMeta: Record<OrderType, { label: string; icon: React.ReactNode }> = {
  'dine-in': { label: 'Dine-in', icon: <UtensilsCrossed size={12} /> },
  delivery: { label: 'Delivery', icon: <Truck size={12} /> },
  takeaway: { label: 'Takeaway', icon: <ShoppingBag size={12} /> },
};

const statusBadgeClass: Record<OrderStatus, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  preparing: 'badge-preparing',
  ready: 'badge-ready',
  served: 'badge-served',
  'out-for-delivery': 'badge-confirmed',
  delivered: 'badge-ready',
  cancelled: 'badge-cancelled',
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatusTimeline({ steps }: { steps: Step[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex gap-3"
          >
            {/* Dot + Line column */}
            <div className="flex flex-col items-center">
              {/* Dot / Check */}
              {step.status === 'completed' ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check size={12} className="text-emerald-400" />
                </div>
              ) : step.status === 'active' ? (
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute h-5 w-5 rounded-full bg-gold-400/25 animate-ping" />
                  <span className="relative h-3 w-3 rounded-full bg-gold-400" />
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-chocolate-600" />
                </div>
              )}

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[20px] ${
                    step.status === 'completed'
                      ? 'bg-emerald-500/40'
                      : 'bg-chocolate-700/60'
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <p
              className={`pb-4 text-sm leading-5 ${
                step.status === 'completed'
                  ? 'text-emerald-400'
                  : step.status === 'active'
                    ? 'font-semibold text-gold-300'
                    : 'text-chocolate-500'
              }`}
            >
              {step.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface OrderStatusCardProps {
  order: Order;
}

export default function OrderStatusCard({ order }: OrderStatusCardProps) {
  const steps = getSteps(order);
  const { date, time } = formatDateTime(order.createdAt);
  const type = typeMeta[order.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass rounded-xl p-5"
    >
      {/* ---- Header ---- */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-cream">
            Order <span className="text-gold-300">#{order.id}</span>
          </h3>
          <p className="mt-0.5 text-xs text-chocolate-400">
            {date} &middot; {time}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Order type */}
          <span className="badge bg-chocolate-700/50 text-chocolate-200">
            {type.icon}
            {type.label}
          </span>
          {/* Status */}
          <span className={`badge ${statusBadgeClass[order.status]}`}>
            {STEP_LABELS[order.status] ?? order.status}
          </span>
        </div>
      </div>

      {order.type === 'dine-in' && order.tableNumber != null && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-chocolate-300">
          <MapPin size={12} /> Table {order.tableNumber}
        </p>
      )}

      <div className="divider my-4" />

      {/* ---- Timeline ---- */}
      {order.status !== 'cancelled' && <StatusTimeline steps={steps} />}

      {order.status === 'cancelled' && (
        <p className="my-2 text-sm font-medium text-red-400">This order has been cancelled.</p>
      )}

      {order.estimatedTime != null && order.status !== 'served' && order.status !== 'delivered' && order.status !== 'cancelled' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-chocolate-300">
          <Clock size={13} className="text-gold-400/60" />
          <span>Estimated time: ~{order.estimatedTime} min</span>
        </div>
      )}
    </motion.div>
  );
}
