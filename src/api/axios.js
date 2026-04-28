// src/api/axios.js — Pre-configured Axios instance for BusTrack Mobile.
//
// Features:
//   - Base URL from EXPO_PUBLIC_API_URL env var (falls back to localhost for dev)
//   - 15-second request timeout
//   - Request interceptor: attaches JWT from Zustand auth store
//   - Response interceptor: auto-logout on 401 (token expired / invalid)
//     Navigation is NOT handled here — RootNavigator watches token reactively.

import axios from 'axios';
import useAuthStore from '../store/authStore';

// Base URL for all API requests — set EXPO_PUBLIC_API_URL in .env for production
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Create a shared Axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT bearer token if available
api.interceptors.request.use(
  (config) => {
    // Read token from Zustand outside of React (getState, not the hook)
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 by clearing auth state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout on 401 — stale or invalid token
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    // Always rethrow so callers can handle the error
    return Promise.reject(error);
  }
);

export default api;
