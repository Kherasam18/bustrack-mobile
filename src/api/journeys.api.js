// src/api/journeys.api.js — Journey API service for the driver mobile app.
// All functions use the shared Axios instance with JWT auto-attach.
// Errors are caught, cleaned, and re-thrown as plain Error objects
// so callers receive a human-readable message string.

import api from './axios';

// Fetch the driver's journeys for today (0, 1, or 2 items)
export async function getMyTodayJourneys() {
  try {
    const response = await api.get('/api/journeys/my-today');
    return response.data.data.journeys;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// Start the morning pickup journey
export async function startPickup() {
  try {
    const response = await api.post('/api/journeys/start-pickup', {});
    return response.data.data.journey;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// Mark arrival at school (transitions PICKUP_STARTED → ARRIVED_SCHOOL)
export async function arrivedAtSchool() {
  try {
    const response = await api.post('/api/journeys/arrived-school', {});
    return response.data.data.journey;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// Start the afternoon drop journey
export async function startDrop() {
  try {
    const response = await api.post('/api/journeys/start-drop', {});
    return response.data.data.journey;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// End the drop journey (marks the day complete)
export async function endJourney() {
  try {
    const response = await api.post('/api/journeys/end-journey', {});
    return response.data.data.journey;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}
