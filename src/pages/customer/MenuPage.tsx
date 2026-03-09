import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  X,
  Leaf,
  SlidersHorizontal,
  Flame,
  Coffee,
  IceCream,
  Cake,
  CakeSlice,
  Sandwich,
  CupSoda,
  Cookie,
  Sparkles,
  ShoppingCart,
  ChevronDown,
  Bell,
  Check,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { callWaiter } from "../../lib/api";
import type { LucideIcon } from "lucide-react";
import { useMenuStore } from "../../state/menuStore";
import { useCartStore } from "../../state/cartStore";
import ItemDetailModal from "../../components/ItemDetailModal";
import QuantitySelector from "../../components/QuantitySelector";
import type { MenuItem, MenuCategory } from "../../types/menu.types";

/* ── constants ── */
const CATEGORY_ORDER: MenuCategory[] = [
  "Hot Chocolate",
  "Cold Beverages",
  "Shakes",
  "Cakes",
  "Desserts",
  "Waffles",
  "Snacks",
  "Specials",
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Hot Chocolate": Coffee,
  "Cold Beverages": IceCream,
  Desserts: CakeSlice,
  Cakes: Cake,
  Snacks: Sandwich,
  Shakes: CupSoda,
  Waffles: Cookie,
  Specials: Sparkles,
};

