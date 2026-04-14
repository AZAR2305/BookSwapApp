import { useEffect } from 'react';
import { Platform } from 'react-native';
import { registerForPushNotifications } from '@/src/services/notificationService';

export function useNotifications() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    registerForPushNotifications().catch(() => {
      // Notification permissions can fail in simulator/web; app should continue.
    });
  }, []);
}
