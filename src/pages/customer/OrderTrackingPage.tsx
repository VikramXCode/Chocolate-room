import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  Phone,
  Mail,
  ChevronRight,
  ShoppingBag,
  Clock,
} from 'lucide-react';

import { useOrderStore } from '../../state/orderStore';
import OrderStatusCard from '../../components/OrderStatusCard';
import type { Order, OrderStatus } from '../../types/order.types';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Status badge helper                                                */
/* ------------------------------------------------------------------ */

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

const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

/* ------------------------------------------------------------------ */
/*  Date formatter                                                     */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ------------------------------------------------------------------ */
/*  Compact Past-Order Card                                            */
/* ------------------------------------------------------------------ */

function PastOrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.div variants={staggerItem}>
      <Link
        to={`/app/orders/${order.id}`}
        className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 group hover:ring-1 hover:ring-gold-400/20 transition-all"
      >
        {/* Left: order info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-chocolate-100 truncate">
              Order #{order.id}
            </h3>
            <span className={`${statusBadgeClass[order.status]} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
              {statusLabel[order.status]}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-chocolate-400">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Right: summary */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right space-y-0.5">
            <p className="text-xs text-chocolate-400">
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </p>
            <p className="text-sm font-semibold text-gold-400">
              ₹{order.total.toLocaleString('en-IN')}
            </p>
          </div>

          <ChevronRight
            size={18}
            className="text-chocolate-500 group-hover:text-gold-400 transition-colors shrink-0"
          />
        </div>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function Skeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl p-5 animate-pulse flex items-center gap-4"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-chocolate-700/60" />
            <div className="h-3 w-48 rounded bg-chocolate-700/40" />
          </div>
          <div className="h-4 w-16 rounded bg-chocolate-700/40" />
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { orders, activeOrder, loading, loadOrders } = useOrderStore();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ── CASE 1: Single Order View ─────────────────────────────────── */
  if (orderId) {
    const order = orders.find((o) => o.id === orderId);

    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-espresso pt-24 px-4">
          <div className="max-w-2xl mx-auto">
            <Skeleton />
          </div>
        </div>
      );
    }

    // Not found
    if (!order) {
      return (
        <div className="min-h-screen bg-espresso pt-24 px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-chocolate-800/60 flex items-center justify-center">
                <Package size={28} className="text-chocolate-500" />
              </div>
              <h2 className="text-xl font-display text-chocolate-100">
                Order not found
              </h2>
              <p className="text-sm text-chocolate-400">
                We couldn't find an order with ID{' '}
                <span className="text-chocolate-200 font-medium">#{orderId}</span>.
              </p>
              <Link
                to="/app/orders"
                className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to All Orders
              </Link>
            </motion.div>
          </div>
        </div>
      );
    }

    // Found — render detail
    return (
      <div className="min-h-screen bg-espresso pt-24 px-4 pb-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back link */}
          <motion.div {...fadeUp}>
            <Link
              to="/app/orders"
              className="inline-flex items-center gap-1.5 text-sm text-chocolate-400 hover:text-gold-400 transition-colors"
            >
              <ArrowLeft size={16} />
              All Orders
            </Link>
          </motion.div>

          {/* Order status card */}
          <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
            <OrderStatusCard order={order} />
          </motion.div>

          {/* Need help section */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
            <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-semibold text-chocolate-100">
                Need Help?
              </h3>
              <p className="text-xs text-chocolate-400">
                Have an issue with your order? Reach out to us.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-sm text-chocolate-200 hover:text-gold-400 transition-colors"
                >
                  <Phone size={14} className="text-gold-400/70" />
                  +91 98765 43210
                </a>
                <span className="hidden sm:inline text-chocolate-700">|</span>
                <a
                  href="mailto:support@chocolateroom.in"
                  className="flex items-center gap-2 text-sm text-chocolate-200 hover:text-gold-400 transition-colors"
                >
                  <Mail size={14} className="text-gold-400/70" />
                  support@chocolateroom.in
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── CASE 2: All Orders List ───────────────────────────────────── */

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const pastOrders = activeOrder
    ? sortedOrders.filter((o) => o.id !== activeOrder.id)
    : sortedOrders;

  return (
    <div className="min-h-screen bg-espresso pt-24 px-4 pb-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page header */}
        <motion.div {...fadeUp} className="text-center">
          <h1 className="font-display text-3xl md:text-4xl text-gradient mb-2">
            Your Orders
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent mx-auto" />
        </motion.div>

        {/* Loading */}
        {loading && <Skeleton />}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 space-y-5"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-chocolate-800/60 flex items-center justify-center">
              <Package size={36} className="text-chocolate-500" />
            </div>
            <h2 className="text-lg font-display text-chocolate-200">
              No orders yet
            </h2>
            <p className="text-sm text-chocolate-400 max-w-xs mx-auto">
              Looks like you haven't placed any orders. Explore our menu and
              treat yourself!
            </p>
            <button
              onClick={() => navigate('/app/menu')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-400 text-chocolate-950 text-sm font-semibold hover:bg-gold-300 transition-colors"
            >
              <ShoppingBag size={16} />
              Browse Menu
            </button>
          </motion.div>
        )}

        {/* Active order */}
        {!loading && activeOrder && (
          <motion.section {...fadeUp} transition={{ delay: 0.05 }} className="space-y-3">
            <h2 className="text-xs font-semibold text-chocolate-400 uppercase tracking-widest">
              Current Order
            </h2>
            <Link to={`/app/orders/${activeOrder.id}`} className="block">
              <OrderStatusCard order={activeOrder} />
            </Link>
          </motion.section>
        )}

        {/* Divider between current and past */}
        {!loading && activeOrder && pastOrders.length > 0 && (
          <div className="divider" />
        )}

        {/* Past orders */}
        {!loading && pastOrders.length > 0 && (
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <h2 className="text-xs font-semibold text-chocolate-400 uppercase tracking-widest">
              {activeOrder ? 'Past Orders' : 'All Orders'}
            </h2>
            <div className="space-y-3">
              {pastOrders.map((order) => (
                <PastOrderCard key={order.id} order={order} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
