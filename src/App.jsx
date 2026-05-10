// src/App.jsx — Root component for the BusTrack mobile application.
// Wraps the entire app in SafeAreaProvider for safe-area inset support.
// NavigationContainer is inside RootNavigator — not duplicated here.
// registerRootComponent ensures the component is registered correctly
// for both Expo Go and custom dev client builds.

import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import './services/backgroundLocation';

// Root component rendered by Expo's entry point
function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

// registerRootComponent handles AppRegistry.registerComponent internally
registerRootComponent(App);