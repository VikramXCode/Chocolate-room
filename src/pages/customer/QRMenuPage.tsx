import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  ArrowRight,
  Loader2,
  ChevronDown,
  Leaf,
  Star,
} from 'lucide-react';
import { useCartStore } from '../../state/cartStore';
import { useOrderStore } from '../../state/orderStore';
import { useUserStore } from '../../state/userStore';
import type { MenuItem, MenuCategory } from '../../types/menu.types';
import menuData from '../../data/menu.json';

/* ── localStorage keys ───────────────────────────────────────────── */
const LS_TABLE = 'qr_table';
const LS_CART = 'qr_cart';
const LS_SESSION = 'qr_session';

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ── category order ──────────────────────────────────────────────── */
const CATEGORY_ORDER: MenuCategory[] = [
  'Hot Chocolate',
  'Cold Beverages',
  'Shakes',
  'Cakes',
  'Desserts',
  'Waffles',
  'Snacks',
  'Specials',
];

/* ── animations ──────────────────────────────────────────────────── */
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/* ================================================================ */
/*  QRMenuPage  –  /qr-menu?table=5                                 */
/* ================================================================ */
export default function QRMenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableParam = searchParams.get('table');

  /* ── stores ── */
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
  const setTableNumber = useUserStore((s) => s.setTableNumber);

  /* ── local state ── */
  const [tableNumber, setTable] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_ORDER[0]);
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ── menu data ── */
  const allItems = useMemo(() => (menuData as MenuItem[]).filter((i) => i.available), []);
  const categories = useMemo(() => {
    const present = new Set(allItems.map((i) => i.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [allItems]);

  const groupedItems = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const cat of categories) {
      map[cat] = allItems.filter((i) => i.category === cat);
    }
    return map;
  }, [allItems, categories]);

  /* ── init: table + session + restore cart ── */
  useEffect(() => {
    // Table number
    const tNum = tableParam ? parseInt(tableParam, 10) : null;
    const stored = localStorage.getItem(LS_TABLE);
    const resolved = tNum ?? (stored ? parseInt(stored, 10) : null);

    if (resolved && !isNaN(resolved)) {
      setTable(resolved);
      setTableNumber(resolved);
      localStorage.setItem(LS_TABLE, String(resolved));
    }

    // Session id
    let sid = localStorage.getItem(LS_SESSION);
    if (!sid) {
      sid = generateSessionId();
      localStorage.setItem(LS_SESSION, sid);
    }
    setSessionId(sid);

    // Restore cart from localStorage
    try {
      const savedCart = localStorage.getItem(LS_CART);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0 && cartItems.length === 0) {
          for (const ci of parsed) {
            if (ci.menuItem && ci.quantity) {
              for (let n = 0; n < ci.quantity; n++) {
                addItem(ci.menuItem);
              }
            }
          }
        }
      }
    } catch { /* ignore corrupt data */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── persist cart to localStorage ── */
  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(cartItems));
  }, [cartItems]);

  /* ── scroll spy: track which category section is in view ── */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      let current = categories[0];

      for (const cat of categories) {
        const el = sectionRefs.current[cat];
        if (el && el.offsetTop - 140 <= scrollTop) {
          current = cat;
        }
      }
      setActiveCategory(current);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categories]);

  /* ── auto-scroll category pill into view ── */
  useEffect(() => {
    const bar = categoryBarRef.current;
    if (!bar) return;
    const activeBtn = bar.querySelector(`[data-cat="${activeCategory}"]`) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeCategory]);

  /* ── scroll to category ── */
  const scrollToCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
    const el = sectionRefs.current[cat];
    if (el && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: el.offsetTop - 130,
        behavior: 'smooth',
      });
    }
  }, []);

  /* ── cart helpers ── */
  const getQty = useCallback(
    (id: string) => cartItems.find((c) => c.menuItem.id === id)?.quantity ?? 0,
    [cartItems],
  );

  const handleAdd = useCallback((item: MenuItem) => addItem(item), [addItem]);

  const handleDecrease = useCallback(
    (id: string) => {
      const ci = cartItems.find((c) => c.menuItem.id === id);
      if (!ci) return;
      if (ci.quantity <= 1) removeItem(id);
      else updateQuantity(id, ci.quantity - 1);
    },
    [cartItems, removeItem, updateQuantity],
  );

  /* ── place order ── */
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || placingOrder) return;
    setPlacingOrder(true);
    try {
      const order = await placeOrder({
        items: cartItems,
        customerName: `Table ${tableNumber ?? '?'}`,
        customerPhone: '',
        type: 'dine-in',
        tableNumber: tableNumber ?? undefined,
        paymentMethod: 'cash',
      });
      clearCart();
      localStorage.removeItem(LS_CART);
      setShowCart(false);
      setOrderSuccess(true);
      setTimeout(() => navigate(`/app/orders/${order.id}`), 2000);
    } catch {
      // stay open so user can retry
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ── derived ── */
  const count = itemCount();
  const cartTotalVal = total();

  /* ================================================================ */
  /*  ORDER SUCCESS SCREEN                                            */
  /* ================================================================ */
  if (orderSuccess) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-chocolate-950 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="font-display text-2xl text-cream">Order Placed!</h2>
          <p className="mt-2 text-sm text-chocolate-300">
            Your food is being prepared. Sit back and relax!
          </p>
          <Loader2 size={18} className="mx-auto mt-6 animate-spin text-gold-400" />
        </motion.div>
      </div>
    );
  }

  /* ================================================================ */
  /*  MAIN RENDER                                                     */
  /* ================================================================ */
  return (
    <div className="flex min-h-[100dvh] flex-col bg-chocolate-950">
      {/* ─── STICKY HEADER ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-chocolate-950/95 backdrop-blur-md border-b border-gold-400/10">
        {/* Table banner */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-display text-lg text-cream leading-tight">
              The Chocolate Room
            </h1>
            {tableNumber && (
              <p className="text-xs text-gold-400 font-medium mt-0.5">
                Ordering for Table {tableNumber}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <span className="text-xs text-chocolate-300 font-medium">
                ₹{cartTotalVal}
              </span>
            )}
          </div>
        </div>

        {/* Category scroll bar */}
        <div
          ref={categoryBarRef}
          className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              data-cat={cat}
              onClick={() => scrollToCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                activeCategory === cat
                  ? 'bg-gold-400 text-chocolate-950 shadow-md shadow-gold-400/20'
                  : 'bg-chocolate-900 text-chocolate-300 border border-chocolate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ─── SCROLLABLE MENU ───────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: count > 0 ? '5.5rem' : '2rem' }}
      >
        {categories.map((cat) => (
          <section
            key={cat}
            ref={(el) => { sectionRefs.current[cat] = el; }}
            className="px-4 pt-5"
          >
            {/* Section title */}
            <h2 className="font-display text-base text-gold-300/90 mb-3">
              {cat}
              <span className="ml-2 text-xs text-chocolate-500 font-sans font-normal">
                {groupedItems[cat].length} items
              </span>
            </h2>

            {/* Item rows */}
            <div className="space-y-2">
              {groupedItems[cat].map((item) => {
                const qty = getQty(item.id);
                return (
                  <motion.div
                    key={item.id}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-20px' }}
                    className="flex items-center gap-3 rounded-xl bg-chocolate-900/60 border border-chocolate-800/40 p-3 active:bg-chocolate-900"
                  >
                    {/* Thumbnail */}
                    <button
                      onClick={() => setDetailItem(item)}
                      className="shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-16 w-16 rounded-lg object-cover ring-1 ring-chocolate-800/50"
                      />
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => setDetailItem(item)}
                        className="text-left w-full"
                      >
                        <div className="flex items-center gap-1.5">
                          {item.veg && (
                            <Leaf size={11} className="shrink-0 text-emerald-400" />
                          )}
                          <span className="text-sm font-medium text-cream line-clamp-1">
                            {item.name}
                          </span>
                          {item.popular && (
                            <Star size={10} className="shrink-0 fill-gold-400 text-gold-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-chocolate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </button>
                      <p className="text-sm font-bold text-gold-400 mt-1">₹{item.price}</p>
                    </div>

                    {/* Qty / Add */}
                    <div className="shrink-0">
                      {qty === 0 ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdd(item)}
                          className="rounded-lg bg-gold-400 px-5 py-2 text-xs font-bold text-chocolate-950 shadow-md shadow-gold-400/15 active:bg-gold-300"
                        >
                          ADD
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDecrease(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-chocolate-800 text-chocolate-300 active:bg-chocolate-700"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-cream">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleAdd(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-chocolate-950 active:bg-gold-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ─── FLOATING CART BAR ─────────────────────────────────── */}
      <AnimatePresence>
        {count > 0 && !showCart && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2"
          >
            <button
              onClick={() => setShowCart(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-gold-400 px-5 py-4 shadow-xl shadow-gold-400/25 active:bg-gold-300"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={18} className="text-chocolate-950" />
                <span className="text-sm font-bold text-chocolate-950">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-chocolate-950">
                  ₹{cartTotalVal}
                </span>
                <ArrowRight size={16} className="text-chocolate-950" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ITEM DETAIL MODAL ─────────────────────────────────── */}
      <AnimatePresence>
        {detailItem && (
          <>
            <motion.div
              key="detail-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailItem(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              key="detail-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-hidden rounded-t-3xl bg-chocolate-900 border-t border-gold-400/15"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={detailItem.image}
                  alt={detailItem.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900 via-transparent to-transparent" />
                <button
                  onClick={() => setDetailItem(null)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-6 -mt-6 relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {detailItem.veg && <Leaf size={13} className="text-emerald-400" />}
                      {detailItem.popular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-bold text-gold-400">
                          <Star size={9} className="fill-gold-400" /> Popular
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl text-cream">{detailItem.name}</h3>
                  </div>
                  <p className="text-xl font-bold text-gold-400 shrink-0 pt-5">₹{detailItem.price}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-chocolate-300">
                  {detailItem.description}
                </p>
                <p className="mt-1 text-xs text-chocolate-500">{detailItem.category}</p>

                {/* Add / Qty */}
                <div className="mt-5">
                  {getQty(detailItem.id) === 0 ? (
                    <button
                      onClick={() => { handleAdd(detailItem); setDetailItem(null); }}
                      className="w-full rounded-xl bg-gold-400 py-3.5 text-sm font-bold text-chocolate-950 shadow-lg shadow-gold-400/20 active:bg-gold-300"
                    >
                      Add to Cart — ₹{detailItem.price}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleDecrease(detailItem.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-chocolate-800 text-chocolate-300 active:bg-chocolate-700"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-xl font-bold text-cream w-8 text-center">
                        {getQty(detailItem.id)}
                      </span>
                      <button
                        onClick={() => handleAdd(detailItem)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400 text-chocolate-950 active:bg-gold-300"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── CART DRAWER ───────────────────────────────────────── */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              key="cart-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              key="cart-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] flex flex-col rounded-t-3xl bg-chocolate-900 border-t border-gold-400/15 shadow-2xl"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="h-1 w-10 rounded-full bg-chocolate-700" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 shrink-0">
                <div>
                  <h3 className="font-display text-lg font-semibold text-cream">
                    Your Order
                  </h3>
                  {tableNumber && (
                    <p className="text-[11px] text-chocolate-400">Table {tableNumber}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-chocolate-400 hover:bg-chocolate-800 active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0">
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center text-chocolate-500 text-sm">
                    Your cart is empty
                  </div>
                ) : (
                  cartItems.map((ci) => (
                    <div
                      key={ci.menuItem.id}
                      className="flex items-center gap-3 py-3 border-b border-chocolate-800/50 last:border-0"
                    >
                      <img
                        src={ci.menuItem.image}
                        alt={ci.menuItem.name}
                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-chocolate-800/60 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream line-clamp-1">{ci.menuItem.name}</p>
                        <p className="text-xs text-chocolate-400">₹{ci.menuItem.price} × {ci.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() =>
                            ci.quantity <= 1
                              ? removeItem(ci.menuItem.id)
                              : updateQuantity(ci.menuItem.id, ci.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-chocolate-800 text-chocolate-300 active:bg-chocolate-700"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-cream">{ci.quantity}</span>
                        <button
                          onClick={() => addItem(ci.menuItem)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-400 text-chocolate-950 active:bg-gold-300"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-gold-400 w-14 text-right">
                        ₹{ci.menuItem.price * ci.quantity}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              {cartItems.length > 0 && (
                <div className="border-t border-chocolate-800/50 px-5 pt-4 pb-6 space-y-2.5 shrink-0">
                  <div className="flex justify-between text-sm text-chocolate-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-chocolate-300">
                    <span>GST (5%)</span>
                    <span>₹{tax()}</span>
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-cream">Total</span>
                    <span className="text-xl font-bold text-gold-400">₹{total()}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-gold-400 py-3.5 text-sm font-bold text-chocolate-950 shadow-lg shadow-gold-400/20 active:bg-gold-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Placing Order…
                      </>
                    ) : (
                      <>
                        Place Order <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
