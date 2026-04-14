import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

interface Props {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: Props) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={{ color: colors.text }}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 4,
    color: '#7F7F79',
    textAlign: 'center',
  },
});
