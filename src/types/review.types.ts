export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  flagged?: boolean;
  highlighted?: boolean;
  avatar?: string;
}

export interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}
