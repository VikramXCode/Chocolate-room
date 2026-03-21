import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, ArrowUpDown, ExternalLink } from 'lucide-react';

import ReviewCard from '../../components/ReviewCard';
import { useUserStore } from '../../state/userStore';
import { fetchReviews, submitReview } from '../../lib/api';
import type { Review, RatingDistribution } from '../../types/review.types';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Sort options                                                       */
/* ------------------------------------------------------------------ */
type SortKey = 'newest' | 'highest' | 'lowest';
const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'highest', label: 'Highest' },
  { key: 'lowest', label: 'Lowest' },
];

const GOOGLE_REVIEW_URL =
  'https://www.google.com/search?sca_esv=1f1bc4ebf15b2244&sxsrf=ANbL-n54p9fc4BxKfYe4BFR4N1F_-u4d0A:1774112789163&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qObGkh-TbT_qTnQU1k5nVzbkJW_RIKqsuxsGPikny2zjB57GGzG6o0owydlnfl_7Jz65Y5L1UVj6QN-uhK0w3AvOgBPZs35sA4WkhY71v0AmEumsaVA%3D%3D&q=The+Chocolate+Room+-+Tirupur+Reviews&sa=X&ved=2ahUKEwieuduUvbGTAxVxSmwGHU7ELcEQ0bkNegQIJhAF&biw=1440&bih=813&dpr=2#lrd=0x3ba907424abbadb5:0xc352e7daa4a901ba,3,,,,';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function computeDistribution(reviews: Review[]): RatingDistribution[] {
  const counts = [0, 0, 0, 0, 0]; // index 0 → 1‑star … index 4 → 5‑star
  reviews.forEach((r) => {
    const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4);
    counts[idx]++;
  });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star - 1],
    percentage: Math.round((counts[star - 1] / total) * 100),
  }));
}

function averageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function hasPositiveWording(text: string): boolean {
  const normalized = text.toLowerCase();
  const positiveTerms = [
    'good',
    'great',
    'excellent',
    'amazing',
    'awesome',
    'love',
    'loved',
    'nice',
    'best',
    'tasty',
    'delicious',
    'friendly',
    'fast',
    'perfect',
    'fantastic',
  ];

  return positiveTerms.some((term) => normalized.includes(term));
}

