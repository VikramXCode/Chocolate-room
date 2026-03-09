import { motion } from 'framer-motion';
import { Quote, Star, StarHalf } from 'lucide-react';

import type { Review } from '../types/review.types';

interface ReviewCardProps {
  review: Review;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} size={14} className="fill-gold-400 text-gold-400" />,
    );
  }
  if (hasHalf) {
    stars.push(
      <StarHalf key="half" size={14} className="fill-gold-400 text-gold-400" />,
    );
  }
  const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    stars.push(
      <Star key={`empty-${i}`} size={14} className="text-chocolate-600" />,
    );
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.avatar ?? getInitials(review.customerName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ borderColor: 'rgba(212,175,55,0.2)' }}
      className={`glass rounded-xl p-5 transition-colors ${
        review.highlighted ? 'border-gold-400/10 bg-gold-400/[0.03]' : ''
      }`}
    >
      {/* Top: avatar + name + date */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300/20 to-gold-500/20 text-sm font-bold text-gold-300">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-cream">{review.customerName}</p>
            {review.highlighted && (
              <span className="badge bg-gold-400/15 text-gold-300 text-[10px]">Featured</span>
            )}
          </div>
          <p className="text-xs text-chocolate-400">{formatDate(review.date)}</p>
        </div>
      </div>

      {/* Star rating */}
      <div className="mt-3">
        <StarRating rating={review.rating} />
      </div>

      {/* Comment */}
      <div className="mt-3 flex gap-2">
        <Quote size={14} className="mt-0.5 flex-shrink-0 text-gold-400/40" />
        <p className="text-sm italic leading-relaxed text-chocolate-200">{review.comment}</p>
      </div>
    </motion.div>
  );
}
