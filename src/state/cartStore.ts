import { create } from 'zustand';
import type { MenuItem, CartItem } from '../types/menu.types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;

  // actions
  addItem: (menuItem: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // derived
  total: () => number;
  itemCount: () => number;
  subtotal: () => number;
  tax: () => number;
}

const TAX_RATE = 0.05; // 5% GST

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isDrawerOpen: false,

  addItem: (menuItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItem.id === menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return { items: [...state.items, { menuItem, quantity: 1 }] };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.menuItem.id !== itemId),
    })),

  updateQuantity: (itemId, qty) => {
    if (qty <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === itemId ? { ...i, quantity: qty } : i,
      ),
    }));
  },

  clearCart: () => set({ items: [] }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

  tax: () => Math.round(get().subtotal() * TAX_RATE),

  total: () => get().subtotal() + get().tax(),

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
