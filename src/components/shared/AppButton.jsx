// src/components/shared/AppButton.jsx — Reusable themed button component
// used across driver and parent screens. Supports primary, secondary,
// danger, and outline variants with built-in loading state.

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// Variant colour definitions
const VARIANTS = {
  primary: {
    backgroundColor: '#2563EB',
    textColor: '#FFFFFF',
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: '#6B7280',
    textColor: '#FFFFFF',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: '#DC2626',
    textColor: '#FFFFFF',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    textColor: '#2563EB',
    borderColor: '#2563EB',
  },
};

/**
 * AppButton — themed button with loading and disabled states.
 * @param {string} title — Button label text
 * @param {function} onPress — Press handler
 * @param {boolean} disabled — Disables the button
 * @param {boolean} loading — Shows ActivityIndicator and forces disabled
 * @param {string} variant — Visual variant: primary | secondary | danger | outline
 * @param {object} style — Additional container styles (merged)
 */
function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}) {
  // Resolve variant colours with fallback to primary
  const variantConfig = VARIANTS[variant] || VARIANTS.primary;

  // Force disabled when loading
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: variantConfig.backgroundColor,
          borderColor: variantConfig.borderColor,
        },
        // Outline variant needs a visible border
        variant === 'outline' && styles.outlineBorder,
        // Reduce opacity when disabled
        isDisabled && styles.disabled,
        // Merge custom styles last
        style,
      ]}
    >
      {loading ? (
        // Show spinner in place of text during loading
        <ActivityIndicator
          size="small"
          color={variantConfig.textColor}
        />
      ) : (
        <Text style={[styles.text, { color: variantConfig.textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Full-width button container
  container: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  // Outline variant border
  outlineBorder: {
    borderWidth: 1.5,
  },
  // Reduced opacity for disabled state
  disabled: {
    opacity: 0.5,
  },
  // Button label text
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default AppButton;
