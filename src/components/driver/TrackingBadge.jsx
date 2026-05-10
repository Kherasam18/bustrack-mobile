// src/components/driver/TrackingBadge.jsx — Visual GPS tracking status badge.
// Shows a coloured pill indicator reflecting signal quality. Re-derives
// status every 30 seconds to keep the display live without manual refresh.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  getTrackingStatus,
  getTrackingStatusColor,
  getTrackingStatusLabel,
} from '../../utils/trackingStatus';

// Interval for re-deriving tracking status (30 seconds)
const REFRESH_INTERVAL_MS = 30 * 1000;

// GPS tracking status badge component
function TrackingBadge({ lastSentAt, style }) {
  // Derive status from the last successful GPS send timestamp
  const [status, setStatus] = useState(() => getTrackingStatus(lastSentAt));

  // Re-derive status when lastSentAt changes or every 30 seconds
  useEffect(() => {
    setStatus(getTrackingStatus(lastSentAt));

    const interval = setInterval(() => {
      setStatus(getTrackingStatus(lastSentAt));
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [lastSentAt]);

  // Resolve colour and label for the current status
  const dotColor = getTrackingStatusColor(status);
  const label = getTrackingStatusLabel(status);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: dotColor + '1A',
          borderColor: dotColor,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.label, { color: dotColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Pill-shaped badge container
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  // Coloured status dot
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  // Status label text
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TrackingBadge;
