import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Upload } from 'lucide-react';
import { useAppData } from '../../../context/AppDataContext';
import type { MenuItem, MenuCategory } from '../../../types';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const categories: MenuCategory[] = ['Hot Chocolate', 'Cold Beverages', 'Shakes', 'Cakes', 'Desserts', 'Waffles', 'Snacks', 'Specials'];

const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-chocolate-900/60 border border-chocolate-800/50 text-chocolate-100 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300';

const emptyProduct: Omit<MenuItem, 'id'> = {
  name: '', description: '', price: 0, category: 'Hot Chocolate', image: '', available: true, veg: true, prepTimeMinutes: 10,
};

export default function AdminProducts() {
  const { menuItems, setMenuItems } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, 'id'>>(emptyProduct);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'All'>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpen = (item?: MenuItem) => {
    if (item) {
      setEditId(item.id);
      setForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: item.image, available: item.available, veg: item.veg, popular: item.popular, prepTimeMinutes: item.prepTimeMinutes });
    } else {
      setEditId(null);
      setForm(emptyProduct);
    }
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editId) {
      setMenuItems((prev) => prev.map((m) => m.id === editId ? { ...m, ...form } : m));
    } else {
      setMenuItems((prev) => [...prev, { ...form, id: `m${Date.now()}` }]);
    }
    setShowForm(false);
    setForm(emptyProduct);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) => prev.map((m) => m.id === id ? { ...m, available: !m.available } : m));
  };

  const filteredAndSortedItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filteredItems = menuItems.filter((item) => {
      const matchesSearch = !query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesAvailability = availabilityFilter === 'all' || (availabilityFilter === 'available' ? item.available : !item.available);
      return matchesSearch && matchesCategory && matchesAvailability;
    });

    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      return b.price - a.price;
    });
  }, [menuItems, searchTerm, selectedCategory, availabilityFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAndSortedItems.length);
  const paginatedItems = filteredAndSortedItems.slice(startIndex, endIndex);

  const categorySections = categories
    .map((category) => ({
      category,
      items: paginatedItems.filter((item) => item.category === category),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div>
      {/* Page header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Catalogue</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
            <p className="text-xl sm:text-2xl font-display text-chocolate-100">Product Management</p>
            <span className="inline-flex items-center rounded-full bg-gold-400/10 px-2.5 py-1 text-xs font-semibold text-gold-300 ring-1 ring-gold-400/20 whitespace-nowrap">
              Total Items: {menuItems.length}
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
        </div>
        <button
          onClick={() => handleOpen()}
          className="self-start sm:self-auto bg-gold-400 text-chocolate-950 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-gold-300 active:scale-[0.97] transition-all duration-300"
        >
          <Plus size={14} /> Add Product
        </button>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="glass rounded-2xl p-4 mb-6 border border-chocolate-800/50"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search name or description"
            className={inputClass}
          />

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as MenuCategory | 'All');
              setCurrentPage(1);
            }}
            className={inputClass}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value as 'all' | 'available' | 'unavailable');
              setCurrentPage(1);
            }}
            className={inputClass}
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc')}
            className={inputClass}
          >
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
            <option value="price-asc">Price Low → High</option>
            <option value="price-desc">Price High → Low</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={inputClass}
          >
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={36}>36 per page</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-chocolate-400">
          <p>
            Showing {filteredAndSortedItems.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredAndSortedItems.length} products
          </p>
          <p>
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </motion.div>

      {/* Products grouped by category */}
      <div className="space-y-8">
        {categorySections.map((section, sectionIndex) => (
          <motion.div
            key={section.category}
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ delay: sectionIndex * 0.04, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-chocolate-200">{section.category}</h3>
              <span className="text-[11px] font-semibold text-chocolate-400 bg-chocolate-900/60 ring-1 ring-chocolate-800/60 px-2.5 py-1 rounded-full whitespace-nowrap">
                {section.items.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={fadeUp.initial}
                  animate={fadeUp.animate}
                  transition={{ delay: itemIndex * 0.03, duration: 0.35 }}
                  className="group glass rounded-2xl p-4 ring-1 ring-chocolate-800/50 hover:ring-gold-400/20 hover:border-gold-400/15 transition-all duration-500"
                >
                  <div className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 ring-1 ring-chocolate-800/50" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-chocolate-100 truncate">{item.name}</p>
                      <p className="text-[11px] text-chocolate-500 mt-0.5">{item.category}</p>
                      <p className="text-gold-400 font-bold text-sm mt-1.5">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-chocolate-800/40">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold active:scale-[0.97] transition-all duration-300 ${
                        item.available
                          ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpen(item)}
                        className="p-2 rounded-xl bg-chocolate-900/60 text-chocolate-400 hover:text-gold-400 ring-1 ring-chocolate-800/40 hover:ring-gold-400/20 active:scale-[0.97] transition-all duration-300"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl bg-chocolate-900/60 text-chocolate-400 hover:text-red-400 ring-1 ring-chocolate-800/40 hover:ring-red-400/20 active:scale-[0.97] transition-all duration-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAndSortedItems.length === 0 && (
        <div className="glass rounded-2xl p-6 text-center text-sm text-chocolate-400 border border-chocolate-800/50">
          No products found for the selected filters.
        </div>
      )}

      {filteredAndSortedItems.length > 0 && (
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-chocolate-900/60 text-chocolate-200 ring-1 ring-chocolate-800/60 disabled:opacity-40 disabled:cursor-not-allowed hover:ring-gold-400/20 transition-all duration-300"
          >
            Previous
          </button>

          <div className="text-xs text-chocolate-400">Page {currentPage} / {totalPages}</div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-chocolate-900/60 text-chocolate-200 ring-1 ring-chocolate-800/60 disabled:opacity-40 disabled:cursor-not-allowed hover:ring-gold-400/20 transition-all duration-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-chocolate-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-chocolate-800/50">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-display text-lg text-chocolate-100">{editId ? 'Edit Product' : 'Add Product'}</h3>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-2" />
                  </div>
                  <button onClick={() => setShowForm(false)} className="text-chocolate-500 hover:text-chocolate-200 transition-colors duration-300"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] text-chocolate-500 uppercase tracking-wider mb-1.5 block">Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[11px] text-chocolate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-chocolate-500 uppercase tracking-wider mb-1.5 block">Price (₹)</label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[11px] text-chocolate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MenuCategory })} className={inputClass}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-chocolate-500 uppercase tracking-wider mb-1.5 block">Prep Time (mins)</label>
                      <input type="number" value={form.prepTimeMinutes || ''} onChange={(e) => setForm({ ...form, prepTimeMinutes: Number(e.target.value) })} className={inputClass} placeholder="15" />
                    </div>
                    <div>
                      <label className="text-[11px] text-chocolate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Upload size={11} /> Image URL</label>
                      <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={inputClass} />
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <label className="flex items-center gap-2 text-sm text-chocolate-300 cursor-pointer">
                      <input type="checkbox" checked={form.veg} onChange={() => setForm({ ...form, veg: !form.veg })} className="accent-emerald-500" /> Vegetarian
                    </label>
                    <label className="flex items-center gap-2 text-sm text-chocolate-300 cursor-pointer">
                      <input type="checkbox" checked={form.popular} onChange={() => setForm({ ...form, popular: !form.popular })} className="accent-gold-400" /> Popular
                    </label>
                  </div>
                  <button onClick={handleSave} className="w-full bg-gold-400 text-chocolate-950 py-3 rounded-xl font-semibold hover:bg-gold-300 active:scale-[0.97] transition-all duration-300">
                    {editId ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
