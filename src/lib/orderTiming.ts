export function calculateTotalPrepTime(items: { prepTimeMinutes?: number }[]): number {
  if (!items || items.length === 0) return 15; // default 15 mins
  // The total time could be the maximum prep time of any item, or sum depending on kitchen capacity.
  // Generally, returning the maximum (longest dish dictates the order) + maybe a small buffer is better.
  const times = items.map(i => i.prepTimeMinutes || 10);
  return Math.max(...times);
}

export function getOrderLateness(createdAt: string, targetReadyTime?: string, prepStartedAt?: string): { isLate: boolean; minutesRemaining: number; label: string; status: 'good' | 'warning' | 'late' | 'done' } {
  const now = new Date();
  
  if (!targetReadyTime) {
    // If no target time is assigned, fall back to relative
    return { isLate: false, minutesRemaining: 0, label: 'Unknown', status: 'good'};
  }

  const target = new Date(targetReadyTime);
  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0) {
    return {
      isLate: true,
      minutesRemaining: Math.abs(diffMins),
      label: `${Math.abs(diffMins)}m LATE`,
      status: 'late'
    };
  } else if (diffMins <= 5) {
    return {
      isLate: false,
      minutesRemaining: diffMins,
      label: `Due in ${diffMins}m`,
      status: 'warning'
    };
  } else {
    return {
      isLate: false,
      minutesRemaining: diffMins,
      label: `${diffMins}m left`,
      status: 'good'
    };
  }
}
