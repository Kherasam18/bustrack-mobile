// src/screens/driver/DriverHomeScreen.jsx — Main driver screen showing bus
// and route info, journey status, and the active action button. All state
// and logic comes from the useJourney hook.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import useAuthStore from '../../store/authStore';
import { useJourney } from '../../hooks/useJourney';
import { formatTime } from '../../utils/formatTime';
import JourneyButton from '../../components/driver/JourneyButton';
import AppButton from '../../components/shared/AppButton';

// Theme colours used throughout the screen
const COLORS = {
  bg: '#0F172A',
  card: '#1E293B',
  border: '#334155',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#2563EB',
  green: '#16A34A',
  amber: '#D97706',
  red: '#DC2626',
  white: '#FFFFFF',
};

/**
 * Determine the human-readable journey status label and colour.
 */
function getStatusInfo(pickupJourney, dropJourney) {
  if (!pickupJourney) {
    return { label: 'No journey started', color: COLORS.textMuted };
  }
  if (pickupJourney.status === 'PICKUP_STARTED') {
    return { label: 'Pickup in progress', color: COLORS.green };
  }
  if (pickupJourney.status === 'ARRIVED_SCHOOL' && !dropJourney) {
    return { label: 'At school — ready for drop', color: COLORS.amber };
  }
  if (dropJourney?.status === 'DROP_STARTED') {
    return { label: 'Drop in progress', color: COLORS.accent };
  }
  if (dropJourney?.status === 'COMPLETED') {
    return { label: 'All done for today ✅', color: COLORS.green };
  }
  return { label: 'Unknown status', color: COLORS.textMuted };
}

/**
 * Determine which action button to show based on state machine rules.
 * Returns null when all done or in an unknown state.
 */
function getActiveAction(pickupJourney, dropJourney) {
  if (!pickupJourney) return 'start-pickup';
  if (pickupJourney.status === 'PICKUP_STARTED') return 'arrived-school';
  if (pickupJourney.status === 'ARRIVED_SCHOOL' && !dropJourney) return 'start-drop';
  if (dropJourney?.status === 'DROP_STARTED') return 'end-journey';
  return null;
}

/**
 * Map action key to the corresponding handler from the hook.
 */
function getActionHandler(action, handlers) {
  const map = {
    'start-pickup': handlers.handleStartPickup,
    'arrived-school': handlers.handleArrivedSchool,
    'start-drop': handlers.handleStartDrop,
    'end-journey': handlers.handleEndJourney,
  };
  return map[action] || null;
}

/**
 * DriverHomeScreen — shows bus/route info, journey status, and action button.
 */
function DriverHomeScreen() {
  // Auth state
  const user = useAuthStore((state) => state.user);
  const resolvedSchool = useAuthStore((state) => state.resolvedSchool);
  const logout = useAuthStore((state) => state.logout);

  // Journey state and actions from custom hook
  const {
    pickupJourney,
    dropJourney,
    isLoading,
    error,
    fetchJourneys,
    handleStartPickup,
    handleArrivedSchool,
    handleStartDrop,
    handleEndJourney,
    isActionLoading,
    activeAction: loadingAction,
  } = useJourney();

  // Derive current action and status
  const currentAction = getActiveAction(pickupJourney, dropJourney);
  const statusInfo = getStatusInfo(pickupJourney, dropJourney);

  // Get bus info from the most recent journey
  const latestJourney = dropJourney || pickupJourney;
  const busNumber = latestJourney?.bus_number || '--';
  const routeName = latestJourney?.route_name || '--';

  // Get the started_at time for the current active journey
  const activeJourneyTime = dropJourney?.status === 'DROP_STARTED'
    ? formatTime(dropJourney.started_at)
    : pickupJourney?.started_at
      ? formatTime(pickupJourney.started_at)
      : null;

  // Loading state — show spinner
  if (isLoading && !isActionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading journeys...</Text>
      </View>
    );
  }

  // Error state — show error with retry
  if (error && !isActionLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.retryWrapper}>
          <AppButton
            title="Retry"
            onPress={fetchJourneys}
            variant="primary"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.driverName}>{user?.name || 'Driver'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content with pull-to-refresh */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchJourneys}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        {/* Bus info card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bus & Route</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bus Number</Text>
              <Text style={styles.infoValue}>{busNumber}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Route</Text>
              <Text style={styles.infoValue}>{routeName}</Text>
            </View>
          </View>
          {/* School name */}
          {resolvedSchool?.name ? (
            <View style={styles.schoolRow}>
              <Text style={styles.schoolIcon}>🏫</Text>
              <Text style={styles.schoolName}>{resolvedSchool.name}</Text>
            </View>
          ) : null}
        </View>

        {/* Journey status section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Journey Status</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
          {/* Show started_at time if available */}
          {activeJourneyTime ? (
            <Text style={styles.timeText}>Started at {activeJourneyTime}</Text>
          ) : null}
        </View>

        {/* Journey action button — hidden when all done */}
        {currentAction ? (
          <View style={styles.actionSection}>
            <JourneyButton
              action={currentAction}
              onPress={getActionHandler(currentAction, {
                handleStartPickup,
                handleArrivedSchool,
                handleStartDrop,
                handleEndJourney,
              })}
              loading={isActionLoading && loadingAction === currentAction}
              disabled={isActionLoading}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen dark background
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Centered loading/error container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    lineHeight: 22,
  },
  retryWrapper: {
    width: '60%',
  },
  // Header bar
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  driverName: {
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 22,
  },
  // Scroll content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Card styling
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  // Bus info row with divider
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  // School name row
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  schoolIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  schoolName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  // Journey status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    fontWeight: '500',
  },
  // Action button section
  actionSection: {
    marginTop: 8,
  },
});

export default DriverHomeScreen;
