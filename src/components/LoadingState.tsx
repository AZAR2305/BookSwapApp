import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function LoadingState() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.button} />
      <Text style={{ marginTop: 12, color: colors.muted }}>Loading BookSwap…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
