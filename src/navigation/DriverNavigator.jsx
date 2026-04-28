// src/navigation/DriverNavigator.jsx — Placeholder stack navigator for authenticated
// drivers. Will be replaced with the full driver tab/stack layout in Phase 10.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Inline placeholder for the driver home screen (Phase 10)
function DriverHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Driver Home — Phase 10</Text>
    </View>
  );
}

// Create the driver stack navigator
const Stack = createNativeStackNavigator();

// Default screen options — no header
const screenOptions = { headerShown: false };

/**
 * DriverNavigator — authenticated driver flow.
 * Currently a single placeholder screen; expanded in Phase 10.
 */
function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  text: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
});

export default DriverNavigator;
