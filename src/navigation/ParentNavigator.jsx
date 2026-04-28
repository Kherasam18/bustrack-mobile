// src/navigation/ParentNavigator.jsx — Placeholder stack navigator for authenticated
// parents. Will be replaced with the full parent tab/stack layout in Phase 11.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Inline placeholder for the parent home screen (Phase 11)
function ParentHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Parent Home — Phase 11</Text>
    </View>
  );
}

// Create the parent stack navigator
const Stack = createNativeStackNavigator();

// Default screen options — no header
const screenOptions = { headerShown: false };

/**
 * ParentNavigator — authenticated parent flow.
 * Currently a single placeholder screen; expanded in Phase 11.
 */
function ParentNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ParentHome" component={ParentHomeScreen} />
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

export default ParentNavigator;
