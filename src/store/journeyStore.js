// src/store/journeyStore.js — Zustand store for driver journey state.
// NOT persisted to AsyncStorage — journey data is fetched fresh on every
// app mount from GET /api/journeys/my-today.

import { create } from 'zustand';

// Create the journey store without persistence
const useJourneyStore = create((set) => ({
  // -- State --
  journeys: [],
  isLoading: false,
  error: null,

  // -- Actions --

  // Replace the journeys array with fresh data
  setJourneys: (journeys) => set({ journeys }),

  // Toggle loading state for initial fetch / refresh
  setLoading: (isLoading) => set({ isLoading }),

  // Set or clear the error message
  setError: (error) => set({ error }),

  // Reset journey state (used on logout or screen unmount)
  clearJourneys: () => set({ journeys: [], error: null }),
}));

// -- Derived selectors (computed from state, not stored) --

// Get the PICKUP journey from today's journeys array, or null
export const getPickupJourney = (state) =>
  state.journeys.find((j) => j.journey_type === 'PICKUP') || null;

// Get the DROP journey from today's journeys array, or null
export const getDropJourney = (state) =>
  state.journeys.find((j) => j.journey_type === 'DROP') || null;

export default useJourneyStore;
