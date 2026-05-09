// src/screens/auth/ForgotPasswordScreen.jsx — Forgot Password screen (Step 1).
// Collects the parent's school code and registered phone number, then sends
// a password-reset OTP via MSG91. On success, navigates to VerifyOTPScreen
// passing phone, school_id, and maskedPhone as route params.

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
import { useNavigation } from '@react-navigation/native';
import { getSchoolByCode, forgotPasswordSendOTP } from '../../api/auth.api';

// Brand colour palette — consistent with DriverLoginScreen and ParentLoginScreen
const BRAND_PRIMARY = '#3B82F6';
const BG_COLOR = '#0F172A';
const TEXT_PRIMARY = '#F1F5F9';
const TEXT_SECONDARY = '#94A3B8';
const TEXT_MUTED = '#64748B';
const ERROR_COLOR = '#EF4444';
const SUCCESS_SURFACE = '#0F2A1E';
const SUCCESS_BORDER = '#22C55E';
const INPUT_BG = '#1E293B';
const INPUT_BORDER = '#334155';

// Regex for 10-digit phone validation
const PHONE_REGEX = /^\d{10}$/;

// Forgot Password screen component
function ForgotPasswordScreen() {
  const navigation = useNavigation();

  // -- Stage 1 state: school resolution --
  const [schoolCode, setSchoolCode] = useState('');
  const [resolvedSchool, setResolvedSchool] = useState(null);
  const [schoolError, setSchoolError] = useState('');
  const [isResolvingSchool, setIsResolvingSchool] = useState(false);

  // -- Stage 2 state: phone entry and OTP send --
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  // Resolve the entered school code to a school object
  async function handleFindSchool() {
    if (!schoolCode.trim() || isResolvingSchool) return;

    setSchoolError('');
    setIsResolvingSchool(true);

    try {
      const school = await getSchoolByCode(schoolCode);
      setResolvedSchool(school);
    } catch (err) {
      setSchoolError(
        err.response?.data?.message ||
        'School not found. Check the code and try again.'
      );
    } finally {
      setIsResolvingSchool(false);
    }
  }

  // Reset school resolution and clear phone/send state
  function handleChangeSchool() {
    setResolvedSchool(null);
    setPhone('');
    setSendError('');
  }

  // Validate phone and send the password-reset OTP
  async function handleSendOTP() {
    if (!phone.trim() || isSending) return;

    setSendError('');

    // Client-side phone format validation
    if (!PHONE_REGEX.test(phone.trim())) {
      setSendError('Enter a valid 10-digit phone number');
      return;
    }

    setIsSending(true);

    try {
      // Send OTP — backend always returns success regardless of phone registration
      const data = await forgotPasswordSendOTP({
        phone: phone.trim(),
        school_id: resolvedSchool.id,
      });

      // Navigate to OTP verification screen with required params
      navigation.navigate('VerifyOTP', {
        phone: phone.trim(),
        school_id: resolvedSchool.id,
        maskedPhone: data.maskedPhone,
      });
    } catch (err) {
      setSendError(
        err.response?.data?.message ||
        'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsSending(false);
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your school code and registered phone number
            </Text>
          </View>

          {/* ---- Stage 1: School code resolution ---- */}
          <View style={styles.section}>
            {/* School code input (hidden once resolved) */}
            {!resolvedSchool ? (
              <>
                <Text style={styles.label}>School Code</Text>
                <TextInput
                  style={styles.input}
                  value={schoolCode}
                  onChangeText={setSchoolCode}
                  placeholder="e.g. SJPS01"
                  placeholderTextColor={TEXT_MUTED}
                  autoCapitalize="characters"
                  maxLength={10}
                  editable={!isResolvingSchool}
                  returnKeyType="done"
                  onSubmitEditing={handleFindSchool}
                />

                {/* Find School button */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!schoolCode.trim() || isResolvingSchool) &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleFindSchool}
                  activeOpacity={0.85}
                  disabled={!schoolCode.trim() || isResolvingSchool}
                >
                  {isResolvingSchool ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Find School</Text>
                  )}
                </TouchableOpacity>

                {/* School lookup error */}
                {schoolError ? (
                  <Text style={styles.errorText}>{schoolError}</Text>
                ) : null}
              </>
            ) : (
              /* Resolved school confirmation row */
              <View style={styles.resolvedSchoolCard}>
                <View style={styles.resolvedSchoolInfo}>
                  <Text style={styles.resolvedSchoolLabel}>School</Text>
                  <Text style={styles.resolvedSchoolName}>
                    {resolvedSchool.name}
                  </Text>
                  {resolvedSchool.city && resolvedSchool.state ? (
                    <Text style={styles.resolvedSchoolLocation}>
                      {resolvedSchool.city}, {resolvedSchool.state}
                    </Text>
                  ) : null}
                </View>
                {/* Change link to reset school and re-enter code */}
                <TouchableOpacity
                  onPress={handleChangeSchool}
                  activeOpacity={0.7}
                >
                  <Text style={styles.changeLink}>Change</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ---- Stage 2: Phone entry (visible after school resolution) ---- */}
          {resolvedSchool ? (
            <View style={styles.section}>
              {/* Phone number field */}
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit registered phone number"
                placeholderTextColor={TEXT_MUTED}
                keyboardType="phone-pad"
                autoCapitalize="none"
                maxLength={10}
                editable={!isSending}
                returnKeyType="done"
                onSubmitEditing={handleSendOTP}
              />

              {/* Send OTP error message */}
              {sendError ? (
                <Text style={styles.errorText}>{sendError}</Text>
              ) : null}

              {/* Send OTP button */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!phone.trim() || isSending) && styles.buttonDisabled,
                ]}
                onPress={handleSendOTP}
                activeOpacity={0.85}
                disabled={!phone.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
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
  // Spacing between Stage 1 and Stage 2 sections
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
  // Resolved school confirmation card
  resolvedSchoolCard: {
    backgroundColor: SUCCESS_SURFACE,
    borderWidth: 1,
    borderColor: SUCCESS_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Left side of the resolved school card
  resolvedSchoolInfo: {
    flex: 1,
    marginRight: 12,
  },
  // Small label above the school name
  resolvedSchoolLabel: {
    fontSize: 12,
    color: SUCCESS_BORDER,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  // Resolved school display name
  resolvedSchoolName: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: '700',
  },
  // City/state location line
  resolvedSchoolLocation: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '500',
    marginTop: 2,
  },
  // "Change" link to reset school selection
  changeLink: {
    fontSize: 14,
    color: BRAND_PRIMARY,
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen;
