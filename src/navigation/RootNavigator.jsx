// src/navigation/RootNavigator.jsx — Root navigator that reads Zustand auth state
// and conditionally renders the correct navigator stack. Wraps all navigation in a
// single NavigationContainer (this is the only instance in the entire app).

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Auth state store
import useAuthStore from '../store/authStore';

// Role constants for the mobile app
import { ROLES } from '../utils/roles';

// Sub-navigators
import AuthNavigator from './AuthNavigator';
import DriverNavigator from './DriverNavigator';
import ParentNavigator from './ParentNavigator';

// Loading state component
import LoadingOverlay from '../components/shared/LoadingOverlay';

/**
 * RootNavigator — reads auth hydration state and routes to the correct navigator.
 *
 * Routing logic:
 * 1. If Zustand hasn't finished rehydrating → show LoadingOverlay
 * 2. If authenticated as DRIVER → DriverNavigator
 * 3. If authenticated as PARENT → ParentNavigator
 * 4. If authenticated with an unexpected role → force logout, show AuthNavigator
 * 5. If no token → AuthNavigator
 */
function RootNavigator() {
  // Read auth state from Zustand
  const { token, user, isHydrated, logout } = useAuthStore();

  // Wait for Zustand to finish reading AsyncStorage
  if (!isHydrated) {
    return <LoadingOverlay message="Starting up..." />;
  }

  // Determine which navigator to render based on auth state
  const renderNavigator = () => {
    // Unauthenticated — show login flow
    if (!token || !user) {
      return <AuthNavigator />;
    }

    // Authenticated — route by role
    switch (user.role) {
      case ROLES.DRIVER:
        return <DriverNavigator />;

      case ROLES.PARENT:
        return <ParentNavigator />;

      default:
        // Safety fallback — mobile app only supports Driver and Parent roles.
        // Force logout to clear invalid session and show the auth flow.
        logout();
        return <AuthNavigator />;
    }
  };

  return (
    <NavigationContainer>
      {renderNavigator()}
    </NavigationContainer>
  );
}

export default RootNavigator;
