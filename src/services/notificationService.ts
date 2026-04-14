import { Platform } from 'react-native';

const getNotificationsModule = async () => {
  const module = await import('expo-notifications');
  module.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  return module;
};

export const registerForPushNotifications = async () => {
  if (Platform.OS === 'web') return null;

  const Notifications = await getNotificationsModule();
  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};

export const notifyNewBook = async (title: string) => {
  if (Platform.OS === 'web') return;

  const Notifications = await getNotificationsModule();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Book Listed',
      body: `${title} is now available on BookSwap.`,
    },
    trigger: null,
  });
};

export const notifyOrderConfirmed = async () => {
  if (Platform.OS === 'web') return;

  const Notifications = await getNotificationsModule();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Order Confirmed',
      body: 'Your order is confirmed. Check your purchases in profile.',
    },
    trigger: null,
  });
};
