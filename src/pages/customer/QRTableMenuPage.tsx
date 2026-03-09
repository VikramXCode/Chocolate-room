import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  X,
  Minus,
  Plus,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

import { useMenuStore } from '../../state/menuStore';
import { useCartStore } from '../../state/cartStore';
import { useOrderStore } from '../../state/orderStore';
import { useUserStore } from '../../state/userStore';
import { fetchTableById, type TableInfo } from '../../lib/api';
import type { MenuItem } from '../../types/menu.types';

import TableInfoBanner from '../../components/TableInfoBanner';
import CallWaiterButton from '../../components/CallWaiterButton';
import CategoryFilter from '../../components/CategoryFilter';
import MenuCard from '../../components/MenuCard';
import ItemDetailModal from '../../components/ItemDetailModal';
import NotificationToast from '../../components/NotificationToast';

/* ------------------------------------------------------------------ */
/*  QRTableMenuPage — standalone mobile-first ordering via QR scan    */
/*  Route: /table/:tableId                                            */
/* ------------------------------------------------------------------ */

export default function QRTableMenuPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();

  /* ---- stores ---- */
  const {
    loading: menuLoading,
    loadMenu,
    filteredItems,
    categories,
    selectedCategory,
    setCategory,
    setSearch,
    searchQuery,
    clearFilters,
  } = useMenuStore();

  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
  } = useCartStore();

  const placeOrder = useOrderStore((s) => s.placeOrder);
  const { setTableNumber, profile } = useUserStore();

  /* ---- local state ---- */
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState(false);

  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  }>({ message: '', type: 'info', visible: false });

  /* ---- helpers ---- */
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ message, type, visible: true });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, visible: false }));
  }, []);

  /* ---- on mount: fetch table + menu ---- */
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setTableLoading(true);
      setTableError(false);

      try {
        const info = await fetchTableById(tableId ?? '');
        if (cancelled) return;

        if (!info) {
          setTableError(true);
          setTableLoading(false);
          return;
        }

        setTableInfo(info);
        setTableNumber(info.number);
        setTableLoading(false);
      } catch {
        if (!cancelled) {
          setTableError(true);
          setTableLoading(false);
        }
      }
    }

    init();
    loadMenu();
    clearFilters();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId]);

  /* ---- place order ---- */
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || placingOrder) return;
    setPlacingOrder(true);

    try {
      const order = await placeOrder({
        items: cartItems,
        customerName: profile.name || `Table ${tableInfo?.number}`,
        customerPhone: profile.phone || '',
        type: 'dine-in',
        tableNumber: tableInfo?.number,
        paymentMethod: 'cash',
      });

      clearCart();
      setShowCart(false);
      showToast('Order placed! Your food will be served shortly.', 'success');

      setTimeout(() => {
        navigate(`/app/orders/${order.id}`);
      }, 1500);
    } catch {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ---- derived ---- */
  const menuItems = filteredItems();
  const allCategories = categories();
  const cartCount = itemCount();
  const cartTotal = total();
  const cartSubtotal = subtotal();
  const cartTax = tax();

  /* ================================================================ */
  /*  LOADING STATE                                                   */
  /* ================================================================ */
  if (tableLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chocolate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 size={36} className="animate-spin text-gold-400" />
          <p className="text-sm text-chocolate-300">Loading table info…</p>
        </motion.div>
      </div>
    );
  }

  /* ================================================================ */
  /*  ERROR STATE — table not found                                   */
  /* ================================================================ */
  if (tableError || !tableInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chocolate-950 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 text-center max-w-sm w-full"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-cream mb-2">
            Table Not Found
          </h2>
          <p className="text-sm text-chocolate-300 mb-6">
            We couldn't find a table with that ID. Please scan the QR code again
            or ask a staff member for assistance.
          </p>
          <button
            onClick={() => navigate('/app/menu')}
            className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-2.5
              text-sm font-semibold text-chocolate-950 shadow-lg shadow-gold-400/20
              transition-colors hover:bg-gold-300 active:bg-gold-500"
          >
            Go to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  /* ================================================================ */
  /*  MAIN RENDER                                                     */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-chocolate-950 pb-24">
      {/* ── Toast ── */}
      <NotificationToast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />

      {/* ── Table Banner ── */}
      <TableInfoBanner tableNumber={tableInfo.number} seats={tableInfo.seats} />

      {/* ── Search Bar ── */}
      <div className="sticky top-14 z-30 px-4 py-3 glass-solid border-b border-chocolate-800/30">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu…"
            className="w-full rounded-xl glass py-2.5 pl-10 pr-4 text-sm text-cream
              placeholder:text-chocolate-500 outline-none
              focus:ring-2 focus:ring-gold-400/30 transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-400
                hover:text-cream transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="px-4 pt-4 pb-2">
        <CategoryFilter
          categories={allCategories}
          selected={selectedCategory}
          onSelect={setCategory}
        />
      </div>

      {/* ── Menu Grid ── */}
      <div className="px-4 pt-2 pb-4">
        {menuLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold-400" />
          </div>
        ) : menuItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-chocolate-400 text-sm">
              No items found. Try a different search or category.
            </p>
            <button
              onClick={clearFilters}
              className="mt-3 text-gold-400 text-sm font-medium underline underline-offset-2
                hover:text-gold-300 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.04 } },
            }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {menuItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onQuickView={setQuickViewItem}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* ── ItemDetailModal ── */}
      <ItemDetailModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
      />

      {/* ── Floating Cart Button ── */}
      <AnimatePresence>
        {cartCount > 0 && !showCart && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCart(true)}
            className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center
              rounded-full bg-gold-400 shadow-xl shadow-gold-400/30
              transition-colors hover:bg-gold-300 active:bg-gold-500 sm:h-16 sm:w-16"
            aria-label="Open cart"
          >
            <ShoppingCart size={22} className="text-chocolate-950" />

            {/* Badge */}
            <span
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center
                rounded-full bg-red-500 text-[11px] font-bold text-white shadow-md"
            >
              {cartCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Call Waiter Button ── */}
      <CallWaiterButton tableNumber={tableInfo.number} />

      {/* ── Cart Bottom Sheet ── */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCart(false)}
            />

            {/* Sheet */}
            <motion.div
              key="cart-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden
                rounded-t-3xl bg-chocolate-900 border-t border-gold-400/15 shadow-2xl"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-chocolate-700" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h3 className="font-display text-lg font-semibold text-cream">
                  Your Order
                </h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full
                    text-chocolate-400 hover:bg-chocolate-800 hover:text-cream transition-colors"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable items */}
              <div className="overflow-y-auto px-5 pb-2" style={{ maxHeight: 'calc(85vh - 240px)' }}>
                {cartItems.map((ci) => (
                  <div
                    key={ci.menuItem.id}
                    className="flex items-center gap-3 py-3 border-b border-chocolate-800/50 last:border-0"
                  >
                    {/* Thumbnail */}
                    <img
                      src={ci.menuItem.image}
                      alt={ci.menuItem.name}
                      className="h-12 w-12 rounded-lg object-cover ring-1 ring-chocolate-800/60 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cream line-clamp-1">
                        {ci.menuItem.name}
                      </p>
                      <p className="text-xs text-chocolate-400">
                        ₹{ci.menuItem.price} × {ci.quantity}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          ci.quantity <= 1
                            ? removeItem(ci.menuItem.id)
                            : updateQuantity(ci.menuItem.id, ci.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg
                          bg-chocolate-800/80 text-chocolate-300 hover:bg-chocolate-700 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-cream">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg
                          bg-gold-400 text-chocolate-950 hover:bg-gold-300 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="shrink-0 text-sm font-bold text-gold-400 w-14 text-right">
                      ₹{ci.menuItem.price * ci.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals + Place Order */}
              <div className="border-t border-chocolate-800/50 px-5 pt-4 pb-6 space-y-3">
                <div className="flex justify-between text-sm text-chocolate-300">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-chocolate-300">
                  <span>Tax (5%)</span>
                  <span>₹{cartTax}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-cream">Total</span>
                  <span className="text-xl font-bold text-gold-400">₹{cartTotal}</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || cartItems.length === 0}
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl
                    bg-gold-400 py-3.5 text-sm font-semibold text-chocolate-950 shadow-lg
                    shadow-gold-400/20 transition-colors hover:bg-gold-300
                    disabled:opacity-60 disabled:cursor-not-allowed active:bg-gold-500"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
