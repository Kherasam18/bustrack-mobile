// src/App.jsx — Root component for the BusTrack mobile application.
// Wraps the entire app in SafeAreaProvider for safe-area inset support.
// NavigationContainer is inside RootNavigator — not duplicated here.

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Root navigator handles auth state routing and NavigationContainer
import RootNavigator from './navigation/RootNavigator';

/**
 * App — top-level component rendered by Expo's entry point.
 */
function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
