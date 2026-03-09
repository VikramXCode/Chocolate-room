import { motion } from 'framer-motion';
import { useAppData } from '../../../context/AppDataContext';
import { Star, Flag, Award } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminReviews() {
  const { reviews, setReviews } = useAppData();

  const toggleFlag = (id: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, flagged: !r.flagged } : r));
  };

  const toggleHighlight = (id: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, highlighted: !r.highlighted } : r));
  };

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  // Star distribution
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const maxCount = Math.max(...starCounts.map((s) => s.count), 1);

  return (
    <div>
      {/* Page header */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest">Feedback</h2>
          <p className="text-2xl font-display text-chocolate-100 mt-1">Review Management</p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent mt-3" />
        </div>
        <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 hover:border-gold-400/15 transition-all duration-500">
          <Star size={18} className="text-gold-400 fill-gold-400" />
          <span className="text-xl font-bold text-gold-400">{avgRating}</span>
          <span className="text-[11px] text-chocolate-500">avg&nbsp;·&nbsp;{reviews.length} reviews</span>
        </div>
      </motion.div>

      {/* Star distribution breakdown */}
      <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="glass rounded-2xl p-5 mb-6 hover:border-gold-400/15 transition-all duration-500">
        <h3 className="text-sm font-semibold text-chocolate-400 uppercase tracking-widest mb-4">Rating Breakdown</h3>
        <div className="space-y-2">
          {starCounts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs text-chocolate-400 w-12 flex items-center gap-1">{star} <Star size={10} className="text-gold-400 fill-gold-400" /></span>
              <div className="flex-1 h-2 rounded-full bg-chocolate-800/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400/80 to-gold-400/40 transition-all duration-700"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-chocolate-500 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.4 }}
            className={`glass rounded-2xl p-5 ring-1 transition-all duration-500 ${
              review.highlighted ? 'ring-gold-400/30 hover:ring-gold-400/40' :
              review.flagged ? 'ring-red-500/30 hover:ring-red-500/40' :
              'ring-chocolate-800/50 hover:ring-gold-400/15'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-chocolate-800/60 ring-1 ring-chocolate-700/50 flex items-center justify-center text-sm text-gold-300 font-semibold">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-chocolate-100">{review.customerName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={11} className={j < review.rating ? 'text-gold-400 fill-gold-400' : 'text-chocolate-700'} />
                      ))}
                    </div>
                    <span className="text-[11px] text-chocolate-600">{review.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => toggleHighlight(review.id)}
                  className={`p-2 rounded-xl active:scale-[0.97] transition-all duration-300 ${
                    review.highlighted
                      ? 'bg-gold-400/15 text-gold-400 ring-1 ring-gold-400/20'
                      : 'bg-chocolate-900/60 text-chocolate-500 ring-1 ring-chocolate-800/40 hover:text-gold-400 hover:ring-gold-400/20'
                  }`}
                  title="Highlight"
                >
                  <Award size={14} />
                </button>
                <button
                  onClick={() => toggleFlag(review.id)}
                  className={`p-2 rounded-xl active:scale-[0.97] transition-all duration-300 ${
                    review.flagged
                      ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20'
                      : 'bg-chocolate-900/60 text-chocolate-500 ring-1 ring-chocolate-800/40 hover:text-red-400 hover:ring-red-400/20'
                  }`}
                  title="Flag"
                >
                  <Flag size={14} />
                </button>
              </div>
            </div>

            {/* Quote-style comment */}
            <div className="pl-4 border-l-2 border-chocolate-800/50 ml-1">
              <p className="text-sm text-chocolate-300 italic leading-relaxed">"{review.comment}"</p>
            </div>

            {(review.highlighted || review.flagged) && (
              <div className="flex gap-2 mt-3">
                {review.highlighted && <span className="text-[11px] font-semibold bg-gold-400/10 text-gold-400 px-2.5 py-0.5 rounded-full">Highlighted</span>}
                {review.flagged && <span className="text-[11px] font-semibold bg-red-500/10 text-red-400 px-2.5 py-0.5 rounded-full">Flagged</span>}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
