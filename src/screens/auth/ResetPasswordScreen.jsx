// src/screens/auth/ResetPasswordScreen.jsx — Reset Password screen (Step 3).
// Receives a short-lived reset_token via route params from VerifyOTPScreen.
// User enters and confirms a new password. On successful reset, an Alert
// prompts the user to log in and navigates back to ParentLogin.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { forgotPasswordReset } from '../../api/auth.api';

// Brand colour palette — consistent with other auth screens
const BRAND_PRIMARY = '#3B82F6';
const BG_COLOR = '#0F172A';
const TEXT_PRIMARY = '#F1F5F9';
const TEXT_SECONDARY = '#94A3B8';
const TEXT_MUTED = '#64748B';
const ERROR_COLOR = '#EF4444';
const INPUT_BG = '#1E293B';
const INPUT_BORDER = '#334155';

// Reset Password screen component
function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Extract the reset token passed from VerifyOTPScreen
  const { reset_token } = route.params;

  // -- Password reset state --
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');

  // Validate inputs and submit the password reset request
  async function handleResetPassword() {
    if (!newPassword || !confirmPassword || isResetting) return;

    setResetError('');

    // Client-side minimum length validation
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }

    // Client-side confirmation match validation
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setIsResetting(true);

    try {
      // Password is intentionally NOT trimmed — sent exactly as entered
      await forgotPasswordReset({
        reset_token,
        new_password: newPassword,
      });

      // Show success alert and navigate to login on dismiss
      Alert.alert(
        'Password Reset',
        'Your password has been reset successfully. Please log in.',
        [{
          text: 'Login',
          onPress: () => navigation.navigate('ParentLogin'),
        }]
      );
    } catch (err) {
      setResetError(
        err.response?.data?.message ||
        'Password reset failed. Please request a new OTP.'
      );
    } finally {
      setIsResetting(false);
    }
  }

  // Navigate back to the previous screen
  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Manual back button — navigator header is hidden */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Screen header */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your new password</Text>
          </View>

          {/* ---- Password entry section ---- */}
          <View style={styles.section}>
            {/* New password field */}
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor={TEXT_MUTED}
              secureTextEntry
              autoCapitalize="none"
              editable={!isResetting}
              returnKeyType="next"
            />

            {/* Confirm password field */}
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={TEXT_MUTED}
              secureTextEntry
              autoCapitalize="none"
              editable={!isResetting}
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
            />

            {/* Password requirements helper text */}
            <Text style={styles.helperText}>
              Password must be at least 6 characters
            </Text>

            {/* Reset Password button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!newPassword || !confirmPassword || isResetting) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleResetPassword}
              activeOpacity={0.85}
              disabled={!newPassword || !confirmPassword || isResetting}
            >
              {isResetting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            {/* Reset error message */}
            {resetError ? (
              <Text style={styles.errorText}>{resetError}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Flex fill for KeyboardAvoidingView and ScrollView
  flex: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  // ScrollView content with bottom padding for keyboard clearance
  scrollContent: {
    flexGrow: 1,
  },
  // Main container with horizontal padding
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 40,
  },
  // Manual back navigation button
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 16,
    marginBottom: 8,
  },
  // Back button text style
  backButtonText: {
    fontSize: 16,
    color: BRAND_PRIMARY,
    fontWeight: '600',
  },
  // Header area with title and subtitle
  headerContainer: {
    marginBottom: 36,
  },
  // Screen title
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  // Subtitle beneath the title
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    fontWeight: '500',
    lineHeight: 22,
  },
  // Spacing for the password entry section
  section: {
    marginBottom: 28,
  },
  // Input label
  label: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  // Text input field
  input: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  // Password requirements helper text
  helperText: {
    fontSize: 12,
    color: TEXT_MUTED,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 20,
  },
  // Primary filled action button
  primaryButton: {
    backgroundColor: BRAND_PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: BRAND_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Disabled button overlay style
  buttonDisabled: {
    opacity: 0.5,
  },
  // Primary button label
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Error message text
  errorText: {
    color: ERROR_COLOR,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 18,
  },
});

export default ResetPasswordScreen;
