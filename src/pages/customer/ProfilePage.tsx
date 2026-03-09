import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Save,
  ShoppingBag,
  Star,
  Trash2,
  User,
} from 'lucide-react';

import { useUserStore } from '../../state/userStore';
import type { SavedAddress } from '../../state/userStore';
import { useOrderStore } from '../../state/orderStore';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' as const },
  }),
} as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  preparing: 'bg-orange-500/15 text-orange-400',
  ready: 'bg-emerald-500/15 text-emerald-400',
  served: 'bg-green-500/15 text-green-400',
  'out-for-delivery': 'bg-indigo-500/15 text-indigo-400',
  delivered: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

/* ------------------------------------------------------------------ */
/*  Quick‑action links                                                 */
/* ------------------------------------------------------------------ */
const quickActions = [
  { label: 'Browse Menu', to: '/app/menu', icon: ShoppingBag },
  { label: 'Track Orders', to: '/app/orders', icon: Package },
  { label: 'Write Review', to: '/app/reviews', icon: MessageSquare },
];

/* ================================================================== */
/*  ProfilePage                                                        */
/* ================================================================== */
export default function ProfilePage() {
  /* ── stores ──────────────────────────────────────────────────── */
  const profile = useUserStore((s) => s.profile);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const login = useUserStore((s) => s.login);
  const setProfile = useUserStore((s) => s.setProfile);
  const addAddress = useUserStore((s) => s.addAddress);
  const removeAddress = useUserStore((s) => s.removeAddress);
  const setDefaultAddress = useUserStore((s) => s.setDefaultAddress);

  const orders = useOrderStore((s) => s.orders);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const ordersLoading = useOrderStore((s) => s.loading);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ── profile form state ──────────────────────────────────────── */
  const [nameVal, setNameVal] = useState(profile.name);
  const [phoneVal, setPhoneVal] = useState(profile.phone);
  const [emailVal, setEmailVal] = useState(profile.email);
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync on profile changes (e.g. login)
  useEffect(() => {
    setNameVal(profile.name);
    setPhoneVal(profile.phone);
    setEmailVal(profile.email);
  }, [profile.name, profile.phone, profile.email]);

  const handleSaveProfile = () => {
    setProfile({ name: nameVal.trim(), phone: phoneVal.trim(), email: emailVal.trim() });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  /* ── quick login form ────────────────────────────────────────── */
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginName.trim() && loginPhone.trim()) {
      login(loginName.trim(), loginPhone.trim());
    }
  };

  /* ── add address form ────────────────────────────────────────── */
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState('');
  const [addrText, setAddrText] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLabel.trim() || !addrText.trim()) return;
    addAddress({ label: addrLabel.trim(), address: addrText.trim(), isDefault: false });
    setAddrLabel('');
    setAddrText('');
    setShowAddrForm(false);
  };

  /* ── shared input classes ────────────────────────────────────── */
  const inputCls =
    'w-full rounded-lg border border-chocolate-700 bg-chocolate-800/60 px-4 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-chocolate-500 focus:border-gold-400/50';

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-espresso text-cream">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10"
        >
          <h1 className="text-gradient text-3xl font-bold sm:text-4xl">
            My Profile
          </h1>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* ════════════════════════════════════════════════════ */}
          {/*  LEFT COLUMN                                        */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="space-y-8 lg:col-span-3">
            {/* ── Profile Card ────────────────────────────────── */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="glass-solid rounded-2xl p-6 sm:p-8"
            >
              {isLoggedIn ? (
                <>
                  {/* Avatar + fields */}
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    {/* Avatar circle */}
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400/30 to-gold-600/30 text-2xl font-bold text-gold-300">
                      {getInitials(nameVal || 'G')}
                    </div>

                    <div className="w-full flex-1 space-y-4">
                      {/* Name */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-chocolate-400">
                          Name
                        </label>
                        <input
                          type="text"
                          value={nameVal}
                          onChange={(e) => setNameVal(e.target.value)}
                          className={inputCls}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-chocolate-400">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phoneVal}
                          onChange={(e) => setPhoneVal(e.target.value)}
                          placeholder="+91 98765 43210"
                          className={inputCls}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-chocolate-400">
                          Email
                        </label>
                        <input
                          type="email"
                          value={emailVal}
                          onChange={(e) => setEmailVal(e.target.value)}
                          placeholder="you@example.com"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-espresso transition-opacity hover:opacity-90"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>

                    <AnimatePresence>
                      {profileSaved && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="text-sm text-green-400"
                        >
                          Saved!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* ── Quick Login ──────────────────────────────── */
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <User size={20} className="text-gold-400" />
                    <h2 className="text-lg font-semibold text-cream">
                      Quick Login
                    </h2>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <input
                      type="text"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="Your name"
                      className={inputCls}
                    />
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="Phone number"
                      className={inputCls}
                    />
                    <button
                      type="submit"
                      disabled={!loginName.trim() || !loginPhone.trim()}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      Login
                    </button>
                  </form>
                </div>
              )}
            </motion.section>

            {/* ── Saved Addresses ─────────────────────────────── */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="glass-solid rounded-2xl p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-cream">
                  <MapPin size={18} className="text-gold-400" />
                  Saved Addresses
                </h2>
                <button
                  onClick={() => setShowAddrForm((p) => !p)}
                  className="flex items-center gap-1 rounded-full bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300 transition-colors hover:bg-gold-400/20"
                >
                  <Plus size={14} />
                  Add New
                </button>
              </div>

              {/* Address list */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {profile.addresses.map((addr: SavedAddress) => (
                    <motion.div
                      key={addr.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 rounded-xl border border-chocolate-800 bg-chocolate-900/40 p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-cream">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="rounded bg-gold-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-gold-300">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-chocolate-400">
                          {addr.address}
                        </p>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-1">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            title="Set as default"
                            className="rounded-lg p-1.5 text-chocolate-500 transition-colors hover:bg-gold-400/10 hover:text-gold-400"
                          >
                            <Star size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => removeAddress(addr.id)}
                          title="Remove"
                          className="rounded-lg p-1.5 text-chocolate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {profile.addresses.length === 0 && (
                  <p className="py-6 text-center text-sm text-chocolate-500">
                    No saved addresses yet.
                  </p>
                )}
              </div>

              {/* Add address form */}
              <AnimatePresence>
                {showAddrForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddAddress}
                    className="mt-4 space-y-3 overflow-hidden"
                  >
                    <input
                      type="text"
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      placeholder="Label (e.g. Home, Work)"
                      className={inputCls}
                    />
                    <textarea
                      value={addrText}
                      onChange={(e) => setAddrText(e.target.value)}
                      rows={2}
                      placeholder="Full address"
                      className={`${inputCls} resize-none`}
                    />
                    <button
                      type="submit"
                      disabled={!addrLabel.trim() || !addrText.trim()}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2 text-sm font-semibold text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      <Save size={14} />
                      Save Address
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.section>
          </div>

          {/* ════════════════════════════════════════════════════ */}
          {/*  RIGHT COLUMN                                       */}
          {/* ════════════════════════════════════════════════════ */}
          <div className="space-y-8 lg:col-span-2">
            {/* ── Order History ───────────────────────────────── */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="glass-solid rounded-2xl p-6 sm:p-8"
            >
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-cream">
                <Package size={18} className="text-gold-400" />
                Order History
              </h2>

              {ordersLoading ? (
                <div className="flex justify-center py-10">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
                </div>
              ) : orders.length === 0 ? (
                <p className="py-10 text-center text-sm text-chocolate-500">
                  You haven't placed any orders yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const itemCount = order.items.reduce(
                      (s, i) => s + i.quantity,
                      0,
                    );
                    return (
                      <Link
                        key={order.id}
                        to={`/app/orders/${order.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-chocolate-800 bg-chocolate-900/40 p-4 transition-colors hover:border-gold-400/20"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-cream">
                              #{order.id}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize ${
                                statusColor[order.status] ?? 'bg-chocolate-700 text-chocolate-300'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-chocolate-500">
                            {formatDate(order.createdAt)} · {itemCount} item
                            {itemCount !== 1 ? 's' : ''} · ₹{order.total}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="flex-shrink-0 text-chocolate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-400"
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </motion.section>

            {/* ── Quick Actions ───────────────────────────────── */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="glass rounded-2xl p-6"
            >
              <h2 className="mb-4 text-lg font-semibold text-cream">
                Quick Actions
              </h2>

              <div className="space-y-2">
                {quickActions.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-chocolate-800/50"
                  >
                    <Icon
                      size={18}
                      className="flex-shrink-0 text-gold-400"
                    />
                    <span className="flex-1 text-sm text-cream">{label}</span>
                    <ChevronRight
                      size={16}
                      className="text-chocolate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-400"
                    />
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
