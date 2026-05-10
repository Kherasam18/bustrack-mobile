// src/hooks/useJourney.js — Custom hook encapsulating all journey fetch
// and action logic. DriverHomeScreen uses this hook exclusively.
// Phase 10b: Adds GPS start/stop and auto-resume on app relaunch.

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import useJourneyStore, {
  getPickupJourney,
  getDropJourney,
} from '../store/journeyStore';
import {
  getMyTodayJourneys,
  startPickup,
  arrivedAtSchool,
  startDrop,
  endJourney,
} from '../api/journeys.api';
import {
  startLocationBroadcasting,
  stopLocationBroadcasting,
  isLocationBroadcastingActive,
} from '../services/backgroundLocation';

// Custom hook for journey state and actions
function useJourney() {
  // Read state from journey store
  const journeys = useJourneyStore((s) => s.journeys);
  const isLoading = useJourneyStore((s) => s.isLoading);
  const error = useJourneyStore((s) => s.error);
  const pickupJourney = useJourneyStore(getPickupJourney);
  const dropJourney = useJourneyStore(getDropJourney);

  // Local state for action loading (separate from fetch loading)
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // Timestamp of the last successful GPS send (for TrackingBadge)
  const [lastSentAt, setLastSentAt] = useState(null);

  // Ref to track whether GPS resume has already run
  const hasResumedGps = useRef(false);

  // Fetch today's journeys from the API
  const fetchJourneys = useCallback(async () => {
    try {
      useJourneyStore.getState().setLoading(true);
      useJourneyStore.getState().setError(null);
      const data = await getMyTodayJourneys();
      useJourneyStore.getState().setJourneys(data);
    } catch (err) {
      useJourneyStore.getState().setError(err.message);
    } finally {
      useJourneyStore.getState().setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  // Resume GPS broadcasting after app relaunch if a journey is active
  useEffect(() => {
    // Only run once, after initial fetch completes
    if (isLoading || hasResumedGps.current) return;
    hasResumedGps.current = true;

    const activeJourney = journeys.find(
      (j) => j.status === 'PICKUP_STARTED' || j.status === 'DROP_STARTED'
    );

    if (!activeJourney) return;

    // Check if GPS is already running before restarting
    (async () => {
      try {
        const alreadyActive = await isLocationBroadcastingActive();
        if (!alreadyActive) {
          await startLocationBroadcasting(activeJourney.id);
        }
        // Set lastSentAt to now since GPS is active
        setLastSentAt(new Date());
      } catch {
        // GPS resume failure is non-fatal — journey still works
      }
    })();
  }, [isLoading, journeys]);

  // Merge an updated journey into the store array
  const mergeJourney = useCallback((updated) => {
    const current = useJourneyStore.getState().journeys;
    const filtered = current.filter(
      (j) => j.journey_type !== updated.journey_type
    );
    useJourneyStore.getState().setJourneys([...filtered, updated]);
  }, []);

  // Start morning pickup
  const handleStartPickup = useCallback(async () => {
    if (isActionLoading) return;
    try {
      setActiveAction('start-pickup');
      setIsActionLoading(true);
      const result = await startPickup();
      mergeJourney(result);

      // Start GPS broadcasting after successful pickup start
      try {
        await startLocationBroadcasting(result.id);
        setLastSentAt(new Date());
      } catch {
        Alert.alert(
          'GPS Warning',
          'Journey started but GPS tracking could not be activated. Location updates may not be sent.'
        );
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setIsActionLoading(false);
      setActiveAction(null);
    }
  }, [isActionLoading, mergeJourney]);

  // Mark arrival at school
  const handleArrivedSchool = useCallback(async () => {
    if (isActionLoading) return;
    try {
      setActiveAction('arrived-school');
      setIsActionLoading(true);
      const result = await arrivedAtSchool();
      mergeJourney(result);

      // Stop GPS broadcasting after arriving at school
      await stopLocationBroadcasting();
      setLastSentAt(null);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setIsActionLoading(false);
      setActiveAction(null);
    }
  }, [isActionLoading, mergeJourney]);

  // Start afternoon drop
  const handleStartDrop = useCallback(async () => {
    if (isActionLoading) return;
    try {
      setActiveAction('start-drop');
      setIsActionLoading(true);
      const result = await startDrop();
      mergeJourney(result);

      // Start GPS broadcasting after successful drop start
      try {
        await startLocationBroadcasting(result.id);
        setLastSentAt(new Date());
      } catch {
        Alert.alert(
          'GPS Warning',
          'Journey started but GPS tracking could not be activated. Location updates may not be sent.'
        );
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setIsActionLoading(false);
      setActiveAction(null);
    }
  }, [isActionLoading, mergeJourney]);

  // End drop journey
  const handleEndJourney = useCallback(async () => {
    if (isActionLoading) return;
    try {
      setActiveAction('end-journey');
      setIsActionLoading(true);
      const result = await endJourney();
      mergeJourney(result);

      // Stop GPS broadcasting after journey ends
      await stopLocationBroadcasting();
      setLastSentAt(null);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setIsActionLoading(false);
      setActiveAction(null);
    }
  }, [isActionLoading, mergeJourney]);

  return {
    journeys,
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
    activeAction,
    lastSentAt,
  };
}

export { useJourney };
