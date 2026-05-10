// src/services/locationQueue.js — Offline GPS queue backed by AsyncStorage.
// When a location update fails to send (network error), the coordinates are
// queued here. On the next successful cycle, queued items are flushed first.

import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

// Maximum number of queued items to prevent unbounded storage growth
const MAX_QUEUE_SIZE = 50;

// Add a location update to the offline queue
export async function enqueueLocation(item) {
  try {
    const queue = (await getItem(STORAGE_KEYS.LOCATION_QUEUE)) || [];

    // Drop the oldest item if the queue is at capacity
    if (queue.length >= MAX_QUEUE_SIZE) {
      queue.shift();
    }

    queue.push(item);
    await setItem(STORAGE_KEYS.LOCATION_QUEUE, queue);
  } catch {
    // Swallow errors silently — queue is best-effort
  }
}

// Retrieve all queued items and clear the queue in AsyncStorage
export async function dequeueAll() {
  try {
    const queue = (await getItem(STORAGE_KEYS.LOCATION_QUEUE)) || [];
    await setItem(STORAGE_KEYS.LOCATION_QUEUE, []);
    return queue;
  } catch {
    return [];
  }
}

// Return the current number of items in the queue
export async function getQueueLength() {
  try {
    const queue = (await getItem(STORAGE_KEYS.LOCATION_QUEUE)) || [];
    return queue.length;
  } catch {
    return 0;
  }
}
