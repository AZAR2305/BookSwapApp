import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { HomeScreen } from '@/src/screens/Home/HomeScreen';
import { BookUploadScreen } from '@/src/screens/Book/BookUploadScreen';
import { CartScreen } from '@/src/screens/Cart/CartScreen';
import { ChatListScreen } from '@/src/screens/Chat/ChatListScreen';
import { ProfileScreen } from '@/src/screens/Profile/ProfileScreen';
import { AdminDashboardScreen } from '@/src/screens/Admin/AdminDashboardScreen';
import type { TabsParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/store/authStore';

const Tabs = createBottomTabNavigator<TabsParamList>();

export function MainTabs() {
  const profile = useAuthStore((state) => state.profile);
  const theme = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.onSurface },
        headerTintColor: theme.colors.onSurface,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Books',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Sell"
        component={BookUploadScreen}
        options={{
          title: 'Sell',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="plus-box" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cart-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="message-text-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />,
        }}
      />
      {profile?.role === 'admin' ? (
        <Tabs.Screen
          name="Admin"
          component={AdminDashboardScreen}
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shield-crown-outline" color={color} size={size} />
            ),
          }}
        />
      ) : null}
    </Tabs.Navigator>
  );
}
