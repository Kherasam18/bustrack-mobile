// src/store/authStore.js — Zustand auth store with AsyncStorage persistence.
//
// State shape:
//   token           — JWT string or null
//   user            — { id, name, role, school_id, phone?, employee_id? } or null
//   children        — array of linked students (Parent only): [{ id, name, class, section, roll_no }]
//   isFirstLogin    — true if parent's last_active_at was null at login time (not persisted)
//   resolvedSchool  — { id, name, code, city, state } from GET /api/schools/by-code/:code
//   isHydrated      — true after Zustand finishes rehydrating from AsyncStorage (not persisted)
//
// Persistence: only token, user, children, and resolvedSchool are persisted.
// isHydrated and isFirstLogin are ephemeral — reset on each app launch.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/storage';

// Custom storage adapter bridging Zustand persist with AsyncStorage via our wrapper
const asyncStorageAdapter = createJSONStorage(() => ({
  // Read persisted state from AsyncStorage
  getItem: async (name) => {
    const value = await getItem(name);
    return value !== null ? JSON.stringify(value) : null;
  },
  // Write state to AsyncStorage
  setItem: async (name, value) => {
    await setItem(name, JSON.parse(value));
  },
  // Remove persisted state from AsyncStorage
  removeItem: async (name) => {
    await removeItem(name);
  },
}));

// Create the auth store with persist middleware
const useAuthStore = create(
  persist(
    (set) => ({
      // -- State --
      token: null,
      user: null,
      children: [],
      isFirstLogin: false,
      resolvedSchool: null,
      isHydrated: false,

      // -- Actions --

      // Set auth state after successful login
      setAuth: ({ token, user, children, isFirstLogin }) =>
        set({
          token,
          user,
          children: children || [],
          isFirstLogin: isFirstLogin || false,
        }),

      // Persist the resolved school after code lookup
      setResolvedSchool: (school) =>
        set({ resolvedSchool: school }),

      // Mark Zustand rehydration as complete
      setHydrated: (value) =>
        set({ isHydrated: value }),

      // Clear auth state on logout — preserves resolvedSchool
      logout: () =>
        set({
          token: null,
          user: null,
          children: [],
          isFirstLogin: false,
        }),
    }),
    {
      // Persist config
      name: 'bustrack-auth',
      storage: asyncStorageAdapter,

      // Only persist auth-critical keys — isHydrated and isFirstLogin are ephemeral
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        children: state.children,
        resolvedSchool: state.resolvedSchool,
      }),

      // Signal that rehydration is complete so RootNavigator can render
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

export default useAuthStore;
