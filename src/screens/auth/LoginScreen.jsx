// src/screens/auth/LoginScreen.jsx — Role selection screen (entry point for
// unauthenticated users). Lets the user choose whether they are a Driver or
// Parent, then navigates to the corresponding login form. No state management
// or API calls — navigation only.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

// Brand colour palette
const BRAND_PRIMARY = '#3B82F6';
const BRAND_PRIMARY_DARK = '#2563EB';
const BG_COLOR = '#0F172A';
const SURFACE_COLOR = '#1E293B';
const TEXT_PRIMARY = '#F1F5F9';
const TEXT_SECONDARY = '#94A3B8';
const TEXT_MUTED = '#64748B';

/**
 * LoginScreen — role selection entry point.
 * Navigates to DriverLogin or ParentLogin based on user choice.
 */
function LoginScreen({ navigation }) {
  // Navigate to the driver login form
  function handleDriverPress() {
    navigation.navigate('DriverLogin');
  }

  // Navigate to the parent login form
  function handleParentPress() {
    navigation.navigate('ParentLogin');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />

      {/* Top spacer to push content toward centre */}
      <View style={styles.spacer} />

      {/* App branding */}
      <View style={styles.brandingContainer}>
        {/* Logo placeholder — will be replaced with an image asset later */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🚌</Text>
        </View>
        <Text style={styles.appName}>BusTrack</Text>
        <Text style={styles.subtitle}>School Bus Tracking</Text>
      </View>

      {/* Role selection buttons */}
      <View style={styles.buttonGroup}>
        {/* Primary button — Driver */}
        <TouchableOpacity
          style={styles.driverButton}
          activeOpacity={0.85}
          onPress={handleDriverPress}
        >
          <Text style={styles.driverButtonText}>I'm a Driver</Text>
        </TouchableOpacity>

        {/* Outlined secondary button — Parent */}
        <TouchableOpacity
          style={styles.parentButton}
          activeOpacity={0.85}
          onPress={handleParentPress}
        >
          <Text style={styles.parentButtonText}>I'm a Parent</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom helper text */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Contact your school for login credentials
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen dark background, centred content
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingHorizontal: 32,
  },
  // Flexible top spacer pushes branding toward vertical centre
  spacer: {
    flex: 1,
  },
  // Centred branding block
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  // Circular logo placeholder
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SURFACE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Emoji stand-in for the logo asset
  logoIcon: {
    fontSize: 36,
  },
  // App title
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: 1,
    marginBottom: 6,
  },
  // Tagline beneath the title
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Vertically stacked button group
  buttonGroup: {
    gap: 14,
    marginBottom: 32,
  },
  // Filled primary button for Driver
  driverButton: {
    backgroundColor: BRAND_PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: BRAND_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Driver button label
  driverButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Outlined secondary button for Parent
  parentButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BRAND_PRIMARY,
  },
  // Parent button label
  parentButtonText: {
    color: BRAND_PRIMARY,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Bottom footer area
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  // Muted helper text
  footerText: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;
