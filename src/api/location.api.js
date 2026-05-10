// src/api/location.api.js — API wrapper for the GPS location update endpoint.
// Sends driver coordinates to the backend which writes to Firebase RTDB.
// Accepts an optional token parameter for background context where Zustand
// is not hydrated — the Axios interceptor is bypassed when a token is provided.

import api from '../api/axios';

// Send a GPS location update to the backend
export async function sendLocationUpdate({ journey_id, lat, lng, speed }, token = null) {
  try {
    // Build headers — use explicit token if provided (background context),
    // otherwise let the Axios interceptor handle it (foreground context)
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await api.post(
      '/api/location/update',
      { journey_id, lat, lng, speed },
      { headers }
    );
    return response.data.data;
  } catch (error) {
    // Attach the HTTP status code so callers can distinguish 409 from network errors
    const err = new Error(error.response?.data?.message || error.message);
    err.statusCode = error.response?.status || 0;
    throw err;
  }
}
