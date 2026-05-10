// src/api/location.api.js — API wrapper for the GPS location update endpoint.
// Sends driver coordinates to the backend which writes to Firebase RTDB.
// The Axios interceptor auto-attaches the JWT — no manual auth headers.

import api from '../api/axios';

// Send a GPS location update to the backend
export async function sendLocationUpdate({ journey_id, lat, lng, speed }) {
  try {
    const response = await api.post('/api/location/update', {
      journey_id,
      lat,
      lng,
      speed,
    });
    return response.data.data;
  } catch (error) {
    // Attach the HTTP status code so callers can distinguish 409 from network errors
    const err = new Error(error.response?.data?.message || error.message);
    err.statusCode = error.response?.status || 0;
    throw err;
  }
}
