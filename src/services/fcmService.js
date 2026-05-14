// src/services/fcmService.js — FCM push token registration service.
// Requests notification permissions, obtains the Expo push token,
// and registers it with the BusTrack backend. Failures are swallowed
// silently — FCM registration must never crash or block the app.

import * as Notifications from 'expo-notifications';
import { registerFcmTokenApi } from '../api/auth.api';

// Configure notification handler at module load (required for Android)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Register the device FCM token with the backend
export async function registerFcmToken() {
  try {
    // Step 1: Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    // Step 2: Get the Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // Step 3: Register the token with the backend
    await registerFcmTokenApi({ fcm_token: token });

    return token;
  } catch {
    // Swallow all errors — FCM failure must never crash the app
    return null;
  }
}
