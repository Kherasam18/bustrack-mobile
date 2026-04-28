// src/navigation/AuthNavigator.jsx — Stack navigator for unauthenticated users.
// RoleSelect (LoginScreen) is the entry point. Screens 2–6 are inline placeholders
// that will be replaced with real implementations in later phases.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Real screen import
import LoginScreen from '../screens/auth/LoginScreen';

// Shared placeholder style
const placeholderStyles = StyleSheet.create({
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

// -- Inline placeholder screens (to be replaced in Phases 9b–9d) --

// Placeholder for the driver login form (Phase 9b)
function DriverLoginScreen() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>Driver Login — Phase 9b</Text>
    </View>
  );
}

// Placeholder for the parent login form (Phase 9c)
function ParentLoginScreen() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>Parent Login — Phase 9c</Text>
    </View>
  );
}

// Placeholder for the forgot password screen (Phase 9d)
function ForgotPasswordScreen() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>Forgot Password — Phase 9d</Text>
    </View>
  );
}

// Placeholder for OTP verification screen (Phase 9d)
function VerifyOTPScreen() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>Verify OTP — Phase 9d</Text>
    </View>
  );
}

// Placeholder for password reset screen (Phase 9d)
function ResetPasswordScreen() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.text}>Reset Password — Phase 9d</Text>
    </View>
  );
}

// Create the auth stack navigator
const Stack = createNativeStackNavigator();

// Default screen options — hide header on all auth screens
const screenOptions = { headerShown: false };

/**
 * AuthNavigator — unauthenticated user flow.
 * RoleSelect → DriverLogin / ParentLogin, plus password recovery screens.
 */
function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="RoleSelect" screenOptions={screenOptions}>
      {/* Entry point — role selection */}
      <Stack.Screen name="RoleSelect" component={LoginScreen} />

      {/* Login forms */}
      <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
      <Stack.Screen name="ParentLogin" component={ParentLoginScreen} />

      {/* Password recovery flow */}
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
