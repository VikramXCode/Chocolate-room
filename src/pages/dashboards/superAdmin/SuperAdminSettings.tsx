import { useAppData } from '../../../context/AppDataContext';
import { Save, Store, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const inputClass =
  'w-full px-3 py-2.5 bg-chocolate-900/60 border border-chocolate-800/50 rounded-xl text-chocolate-100 text-sm focus:outline-none focus:border-gold-400/30 transition-colors duration-300';

export default function SuperAdminSettings() {
  const { settings, setSettings } = useAppData();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleFeature = (key: keyof typeof form.features) => {
    setForm((prev) => ({ ...prev, features: { ...prev.features, [key]: !prev.features[key] } }));
  };

  return (
    <div>
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Café Settings</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2.5 px-4 rounded-xl text-sm ring-1 ring-emerald-400/10"
        >
          Settings saved successfully!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* General */}
        <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="glass rounded-2xl p-6 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Store size={16} className="text-gold-400 opacity-70" /> General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 block">Café Name</label>
              <input type="text" value={form.cafeName} onChange={(e) => setForm({ ...form, cafeName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 flex items-center gap-1"><MapPin size={11} /> Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 flex items-center gap-1"><Phone size={11} /> Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 flex items-center gap-1"><Mail size={11} /> Email</label>
              <input type="text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] text-chocolate-500 mb-1.5 flex items-center gap-1"><Clock size={11} /> Opening Hours</label>
              <input type="text" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} className={inputClass} />
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="glass rounded-2xl p-6 hover:border-gold-400/15 transition-all duration-500">
          <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">Feature Toggles</h3>
          <div className="space-y-3">
            {(Object.keys(form.features) as (keyof typeof form.features)[]).map((key) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-chocolate-900/40 ring-1 ring-chocolate-800/30">
                <div>
                  <p className="text-sm text-chocolate-100 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-[11px] text-chocolate-500">{form.features[key] ? 'Enabled' : 'Disabled'}</p>
                </div>
                <button
                  onClick={() => toggleFeature(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.features[key] ? 'bg-gold-400' : 'bg-chocolate-700'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${form.features[key] ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 bg-gold-400 text-chocolate-950 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gold-300 active:scale-[0.97] transition-all duration-300"
          >
            <Save size={16} /> Save Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
}
