// src/utils/formatTime.js — Time formatting utilities for journey timestamps.
// All functions use vanilla JS Date — no external date libraries.
// All functions handle null, undefined, and invalid date strings gracefully.

/**
 * Safely parse an ISO string into a Date object.
 * Returns null if the input is falsy or produces an invalid Date.
 */
function safeParse(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return null;
  return date;
}

/**
 * Format an ISO timestamp to "HH:MM AM/PM".
 * Returns "--:--" if the input is null, undefined, or invalid.
 */
export function formatTime(isoString) {
  const date = safeParse(isoString);
  if (!date) return '--:--';

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert 24h to 12h format
  hours = hours % 12;
  if (hours === 0) hours = 12;

  // Pad minutes with leading zero
  const paddedMinutes = String(minutes).padStart(2, '0');

  return `${hours}:${paddedMinutes} ${period}`;
}

/**
 * Format a duration between two ISO timestamps as "Xh Ym".
 * Returns "In progress" if endIso is null/undefined/invalid.
 * Returns "" if startIso is also null/undefined/invalid.
 */
export function formatDuration(startIso, endIso) {
  const startDate = safeParse(startIso);
  if (!startDate) return '';

  const endDate = safeParse(endIso);
  if (!endDate) return 'In progress';

  // Calculate the difference in milliseconds
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) return '';

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

/**
 * Format an ISO timestamp to "Mon, DD MMM YYYY".
 * Returns "" if the input is null, undefined, or invalid.
 */
export function formatDate(isoString) {
  const date = safeParse(isoString);
  if (!date) return '';

  // Day-of-week abbreviations
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Month abbreviations
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

/**
 * Get a human-readable relative time string from an ISO timestamp.
 * Returns "X min ago", "X hrs ago", "X days ago", or "Just now".
 * Returns "" if the input is null, undefined, or invalid.
 */
export function getRelativeTime(isoString) {
  const date = safeParse(isoString);
  if (!date) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Future timestamps
  if (diffMs < 0) return 'Just now';

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Less than 1 minute
  if (diffMinutes < 1) return 'Just now';

  // Less than 1 hour
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 min ago' : `${diffMinutes} min ago`;
  }

  // Less than 24 hours
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hr ago' : `${diffHours} hrs ago`;
  }

  // Days
  return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
}
