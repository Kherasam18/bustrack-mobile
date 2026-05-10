// src/services/backgroundLocation.js — Core GPS broadcasting engine for the
// driver app. Defines an Expo background location task at module load time
// (CRITICAL: TaskManager.defineTask must be at top level, not inside a function).
// The background task reads journey_id from AsyncStorage because Zustand state
// is not available in the background JS context.

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/storage';
import { sendLocationUpdate } from '../api/location.api';
import { enqueueLocation, dequeueAll } from './locationQueue';

// Background task name registered with Expo
export const LOCATION_TASK_NAME = 'bustrack-gps-task';

// Flush queued location updates before sending the current one
async function flushLocationQueue(currentJourneyId) {
  try {
    const queue = await dequeueAll();
    if (!queue || queue.length === 0) return;

    // Process in order — stop on first failure to preserve ordering
    for (let i = 0; i < queue.length; i++) {
      try {
        await sendLocationUpdate({
          journey_id: queue[i].journey_id,
          lat: queue[i].lat,
          lng: queue[i].lng,
          speed: queue[i].speed,
        });
      } catch {
        // Re-enqueue the failed item and all remaining items
        for (let j = i; j < queue.length; j++) {
          await enqueueLocation(queue[j]);
        }
        return;
      }
    }
  } catch {
    // Swallow all errors — queue flush is best-effort
  }
}

// CRITICAL: Define the background task at module load time
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  // Bail on Expo-reported errors
  if (error) return;

  // Bail if no location data
  if (!data || !data.locations || data.locations.length === 0) return;

  // Take the most recent location from the batch
  const location = data.locations[data.locations.length - 1];
  const lat = location.coords.latitude;
  const lng = location.coords.longitude;

  // Normalise speed — send null if negative or absent
  const rawSpeed = location.coords.speed;
  const speed = rawSpeed !== null && rawSpeed !== undefined && rawSpeed >= 0
    ? rawSpeed
    : null;

  // Read the active journey ID from AsyncStorage (not Zustand)
  const journeyId = await getItem(STORAGE_KEYS.ACTIVE_JOURNEY_ID);
  if (!journeyId) return;

  // Flush any previously queued updates first
  await flushLocationQueue(journeyId);

  // Send the current location update
  try {
    await sendLocationUpdate({ journey_id: journeyId, lat, lng, speed });
    await setItem(STORAGE_KEYS.LAST_GPS_SENT_AT, new Date().toISOString());
  } catch (err) {
    // 409 means the journey is no longer active — stop broadcasting
    if (err.statusCode === 409) {
      await stopLocationBroadcasting();
      return;
    }

    // Any other error — enqueue for retry on the next cycle
    try {
      await enqueueLocation({
        journey_id: journeyId,
        lat,
        lng,
        speed,
        queued_at: new Date().toISOString(),
      });
    } catch {
      // Swallow enqueue errors silently
    }
  }
});

// Start background GPS broadcasting for the given journey
export async function startLocationBroadcasting(journeyId) {
  // Persist journey ID so the background task can read it
  await setItem(STORAGE_KEYS.ACTIVE_JOURNEY_ID, journeyId);

  // Request foreground location permissions
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') {
    throw new Error('Location permission denied');
  }

  // Request background location permissions
  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== 'granted') {
    throw new Error('Background location permission denied');
  }

  // Start the background location task
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: 15000,
    distanceInterval: 10,
    foregroundService: {
      notificationTitle: 'BusTrack GPS',
      notificationBody: 'Tracking your route for school safety',
      notificationColor: '#2563EB',
    },
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
  });
}

// Stop background GPS broadcasting and clean up persisted state
export async function stopLocationBroadcasting() {
  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isRunning) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch {
    // Swallow errors — this is cleanup code
  }

  try {
    await removeItem(STORAGE_KEYS.ACTIVE_JOURNEY_ID);
  } catch {
    // Swallow errors — this is cleanup code
  }
}

// Check whether the background GPS task is currently running
export async function isLocationBroadcastingActive() {
  try {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  } catch {
    return false;
  }
}
