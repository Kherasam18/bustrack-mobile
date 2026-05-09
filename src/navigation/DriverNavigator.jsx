// src/navigation/DriverNavigator.jsx — Bottom tab navigator for authenticated
// drivers. Two tabs: Home (DriverHomeScreen) and Profile (placeholder for
// Phase 10c). Replaces the previous single-screen placeholder stack.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

// Theme colours matching the app design
const COLORS = {
  bg: '#0F172A',
  tabBg: '#1E293B',
  active: '#2563EB',
  inactive: '#6B7280',
  border: '#334155',
  textMuted: '#94A3B8',
};

// Inline placeholder for the profile tab (Phase 10c)
function DriverProfilePlaceholder() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.icon}>👤</Text>
      <Text style={placeholderStyles.text}>Profile — Coming in Phase 10c</Text>
    </View>
  );
}

// Placeholder screen styles
const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});

/**
 * DriverNavigator — bottom tab navigator with Home and Profile tabs.
 */
function DriverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* Home tab — main driver screen */}
      <Tab.Screen
        name="DriverHome"
        component={DriverHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🏠</Text>
          ),
        }}
      />

      {/* Profile tab — placeholder until Phase 10c */}
      <Tab.Screen
        name="DriverProfile"
        component={DriverProfilePlaceholder}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // Tab bar container styling
  tabBar: {
    backgroundColor: COLORS.tabBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  // Tab label text
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Tab icon text (emoji)
  tabIcon: {
    fontSize: 22,
  },
});

export default DriverNavigator;
