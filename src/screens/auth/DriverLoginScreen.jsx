// src/screens/auth/DriverLoginScreen.jsx — Two-stage driver login screen.
// Stage 1: User enters their school code, which resolves to a school UUID.
// Stage 2: User enters employee ID and password to authenticate.
// On successful login, Zustand auth state is updated and RootNavigator
// reactively switches to DriverNavigator — no manual navigation needed.

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
import useAuthStore from '../../store/authStore';
import { getSchoolByCode, driverLogin } from '../../api/auth.api';

// Brand colour palette — matches LoginScreen
const BRAND_PRIMARY = '#3B82F6';
const BG_COLOR = '#0F172A';
const SURFACE_COLOR = '#1E293B';
const TEXT_PRIMARY = '#F1F5F9';
const TEXT_SECONDARY = '#94A3B8';
const TEXT_MUTED = '#64748B';
const ERROR_COLOR = '#EF4444';
const SUCCESS_SURFACE = '#0F2A1E';
const SUCCESS_BORDER = '#22C55E';
const INPUT_BG = '#1E293B';
const INPUT_BORDER = '#334155';
const INPUT_BORDER_FOCUS = '#3B82F6';

// Driver login screen component
function DriverLoginScreen() {
  const navigation = useNavigation();

  // Read previously resolved school from persisted store (synchronous)
  const storedSchool = useAuthStore((state) => state.resolvedSchool);

  // -- Stage 1 state: school resolution --
  const [schoolCode, setSchoolCode] = useState(storedSchool?.code || '');
  const [resolvedSchool, setResolvedSchool] = useState(storedSchool);
  const [schoolError, setSchoolError] = useState('');
  const [isResolvingSchool, setIsResolvingSchool] = useState(false);

  // -- Stage 2 state: login form --
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  // Reset school resolution and clear all login fields
  function handleChangeSchool() {
    setResolvedSchool(null);
    setEmployeeId('');
    setPassword('');
    setLoginError('');
  }

  // Authenticate the driver with employee ID and password
  async function handleLogin() {
    if (!employeeId.trim() || !password || isLoggingIn) return;

    setLoginError('');
    setIsLoggingIn(true);

    try {
      // Password is intentionally NOT trimmed — only employee_id is trimmed
      const data = await driverLogin({
        employee_id: employeeId.trim(),
        password,
        school_id: resolvedSchool.id,
      });

      // Persist auth state — RootNavigator watches token reactively
      useAuthStore.getState().setAuth({
        token: data.token,
        user: data.user,
        children: [],
        isFirstLogin: false,
      });

      // Persist resolved school so user doesn't re-enter code next time
      useAuthStore.getState().setResolvedSchool(resolvedSchool);
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
      setIsLoggingIn(false);
    }
  }

  // Navigate back to role selection
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
            <Text style={styles.title}>Driver Login</Text>
            <Text style={styles.subtitle}>
              Enter your school code to get started
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

          {/* ---- Stage 2: Login form (visible after school resolution) ---- */}
          {resolvedSchool ? (
            <View style={styles.section}>
              {/* Employee ID field */}
              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.input}
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="Enter your employee ID"
                placeholderTextColor={TEXT_MUTED}
                autoCapitalize="none"
                keyboardType="default"
                editable={!isLoggingIn}
                returnKeyType="next"
              />

              {/* Password field */}
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={TEXT_MUTED}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoggingIn}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              {/* Login error message */}
              {loginError ? (
                <Text style={styles.errorText}>{loginError}</Text>
              ) : null}

              {/* Login button */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!employeeId.trim() || !password || isLoggingIn) &&
                  styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={!employeeId.trim() || !password || isLoggingIn}
              >
                {isLoggingIn ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Login</Text>
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

export default DriverLoginScreen;
