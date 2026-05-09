// src/screens/auth/VerifyOTPScreen.jsx — OTP Verification screen (Step 2).
// Receives phone, school_id, and maskedPhone via route params from
// ForgotPasswordScreen. User enters the 6-digit OTP received via SMS.
// On successful verification, navigates to ResetPasswordScreen passing
// the short-lived resetToken as a route param.

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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  forgotPasswordVerifyOTP,
  forgotPasswordSendOTP,
} from '../../api/auth.api';

// Brand colour palette — consistent with other auth screens
const BRAND_PRIMARY = '#3B82F6';
const BG_COLOR = '#0F172A';
const TEXT_PRIMARY = '#F1F5F9';
const TEXT_SECONDARY = '#94A3B8';
const TEXT_MUTED = '#64748B';
const ERROR_COLOR = '#EF4444';
const SUCCESS_COLOR = '#22C55E';
const INPUT_BG = '#1E293B';
const INPUT_BORDER = '#334155';

// Verify OTP screen component
function VerifyOTPScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Extract route params passed from ForgotPasswordScreen
  const { phone, school_id, maskedPhone } = route.params;

  // -- OTP verification state --
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // -- Resend OTP state --
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Verify the OTP entered by the user
  async function handleVerifyOTP() {
    if (otp.trim().length < 6 || isVerifying) return;

    setVerifyError('');
    setResendMessage('');
    setIsVerifying(true);

    try {
      // Submit OTP for verification — returns a short-lived reset token
      const data = await forgotPasswordVerifyOTP({
        phone,
        school_id,
        otp: otp.trim(),
      });

      // Navigate to the password reset screen with the token
      navigation.navigate('ResetPassword', {
        reset_token: data.resetToken,
      });
    } catch (err) {
      setVerifyError(
        err.response?.data?.message ||
        'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  }

  // Resend a fresh OTP to the same phone number
  async function handleResendOTP() {
    if (isResending) return;

    setVerifyError('');
    setResendMessage('');
    setIsResending(true);

    try {
      await forgotPasswordSendOTP({ phone, school_id });

      // Clear stale OTP input and show confirmation
      setOtp('');
      setResendMessage('OTP resent successfully');
    } catch (_err) {
      setVerifyError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
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
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your phone
            </Text>
          </View>

          {/* Masked phone info text */}
          <Text style={styles.maskedPhoneText}>
            OTP sent to {maskedPhone}
          </Text>

          {/* ---- OTP entry section ---- */}
          <View style={styles.section}>
            {/* Large centred OTP input */}
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="------"
              placeholderTextColor={TEXT_MUTED}
              keyboardType="number-pad"
              maxLength={6}
              autoCapitalize="none"
              editable={!isVerifying}
              returnKeyType="done"
              onSubmitEditing={handleVerifyOTP}
            />

            {/* Verify OTP button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (otp.trim().length < 6 || isVerifying) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleVerifyOTP}
              activeOpacity={0.85}
              disabled={otp.trim().length < 6 || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            {/* Verification error message */}
            {verifyError ? (
              <Text style={styles.errorText}>{verifyError}</Text>
            ) : null}

            {/* Resend OTP link */}
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOTP}
              activeOpacity={0.7}
              disabled={isResending}
            >
              {isResending ? (
                <ActivityIndicator size="small" color={BRAND_PRIMARY} />
              ) : (
                <Text style={styles.resendButtonText}>Resend OTP</Text>
              )}
            </TouchableOpacity>

            {/* Resend success confirmation */}
            {resendMessage ? (
              <Text style={styles.resendSuccessText}>{resendMessage}</Text>
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
    marginBottom: 12,
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
  // Masked phone info line
  maskedPhoneText: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '500',
  },
  // Spacing for the OTP entry section
  section: {
    marginBottom: 28,
    alignItems: 'center',
  },
  // Large centred OTP input for visual prominence
  otpInput: {
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 24,
    letterSpacing: 8,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 24,
    width: '100%',
    fontWeight: '700',
  },
  // Primary filled action button
  primaryButton: {
    backgroundColor: BRAND_PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    width: '100%',
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
    textAlign: 'center',
  },
  // Resend OTP touchable area
  resendButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Resend OTP link text
  resendButtonText: {
    fontSize: 14,
    color: BRAND_PRIMARY,
    fontWeight: '600',
  },
  // Resend success confirmation text
  resendSuccessText: {
    color: SUCCESS_COLOR,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default VerifyOTPScreen;
