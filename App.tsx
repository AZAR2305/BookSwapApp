import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@/src/navigation/AppNavigator';
import { useThemeStore } from '@/src/store/themeStore';
import {
  navigationDarkTheme,
  navigationLightTheme,
  paperDarkTheme,
  paperLightTheme,
} from '@/src/config/theme';
import { useAuthBootstrap } from '@/src/hooks/useAuthBootstrap';
import { useNotifications } from '@/src/hooks/useNotifications';
import { LoadingState } from '@/src/components/LoadingState';
import { useAuthStore } from '@/src/store/authStore';

export default function App() {
  useAuthBootstrap();
  useNotifications();

  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const loading = useAuthStore((state) => state.loading);

  if (loading) return <LoadingState />;

  return (
    <PaperProvider theme={isDarkMode ? paperDarkTheme : paperLightTheme}>
      <NavigationContainer theme={isDarkMode ? navigationDarkTheme : navigationLightTheme}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
