// src/utils/trackingStatus.js — Derives a human-readable GPS tracking status
// from the timestamp of the last successful location update. Used by
// TrackingBadge to display real-time signal quality to the driver.

// Frozen enum of possible tracking states
export const TRACKING_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  WEAK: 'WEAK',
  LOST: 'LOST',
});

// Thresholds matching the Phase 5b backend cron job (in milliseconds)
const ONE_MINUTE_MS = 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

// Derive tracking status from the last successful GPS send timestamp
export function getTrackingStatus(lastSentAt) {
  if (lastSentAt === null || lastSentAt === undefined) {
    return null;
  }

  const sentDate = lastSentAt instanceof Date ? lastSentAt : new Date(lastSentAt);
  const elapsedMs = Date.now() - sentDate.getTime();

  // Less than 1 minute — strong signal
  if (elapsedMs < ONE_MINUTE_MS) {
    return TRACKING_STATUS.ACTIVE;
  }

  // Between 1 and 5 minutes — degraded signal
  if (elapsedMs < FIVE_MINUTES_MS) {
    return TRACKING_STATUS.WEAK;
  }

  // More than 5 minutes — signal lost
  return TRACKING_STATUS.LOST;
}

// Map tracking status to a hex colour for visual indicators
export function getTrackingStatusColor(status) {
  switch (status) {
    case TRACKING_STATUS.ACTIVE:
      return '#16A34A';
    case TRACKING_STATUS.WEAK:
      return '#D97706';
    case TRACKING_STATUS.LOST:
      return '#DC2626';
    default:
      return '#6B7280';
  }
}

// Map tracking status to a human-readable label
export function getTrackingStatusLabel(status) {
  switch (status) {
    case TRACKING_STATUS.ACTIVE:
      return 'GPS Active';
    case TRACKING_STATUS.WEAK:
      return 'GPS Weak';
    case TRACKING_STATUS.LOST:
      return 'GPS Lost';
    default:
      return 'GPS Off';
  }
}
