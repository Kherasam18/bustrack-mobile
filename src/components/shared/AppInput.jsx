// src/components/shared/AppInput.jsx — Reusable themed text input component
// used across driver and parent screens. Provides consistent styling with
// optional label, error message, and disabled state support.

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * AppInput — themed text input with label and error display.
 * @param {string} label — Optional label above the input
 * @param {string} value — Current input value
 * @param {function} onChangeText — Text change handler
 * @param {string} placeholder — Placeholder text
 * @param {string} error — Error message to display below the input
 * @param {boolean} disabled — Disables the input
 * @param {boolean} secureTextEntry — Masks input for passwords
 * @param {string} keyboardType — Keyboard layout type
 * @param {string} autoCapitalize — Auto-capitalisation behaviour
 * @param {number} maxLength — Maximum character length
 * @param {object} style — Additional container styles (merged)
 * @param {object} inputStyle — Additional input styles (merged)
 */
function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  style,
  inputStyle,
  ...rest
}) {
  return (
    <View style={[styles.container, style]}>
      {/* Optional label */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Text input field */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        editable={!disabled}
        style={[
          styles.input,
          // Visual feedback for error state
          error && styles.inputError,
          // Reduced opacity when disabled
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        {...rest}
      />

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Wrapper container with bottom margin
  container: {
    width: '100%',
    marginBottom: 16,
  },
  // Label above the input
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  // Input field styling — dark theme
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  // Red border for error state
  inputError: {
    borderColor: '#EF4444',
  },
  // Reduced opacity when disabled
  inputDisabled: {
    opacity: 0.5,
  },
  // Error message text
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
});

export default AppInput;
