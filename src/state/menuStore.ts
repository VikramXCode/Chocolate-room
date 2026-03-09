import { create } from 'zustand';
import type { MenuItem } from '../types/menu.types';
import { fetchMenu } from '../lib/api';

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  vegOnly: boolean;

  // actions
  loadMenu: () => Promise<void>;
  setCategory: (cat: string | null) => void;
  setSearch: (q: string) => void;
  toggleVegOnly: () => void;
  clearFilters: () => void;

  // derived
  filteredItems: () => MenuItem[];
  categories: () => string[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
  searchQuery: '',
  vegOnly: false,

  loadMenu: async () => {
    set({ loading: true, error: null });
    try {
      const items = await fetchMenu();
      set({ items, loading: false });
    } catch {
      set({ error: 'Failed to load menu', loading: false });
    }
  },

  setCategory: (cat) => set({ selectedCategory: cat }),
  setSearch: (q) => set({ searchQuery: q }),
  toggleVegOnly: () => set((s) => ({ vegOnly: !s.vegOnly })),

  clearFilters: () =>
    set({ selectedCategory: null, searchQuery: '', vegOnly: false }),

  filteredItems: () => {
    const { items, selectedCategory, searchQuery, vegOnly } = get();
    let result = items.filter((i) => i.available);
    if (selectedCategory) result = result.filter((i) => i.category === selectedCategory);
    if (vegOnly) result = result.filter((i) => i.veg);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      );
    }
    return result;
  },

  categories: () => {
    const cats = new Set(get().items.map((i) => i.category));
    return Array.from(cats);
  },
}));
