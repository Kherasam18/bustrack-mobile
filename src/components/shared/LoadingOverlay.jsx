// src/components/shared/LoadingOverlay.jsx — Full-screen loading spinner shown while
// Zustand rehydrates auth state from AsyncStorage. Accepts an optional `message` prop
// to override the default "Loading..." label.

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

// Primary brand colour used for the spinner
const BRAND_COLOR = '#3B82F6';

// Dark background matching the app theme
const BG_COLOR = '#0F172A';

/**
 * LoadingOverlay — renders a full-screen centred spinner with an optional text label.
 * @param {object} props
 * @param {string} [props.message='Loading...'] — text displayed below the spinner
 */
function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <View style={styles.container}>
      {/* Centred activity indicator */}
      <ActivityIndicator size="large" color={BRAND_COLOR} />

      {/* Optional descriptive label */}
      {message ? <Text style={styles.label}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen centred container
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_COLOR,
  },
  // Subtle label beneath the spinner
  label: {
    marginTop: 16,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default LoadingOverlay;
