import { motion } from "framer-motion";
import { Flame, Leaf, ShoppingCart, Eye } from "lucide-react";
import type { MenuItem } from "../types/menu.types";
import { useCartStore } from "../state/cartStore";
import QuantitySelector from "./QuantitySelector";

interface MenuCardProps {
  item: MenuItem;
  viewMode?: "grid" | "list";
  featured?: boolean;
  onQuickView?: (item: MenuItem) => void;
}

export default function MenuCard({
  item,
  viewMode = "grid",
  featured,
  onQuickView,
}: MenuCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((ci) => ci.menuItem.id === item.id);

  /* ─── List view ─── */
  if (viewMode === "list") {
    return (
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={() => onQuickView?.(item)}
        className="group glass rounded-2xl overflow-hidden flex cursor-pointer
          transition-shadow duration-300 hover:shadow-lg hover:shadow-gold-400/5"
      >
        {/* Image */}
        <div className="relative w-24 sm:w-28 shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!item.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-chocolate-950/70 backdrop-blur-sm">
              <span className="text-[10px] font-semibold text-chocolate-300">
                Sold out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-1  p-3 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm font-semibold text-cream truncate">
                {item.name}
              </h3>
              {/* Veg dot */}
              <span
                className={`shrink-0 h-3 w-3 rounded-sm border-2 flex items-center justify-center ${
                  item.veg
                    ? "border-emerald-500"
                    : "border-red-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.veg ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </span>
              {item.popular && (
                <Flame size={12} className="text-orange-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-chocolate-400 line-clamp-1 mt-0.5">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-gradient font-display text-base font-bold">
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
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(item);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-gold-400 px-3 py-1.5
                    text-xs font-semibold text-chocolate-950 shadow-md shadow-gold-400/20
                    transition-colors hover:bg-gold-300 active:bg-gold-500"
                >
                  <ShoppingCart size={12} />
                  Add
                </motion.button>
              )
            ) : null}
          </div>
        </div>
      </motion.div>
    );
  }

  /* ─── Grid view ─── */
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onQuickView?.(item)}
      className={`group relative glass rounded-2xl overflow-hidden flex flex-col cursor-pointer
        transition-shadow duration-300 hover:shadow-xl hover:shadow-gold-400/10
        ${featured ? "ring-1 ring-gold-400/20" : ""}`}
    >
      {/* ——— Image area ——— */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/90 via-chocolate-950/20 to-transparent" />

        {/* Price floating badge */}
        <span className="absolute bottom-3 left-3 text-gradient font-display text-xl font-bold drop-shadow-lg">
          ₹{item.price}
        </span>

        {/* Quick-view icon on hover */}
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            flex items-center justify-center h-10 w-10 rounded-full bg-black/50 text-cream
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
        >
          <Eye size={18} />
        </span>

        {/* Top-right badges stack */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
          {/* Veg / Non-veg indicator */}
          <span
            className={`flex items-center justify-center h-5 w-5 rounded-sm border-2 bg-chocolate-950/60 backdrop-blur-sm ${
              item.veg ? "border-emerald-500" : "border-red-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                item.veg ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </span>
        </div>

        {/* Popular badge */}
        {item.popular && (
          <span className="absolute top-2.5 left-2.5 badge bg-orange-500/90 text-white shadow-lg text-[10px]">
            <Flame size={11} />
            Popular
          </span>
        )}

        {/* Featured sparkle border */}
        {featured && (
          <div className="absolute inset-0 border-2 border-gold-400/20 rounded-t-2xl pointer-events-none" />
        )}

        {/* Unavailable overlay */}
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-chocolate-950/70 backdrop-blur-sm">
            <span className="rounded-full bg-chocolate-800/80 px-4 py-1.5 text-sm font-semibold text-chocolate-300 tracking-wide">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* ——— Content ——— */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight text-cream line-clamp-1">
            {item.name}
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-chocolate-400 line-clamp-2">
          {item.description}
        </p>

        {/* Cart action */}
        <div className="mt-auto pt-2">
          {item.available ? (
            cartItem ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-chocolate-400">In cart</span>
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
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(item);
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl
                  bg-gold-400/15 border border-gold-400/20 px-4 py-2
                  text-sm font-semibold text-gold-300
                  transition-all hover:bg-gold-400 hover:text-chocolate-950 hover:shadow-lg hover:shadow-gold-400/20
                  active:bg-gold-500"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </motion.button>
            )
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
