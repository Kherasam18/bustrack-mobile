// src/components/driver/JourneyButton.jsx — Large full-width action button
// for journey state transitions (start-pickup, arrived-school, start-drop,
// end-journey). Each action gets a unique colour, icon, and label.

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// Action configuration map — label, icon, and colour for each journey action
const ACTION_CONFIG = {
  'start-pickup': {
    label: 'Start Pickup',
    icon: '🚌',
    backgroundColor: '#16A34A',
    textColor: '#FFFFFF',
  },
  'arrived-school': {
    label: 'Arrived at School',
    icon: '🏫',
    backgroundColor: '#D97706',
    textColor: '#FFFFFF',
  },
  'start-drop': {
    label: 'Start Drop',
    icon: '🏠',
    backgroundColor: '#2563EB',
    textColor: '#FFFFFF',
  },
  'end-journey': {
    label: 'End Journey',
    icon: '✅',
    backgroundColor: '#DC2626',
    textColor: '#FFFFFF',
  },
};

/**
 * JourneyButton — large action button for driver journey transitions.
 * @param {string} action — Journey action key (start-pickup | arrived-school | start-drop | end-journey)
 * @param {function} onPress — Press handler
 * @param {boolean} loading — Shows ActivityIndicator and forces disabled
 * @param {boolean} disabled — Disables the button
 */
function JourneyButton({ action, onPress, loading = false, disabled = false }) {
  // Resolve action configuration with fallback
  const config = ACTION_CONFIG[action] || ACTION_CONFIG['start-pickup'];

  // Force disabled when loading
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor },
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        // Show spinner in place of label during loading
        <ActivityIndicator size="large" color={config.textColor} />
      ) : (
        <Text style={[styles.label, { color: config.textColor }]}>
          {config.icon}  {config.label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Full-width button with large tap target
  container: {
    width: '100%',
    minHeight: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  // Reduced opacity for disabled state
  disabled: {
    opacity: 0.5,
  },
  // Large readable label with icon
  label: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default JourneyButton;