/* ================================================================== */
/*  InteractiveStars                                                   */
/* ================================================================== */
function InteractiveStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
        >
          <Star
            size={28}
            className={`transition-colors ${
              s <= (hover || value)
                ? 'fill-gold-400 text-gold-400'
                : 'text-chocolate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  FilledStars (display‑only)                                         */
/* ================================================================== */
function FilledStars({ rating, size = 18 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const rest = 5 - full;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} className="fill-gold-400 text-gold-400" />
      ))}
      {Array.from({ length: rest }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-chocolate-600" />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  ReviewsPage                                                        */
/* ================================================================== */
export default function ReviewsPage() {
  const profile = useUserStore((s) => s.profile);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);

  /* ── reviews state ───────────────────────────────────────────── */
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('newest');

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  /* ── form state ──────────────────────────────────────────────── */
  const [rating, setRating] = useState(0);
  const [name, setName] = useState(isLoggedIn ? profile.name : '');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [showLowRatingPrompt, setShowLowRatingPrompt] = useState(false);

  /* keep name in sync if login changes */
  useEffect(() => {
    if (isLoggedIn) setName(profile.name);
  }, [isLoggedIn, profile.name]);

  /* ── derived data ────────────────────────────────────────────── */
  const avg = useMemo(() => averageRating(reviews), [reviews]);
  const distribution = useMemo(() => computeDistribution(reviews), [reviews]);

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sort === 'newest') copy.sort((a, b) => b.date.localeCompare(a.date));
    else if (sort === 'highest') copy.sort((a, b) => b.rating - a.rating);
    else copy.sort((a, b) => a.rating - b.rating);
    return copy;
  }, [reviews, sort]);

  /* ── submit handler ──────────────────────────────────────────── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');

      if (!rating) {
        setFormError('Please select a star rating.');
        return;
      }

      if (rating >= 3) {
        window.location.assign(GOOGLE_REVIEW_URL);
        return;
      }

      if (!name.trim()) {
        setFormError('Please enter your name.');
        return;
      }

      if (!comment.trim()) {
        setFormError('Please share the reason for your rating.');
        return;
      }

      if (hasPositiveWording(comment) && rating < 3) {
        setShowLowRatingPrompt(true);
        return;
      }

      setSubmitting(true);
      try {
        const created = await submitReview({
          customerName: name.trim() || 'Anonymous',
          rating,
          comment: comment.trim(),
        });
        setReviews((prev) => [created, ...prev]);
        setRating(0);
        setComment('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch {
        setFormError('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [rating, comment, name],
  );

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-espresso text-cream">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-20">
        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10 text-center"
        >
          <h1 className="text-gradient text-3xl font-bold sm:text-4xl">
            Customer Reviews
          </h1>
          <p className="mt-2 text-chocolate-300">
            See what our guests are saying — and share your own experience.
          </p>
        </motion.div>

        {/* ── Rating Overview ─────────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="glass mb-10 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            {/* Big average */}
            <div className="flex flex-col items-center gap-2 sm:min-w-[140px]">
              <span className="text-5xl font-extrabold text-gold-300">
                {avg.toFixed(1)}
              </span>
              <FilledStars rating={Math.round(avg)} size={20} />
              <span className="text-sm text-chocolate-400">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Distribution bars */}
            <div className="w-full flex-1 space-y-2">
              {distribution.map((d) => (
                <div key={d.star} className="flex items-center gap-3">
                  <span className="w-8 text-right text-sm font-medium text-chocolate-200">
                    {d.star}★
                  </span>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-chocolate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.percentage}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' as const }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-400 to-gold-500"
                    />
                  </div>
                  <span className="w-8 text-xs text-chocolate-400">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Submit Review Form ──────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="glass-solid mb-10 rounded-2xl p-6 sm:p-8"
        >
          <h2 className="mb-4 text-lg font-semibold text-cream">
            Write a Review
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Stars */}
            <div>
              <label className="mb-1.5 block text-sm text-chocolate-300">
                Your Rating
              </label>
              <InteractiveStars value={rating} onChange={setRating} />
            </div>

            {rating >= 3 && (
              <div className="rounded-lg border border-gold-400/20 bg-gold-400/5 p-4">
                <p className="text-sm text-chocolate-200">
                  Thanks for your positive rating! Please continue to Google Reviews to post it publicly.
                </p>
              </div>
            )}

            {rating > 0 && rating < 3 && (
              <>
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm text-chocolate-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-chocolate-700 bg-chocolate-800/60 px-4 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-chocolate-500 focus:border-gold-400/50"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="mb-1.5 block text-sm text-chocolate-300">
                    Reason for your rating
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Tell us what went wrong and how we can improve…"
                    className="w-full resize-none rounded-lg border border-chocolate-700 bg-chocolate-800/60 px-4 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-chocolate-500 focus:border-gold-400/50"
                  />
                </div>
              </>
            )}

            {/* Error */}
            <AnimatePresence>
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm text-red-400"
                >
                  {formError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Success feedback */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 text-sm text-green-400"
                >
                  <CheckCircle size={16} />
                  Review submitted successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-2.5 text-sm font-semibold text-espresso transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-espresso border-t-transparent" />
              ) : rating >= 3 ? (
                <ExternalLink size={16} />
              ) : (
                <Send size={16} />
              )}
              {submitting
                ? 'Submitting…'
                : rating >= 3
                  ? 'Continue to Google Reviews'
                  : 'Submit Feedback'}
            </button>
          </form>
        </motion.section>

        <AnimatePresence>
          {showLowRatingPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 6 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 6 }}
                className="w-full max-w-md rounded-2xl border border-gold-400/20 bg-chocolate-950 p-5 shadow-2xl"
              >
                <h3 className="text-base font-semibold text-cream">Rating check</h3>
                <p className="mt-2 text-sm text-chocolate-300">
                  You mentioned positive feedback, but selected a low star rating. If you liked the experience, kindly consider changing your rating to 5 stars.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLowRatingPrompt(false)}
                    className="flex-1 rounded-lg border border-chocolate-700 px-4 py-2 text-sm font-medium text-chocolate-200 hover:border-chocolate-500"
                  >
                    Keep my low rating
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLowRatingPrompt(false);
                      setRating(5);
                      window.location.assign(GOOGLE_REVIEW_URL);
                    }}
                    className="flex-1 rounded-lg bg-gold-400 px-4 py-2 text-sm font-semibold text-espresso hover:bg-gold-300"
                  >
                    Change to 5 stars
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Reviews List ────────────────────────────────────── */}
        <section>
          {/* Sort pills */}
          <div className="mb-6 flex items-center gap-3">
            <ArrowUpDown size={16} className="text-chocolate-400" />
            {sortOptions.map((o) => (
              <button
                key={o.key}
                onClick={() => setSort(o.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  sort === o.key
                    ? 'bg-gold-400/15 text-gold-300'
                    : 'text-chocolate-400 hover:text-cream'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2"
            >
              {sorted.map((review, i) => (
                <motion.div key={review.id} variants={fadeUp} custom={i}>
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && sorted.length === 0 && (
            <p className="py-16 text-center text-chocolate-400">
              No reviews yet — be the first to share your experience!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
