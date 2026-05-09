// src/hooks/useJourney.js — Custom hook encapsulating all journey fetch
// and action logic. DriverHomeScreen uses this hook exclusively.

import { useState, useEffect, useCallback } from 'react';
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
  };
}

export { useJourney };
