// src/navigation/AuthNavigator.jsx — Stack navigator for unauthenticated users.
// Handles role selection, login forms, and the three-step password recovery flow.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen imports
import LoginScreen from '../screens/auth/LoginScreen';
import DriverLoginScreen from '../screens/auth/DriverLoginScreen';
import ParentLoginScreen from '../screens/auth/ParentLoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyOTPScreen from '../screens/auth/VerifyOTPScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';


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
