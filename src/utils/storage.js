// src/utils/storage.js — AsyncStorage wrapper utility for BusTrack Mobile.
// Provides JSON-safe get/set helpers and centralised storage key constants.
// All functions are wrapped in try/catch — getters return null on failure,
// setters rethrow with a descriptive error message.

import AsyncStorage from '@react-native-async-storage/async-storage';

// Centralised storage key constants used across the app
export const STORAGE_KEYS = Object.freeze({
  AUTH_TOKEN: '@bustrack/auth_token',
  AUTH_USER: '@bustrack/auth_user',
  AUTH_CHILDREN: '@bustrack/auth_children',
  RESOLVED_SCHOOL: '@bustrack/resolved_school',
  ACTIVE_JOURNEY_ID: 'bustrack_active_journey_id',
  LOCATION_QUEUE: 'bustrack_location_queue',
  LAST_GPS_SENT_AT: 'bustrack_last_gps_sent_at',
  DRIVER_JWT: 'bustrack_driver_jwt',
});

// Store a JSON-serialised value under the given key
export async function setItem(key, value) {
  try {
    const serialised = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialised);
  } catch (err) {
    throw new Error(`storage.setItem("${key}") failed: ${err.message}`);
  }
}

// Retrieve and parse a JSON value by key — returns null on miss or error
export async function getItem(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Remove a single key from storage
export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    throw new Error(`storage.removeItem("${key}") failed: ${err.message}`);
  }
}

// Remove multiple keys from storage in a single batch
export async function multiRemove(keys) {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (err) {
    throw new Error(`storage.multiRemove failed: ${err.message}`);
  }
}

// Wipe all data from AsyncStorage — use with extreme caution
export async function clearAll() {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    throw new Error(`storage.clearAll failed: ${err.message}`);
  }
}
