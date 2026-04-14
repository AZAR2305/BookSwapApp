import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, TextInput } from 'react-native-paper';
import { useState } from 'react';
import type { RootStackParamList } from '@/src/navigation/types';
import { useCartStore } from '@/src/store/cartStore';
import { checkoutWithStripe } from '@/src/services/paymentService';
import { useAuthStore } from '@/src/store/authStore';
import { createOrder } from '@/src/services/orderService';
import { notifyOrderConfirmed } from '@/src/services/notificationService';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function CheckoutScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const clearCart = useCartStore((state) => state.clearCart);

  const onPay = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const payment = await checkoutWithStripe({
        amount: total,
        description: `BookSwap order (${items.length} items)`,
      });

      if (!payment.success) {
        throw new Error('Payment was not successful.');
      }

      await Promise.all(
        items.map((item) =>
          createOrder({
            buyerId: user.uid,
            sellerId: item.book.userId,
            bookId: item.book.id,
            total: item.book.price * item.qty,
            paymentStatus: 'paid',
          })
        )
      );

      await notifyOrderConfirmed();
      clearCart();
      navigation.replace('OrderConfirmation', { message: `Payment id: ${payment.transactionId}` });
    } catch (error: any) {
      Alert.alert('Checkout Failed', error?.message ?? 'Unable to complete order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text variant="titleLarge" style={{ color: colors.text }}>Checkout</Text>
        <Text style={{ color: colors.muted }}>Confirm the order and finalize payment.</Text>
      </View>
      <Text style={{ color: colors.text }}>Total Amount: ${total.toFixed(2)}</Text>
      <TextInput
        mode="outlined"
        label="Email for receipt"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ backgroundColor: colors.input }}
      />
      <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} onPress={onPay} loading={loading} disabled={!items.length}>
        Pay with Stripe
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
});
