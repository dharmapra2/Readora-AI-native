import * as Device from "expo-device";
import { Platform } from "react-native";

// expo-notifications remote push was removed from Expo Go in SDK 53.
// All calls are wrapped so the app degrades gracefully in Expo Go;
// a development build is required for real push notifications.
let Notifications: typeof import("expo-notifications") | null = null;
try {
  Notifications = require("expo-notifications");
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  // Running in Expo Go — push notifications unavailable
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Notifications || !Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

export function scheduleDailyReadingReminder(hour = 20, minute = 0) {
  if (!Notifications) return Promise.resolve("");
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to read!",
      body: "Keep your reading streak alive. Open a book and read for a few minutes.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export function cancelAllNotifications() {
  if (!Notifications) return Promise.resolve();
  return Notifications.cancelAllScheduledNotificationsAsync();
}
