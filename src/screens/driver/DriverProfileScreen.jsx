// src/screens/driver/DriverProfileScreen.jsx — Driver profile screen with
// driver info display, change password form, and logout functionality.
// Dark theme consistent with DriverHomeScreen.

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import useAuthStore from '../../store/authStore';
import { changeDriverPassword } from '../../api/auth.api';
import AppButton from '../../components/shared/AppButton';
import AppInput from '../../components/shared/AppInput';

// Theme colours — dark palette matching DriverHomeScreen
const COLORS = {
  bg: '#0F172A',
  surface: '#1E293B',
  textPrimary: '#F1F5F9',
  textMuted: '#94A3B8',
  primary: '#2563EB',
  danger: '#DC2626',
  error: '#EF4444',
  success: '#16A34A',
  border: '#334155',
};

/**
 * DriverProfileScreen — displays driver info, change password form, and logout.
 */
function DriverProfileScreen() {
  // Auth state from Zustand
  const user = useAuthStore((s) => s.user);
  const resolvedSchool = useAuthStore((s) => s.resolvedSchool);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Ref for auto-dismiss timer so we can clear on unmount
  const successTimerRef = useRef(null);

  // Clear all password fields
  const clearPasswordFields = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, []);

  // Handle change password submission
  const handleChangePassword = useCallback(async () => {
    // Clear previous messages
    setPasswordError('');
    setPasswordSuccess('');

    // Validate current password is non-empty
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    // Validate new password minimum length
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    // Validate confirm password matches new password (client-side only)
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);

      // Call the change password API — do NOT trim passwords
      await changeDriverPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      // Success — clear fields and show success message
      clearPasswordFields();
      setPasswordSuccess('Password changed successfully');

      // Auto-dismiss success message after 3 seconds
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword, clearPasswordFields]);

  // Handle logout — no confirmation dialog
  const handleLogout = useCallback(() => {
    useAuthStore.getState().logout();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Screen header */}
        <Text style={styles.screenTitle}>Profile</Text>

        {/* Driver info card */}
        <View style={styles.infoCard}>
          {/* Driver name */}
          <Text style={styles.driverName}>{user?.name || 'Driver'}</Text>

          {/* Employee ID */}
          <Text style={styles.infoText}>
            ID: {user?.employee_id || '—'}
          </Text>

          {/* School name */}
          <Text style={styles.infoText}>
            {resolvedSchool?.name || '—'}
          </Text>

          {/* Role badge */}
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Driver</Text>
          </View>
        </View>

        {/* Change password section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>

          {/* Current password input */}
          <AppInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
            disabled={isChangingPassword}
          />

          {/* New password input */}
          <AppInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Minimum 8 characters"
            secureTextEntry
            disabled={isChangingPassword}
          />

          {/* Confirm new password input */}
          <AppInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter new password"
            secureTextEntry
            disabled={isChangingPassword}
          />

          {/* Inline error message */}
          {passwordError ? (
            <Text style={styles.errorMessage}>{passwordError}</Text>
          ) : null}

          {/* Inline success message */}
          {passwordSuccess ? (
            <Text style={styles.successMessage}>{passwordSuccess}</Text>
          ) : null}

          {/* Change password button */}
          <AppButton
            title="Change Password"
            onPress={handleChangePassword}
            loading={isChangingPassword}
            disabled={isChangingPassword}
            variant="primary"
          />
        </View>

        {/* Logout button at bottom */}
        <View style={styles.logoutSection}>
          <AppButton
            title="Logout"
            onPress={handleLogout}
            variant="danger"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Flex container for KeyboardAvoidingView
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // ScrollView container
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Content container with padding
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  // Screen header title
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 24,
    marginTop: 16,
  },
  // Driver info card container
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // Driver name — large prominent text
  driverName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  // Info text — employee ID and school name
  infoText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 4,
    fontWeight: '500',
  },
  // Role badge pill
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  // Role badge text
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Section container
  section: {
    marginBottom: 28,
  },
  // Section title heading
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  // Inline error message
  errorMessage: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: 12,
  },
  // Inline success message
  successMessage: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
    marginBottom: 12,
  },
  // Logout section spacing
  logoutSection: {
    marginTop: 8,
  },
});

export default DriverProfileScreen;
