import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native-paper';
import type { RootStackParamList } from '@/src/navigation/types';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function OrderConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderConfirmation'>>();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineSmall" style={{ color: colors.text }}>Order Confirmed</Text>
      <Text style={{ color: colors.muted }}>Your books are now in purchased items.</Text>
      <Text style={[styles.note, { color: colors.muted }]}>{route.params?.message ?? ''}</Text>
      <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
        Continue Shopping
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  note: {
    color: '#6D6D67',
  },
});
