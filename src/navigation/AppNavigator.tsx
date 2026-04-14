import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from '@/src/navigation/MainTabs';
import { AuthNavigator } from '@/src/navigation/AuthNavigator';
import { BookDetailsScreen } from '@/src/screens/Book/BookDetailsScreen';
import { CheckoutScreen } from '@/src/screens/Cart/CheckoutScreen';
import { OrderConfirmationScreen } from '@/src/screens/Cart/OrderConfirmationScreen';
import { ReviewSellerScreen } from '@/src/screens/Book/ReviewSellerScreen';
import { EditProfileScreen } from '@/src/screens/Profile/EditProfileScreen';
import { ChatRoomScreen } from '@/src/screens/Chat/ChatRoomScreen';
import type { RootStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/store/authStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <Stack.Navigator key="auth">
        <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator key="main">
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ title: 'Book Details' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{ title: 'Order Confirmed' }}
      />
      <Stack.Screen name="ReviewSeller" component={ReviewSellerScreen} options={{ title: 'Rate Seller' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
}