/* ── Item row ── */
function MenuItemRow({
  item,
  onQuickView,
}: {
  item: MenuItem;
  onQuickView: (item: MenuItem) => void;
}) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((ci) => ci.menuItem.id === item.id);

  return (
    <div
      onClick={() => onQuickView(item)}
      className="group glass-light rounded-xl p-3 flex gap-3 cursor-pointer
        transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/5
        hover:border-gold-400/15 active:scale-[0.995]"
      >
        {/* Thumbnail */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {item.popular && (
            <span className="absolute top-1 left-1 bg-orange-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Flame size={9} />
              HOT
            </span>
          )}
          {!item.available && (
            <div className="absolute inset-0 bg-chocolate-950/75 backdrop-blur-sm flex items-center justify-center">
              <span className="text-[10px] font-semibold text-chocolate-300">
                Sold out
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm sm:text-base font-semibold text-cream truncate">
                {item.name}
              </h3>
              <span
                className={`shrink-0 h-3.5 w-3.5 rounded-sm border-2 flex items-center justify-center ${
                  item.veg ? "border-emerald-500" : "border-red-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.veg ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </span>
            </div>
            <p className="text-xs text-chocolate-400 line-clamp-2 mt-0.5 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-1.5">
            <span className="text-gradient font-display text-lg font-bold">
              ₹{item.price}
            </span>

            {item.available ? (
              cartItem ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <QuantitySelector
                    quantity={cartItem.quantity}
                    onIncrement={() =>
                      updateQuantity(item.id, cartItem.quantity + 1)
                    }
                    onDecrement={() =>
                      cartItem.quantity <= 1
                        ? removeItem(item.id)
                        : updateQuantity(item.id, cartItem.quantity - 1)
                    }
                    size="sm"
                  />
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(item);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gold-400/30 bg-gold-400/10 px-3.5 py-1.5
                    text-xs font-bold text-gold-300 uppercase tracking-wider
                    transition-all hover:bg-gold-400 hover:text-chocolate-950 hover:shadow-md hover:shadow-gold-400/20
                    active:bg-gold-500"
                >
                  Add
                  <span className="text-[10px]">+</span>
                </motion.button>
              )
            ) : null}
          </div>
        </div>
    </div>
  );
}

/* ── Category accordion section ── */
function CategoryAccordion({
  category,
  items,
  isOpen,
  onToggle,
  onQuickView,
}: {
  category: string;
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
  onQuickView: (item: MenuItem) => void;
}) {
  const Icon = CATEGORY_ICONS[category] ?? Sparkles;
  const cartItems = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => {
    const c = cartItems.find((ci) => ci.menuItem.id === item.id);
    return sum + (c?.quantity ?? 0);
  }, 0);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* ── Header (clickable) ── */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left ${
          isOpen
            ? "bg-gold-400/8 border-b border-gold-400/10"
            : "hover:bg-chocolate-800/30"
        }`}
      >
        <span
          className={`flex items-center justify-center h-10 w-10 rounded-xl shrink-0 transition-colors ${
            isOpen
              ? "bg-gold-400/20 text-gold-300"
              : "bg-chocolate-800/50 text-chocolate-400"
          }`}
        >
          <Icon size={20} />
        </span>

        <div className="flex-1 min-w-0">
          <h2
            className={`font-display text-base sm:text-lg font-bold transition-colors ${
              isOpen ? "text-gold-300" : "text-cream"
            }`}
          >
            {category}
          </h2>
          <p className="text-xs text-chocolate-400">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Cart count for this category */}
        {cartCount > 0 && (
          <span className="shrink-0 flex items-center justify-center h-6 min-w-[1.5rem] rounded-full bg-gold-400 px-1.5 text-xs font-bold text-chocolate-950">
            {cartCount}
          </span>
        )}

        {/* Chevron */}
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          }}
          className={`shrink-0 ${isOpen ? "text-gold-400" : "text-chocolate-500"}`}
        >
          <ChevronDown size={20} />
        </span>
      </button>

      {/* ── Items (collapsible) — CSS grid-template-rows trick, no JS measurement ── */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.32s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="p-3 space-y-2">
            {items.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Main page
   ════════════════════════════════════════════════ */
export default function MenuPage() {
  const {
    loading,
    loadMenu,
    filteredItems,
    searchQuery,
    setSearch,
    vegOnly,
    toggleVegOnly,
    clearFilters,
  } = useMenuStore();

  const { itemCount, openDrawer } = useCartStore();
  const count = itemCount();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set([CATEGORY_ORDER[0]])
  );

  // ── Call-waiter state ──
  const TABLE_NUMBER = 7;
  const [waiterModal, setWaiterModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [waiterStatus, setWaiterStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleCallWaiter = async () => {
    if (!guestName.trim() || waiterStatus === "sending") return;
    setWaiterStatus("sending");
    await callWaiter(TABLE_NUMBER);
    setWaiterStatus("sent");
    setTimeout(() => {
      setWaiterModal(false);
      setWaiterStatus("idle");
      setGuestName("");
    }, 3000);
  };

  const closeWaiterModal = () => {
    if (waiterStatus === "sending") return;
    setWaiterModal(false);
    setWaiterStatus("idle");
    setGuestName("");
  };

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const items = filteredItems();
  const hasActiveFilters = !!searchQuery || vegOnly;

  /* group items by category */
  const groupedItems = CATEGORY_ORDER.reduce<
    { category: MenuCategory; items: MenuItem[] }[]
  >((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length > 0) acc.push({ category: cat, items: catItems });
    return acc;
  }, []);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleCategory = (cat: string) => {
    const el = categoryRefs.current[cat];
    if (!el) {
      setOpenCategories((prev) => {
        if (prev.has(cat)) return new Set();
        return new Set([cat]);
      });
      return;
    }

    const clickedTop = el.getBoundingClientRect().top;
    const screenH = window.innerHeight;
    const isAboveHalf = clickedTop < screenH / 2;
    const desiredViewportTop = isAboveHalf ? clickedTop : screenH / 2 - 30;

    setOpenCategories((prev) => {
      if (prev.has(cat)) return new Set();
      return new Set([cat]);
    });

    // Single scroll correction AFTER the 320ms CSS transition completes — zero layout thrash during animation
    setTimeout(() => {
      const newTop = el.getBoundingClientRect().top;
      const diff = newTop - desiredViewportTop;
      if (Math.abs(diff) > 4) {
        window.scrollBy({ top: diff, behavior: "smooth" });
      }
    }, 340);
  };

  return (
    <div className="min-h-screen bg-espresso flex flex-col">
      {/* ── Header ── */}
      <section className="pt-20 pb-3 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gradient font-display text-3xl md:text-4xl font-bold"
        >
          Our Menu
        </motion.h1>
        <p className="mt-1 text-chocolate-400 text-sm">
          Crafted with the finest Belgian chocolate
        </p>
      </section>

      {/* ── Call Waiter Banner ── */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-3">
        <button
          onClick={() => setWaiterModal(true)}
          className="w-full glass rounded-2xl px-4 py-3 flex items-center gap-3
            border border-gold-400/15 hover:border-gold-400/35 transition-all
            hover:bg-gold-400/5 active:scale-[0.99] text-left"
        >
          <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-gold-400/15 text-gold-400 shrink-0">
            <Bell size={20} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-cream">Need assistance?</p>
            <p className="text-xs text-chocolate-400">Tap to call a waiter to your table</p>
          </div>
          <ChevronRight size={16} className="text-chocolate-500 shrink-0" />
        </button>
      </div>

      {/* ── Sticky search & filter bar ── */}
      <div className="sticky top-16 z-30 bg-espresso/95 backdrop-blur-md border-b border-chocolate-800/50">
        <div className="mx-auto max-w-2xl px-4 py-2.5 flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-500 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="w-full rounded-xl bg-chocolate-900/60 border border-chocolate-700/40
                py-2 pl-9 pr-8 text-sm text-cream placeholder:text-chocolate-500
                outline-none focus:ring-2 focus:ring-gold-400/50 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-cream"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Veg toggle */}
          <button
            onClick={toggleVegOnly}
            className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
              vegOnly
                ? "bg-green-600/80 text-white shadow-lg shadow-green-900/30"
                : "bg-chocolate-800/60 text-chocolate-400 hover:bg-chocolate-700/60"
            }`}
          >
            <Leaf size={14} />
            <span className="hidden sm:inline">Veg only</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gold-400 text-xs hover:text-gold-300 underline underline-offset-2"
            >
              Clear
            </button>
          )}


        </div>
      </div>

      {/* ── Accordion menu ── */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-5">
        {loading ? (
          /* Shimmer skeleton */
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-4 flex items-center gap-3 animate-pulse"
              >
                <div className="shimmer h-10 w-10 rounded-xl bg-chocolate-800/50" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-4 w-2/5 rounded bg-chocolate-800/50" />
                  <div className="shimmer h-3 w-1/4 rounded bg-chocolate-800/50" />
                </div>
                <div className="shimmer h-5 w-5 rounded bg-chocolate-800/50" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="glass-light rounded-full p-5 mb-4">
              <SlidersHorizontal size={32} className="text-chocolate-400" />
            </div>
            <h3 className="font-display text-lg text-cream mb-2">
              No items found
            </h3>
            <p className="text-chocolate-400 text-sm mb-5 max-w-xs">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="rounded-xl bg-gold-500 hover:bg-gold-400 text-espresso font-semibold px-5 py-2 text-sm transition"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {groupedItems.map(({ category, items: catItems }) => (
              <div
                key={category}
                ref={(el) => { categoryRefs.current[category] = el; }}
              >
                <CategoryAccordion
                  category={category}
                  items={catItems}
                  isOpen={openCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  onQuickView={setSelectedItem}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Floating cart button ── */}
      {count > 0 && (
        <motion.button
          key="cart-fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={openDrawer}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center
            rounded-full bg-gold-400 shadow-xl shadow-gold-400/30
            ring-4 ring-gold-400/20 hover:bg-gold-500 transition-colors"
          aria-label="Open cart"
        >
          <ShoppingCart size={22} className="text-chocolate-950" />
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center
              rounded-full bg-chocolate-950 text-[11px] font-bold text-gold-400 ring-2 ring-gold-400"
          >
            {count}
          </span>
        </motion.button>
      )}

      {/* ── Item Detail Modal ── */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* ── Call Waiter Modal ── */}
      {waiterModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4
            bg-chocolate-950/75 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeWaiterModal()}
        >
          <div className="w-full max-w-sm glass-solid rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            {waiterStatus === "sent" ? (
              /* ── Success state ── */
              <div className="text-center py-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check size={32} className="text-emerald-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-cream mb-1">Waiter is on the way!</h3>
                <p className="text-gold-400 font-medium text-sm">Table {TABLE_NUMBER} &middot; {guestName}</p>
                <p className="text-chocolate-400 text-xs mt-2">Your waiter has been notified and will be with you shortly.</p>
              </div>
            ) : (
              /* ── Input state ── */
              <>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/15 text-gold-400 shrink-0">
                    <Bell size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-cream">Call a Waiter</h3>
                    <p className="text-xs text-chocolate-400">Table {TABLE_NUMBER} &middot; We'll send help right away</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-chocolate-300 mb-1.5">Your name</label>
                  <input
                    autoFocus
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCallWaiter()}
                    placeholder="e.g. Rahul"
                    maxLength={40}
                    className="w-full rounded-xl bg-chocolate-900/60 border border-chocolate-700/40
                      px-4 py-3 text-sm text-cream placeholder:text-chocolate-500
                      outline-none focus:ring-2 focus:ring-gold-400/50 transition"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeWaiterModal}
                    className="flex-1 rounded-xl border border-chocolate-700/40 py-2.5 text-sm
                      text-chocolate-400 hover:bg-chocolate-800/50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCallWaiter}
                    disabled={!guestName.trim() || waiterStatus === "sending"}
                    className="flex-1 rounded-xl bg-gold-400 py-2.5 text-sm font-bold text-chocolate-950
                      hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition
                      flex items-center justify-center gap-2"
                  >
                    {waiterStatus === "sending" ? (
                      <><Loader2 size={16} className="animate-spin" /> Calling…</>
                    ) : (
                      <><Bell size={16} /> Call Waiter</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
