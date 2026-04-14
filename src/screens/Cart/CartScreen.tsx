import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Text } from 'react-native-paper';
import type { RootStackParamList } from '@/src/navigation/types';
import { useCartStore } from '@/src/store/cartStore';
import { EmptyState } from '@/src/components/EmptyState';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function CartScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const total = useCartStore((state) => state.total());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineSmall" style={{ color: colors.text, marginBottom: 10 }}>Your Cart</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.book.id}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Card.Title title={item.book.title} subtitle={`${item.qty} x $${item.book.price.toFixed(2)}`} />
            <Card.Actions>
              <Button onPress={() => removeFromCart(item.book.id)}>Remove</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<EmptyState title="Your cart is empty" />}
      />

      <View style={[styles.footer, { borderColor: colors.border }]}>
        <Text variant="titleMedium" style={{ color: colors.text }}>Total: ${total.toFixed(2)}</Text>
        <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} onPress={() => navigation.navigate('Checkout')} disabled={!items.length}>
          Checkout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  card: {
    marginBottom: 10,
    borderWidth: 1,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 10,
  },
});
