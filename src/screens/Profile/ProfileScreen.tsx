import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Chip, Divider, Switch, Text } from 'react-native-paper';
import { logout } from '@/src/services/authService';
import { deleteBookListing, subscribeToUserBooks } from '@/src/services/bookService';
import { subscribeToBuyerOrders } from '@/src/services/orderService';
import { subscribeToSellerReviews } from '@/src/services/reviewService';
import { useAuthStore } from '@/src/store/authStore';
import { useThemeStore } from '@/src/store/themeStore';
import type { BookListing, Order, Review } from '@/src/utils/types';
import type { RootStackParamList } from '@/src/navigation/types';
import { getScreenColors } from '@/src/config/theme';

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const [books, setBooks] = useState<BookListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const colors = getScreenColors(isDarkMode);

  useEffect(() => {
    if (!user) return;
    const unSubBooks = subscribeToUserBooks(user.uid, setBooks);
    const unSubOrders = subscribeToBuyerOrders(user.uid, setOrders);
    const unSubReviews = subscribeToSellerReviews(user.uid, setReviews);

    return () => {
      unSubBooks();
      unSubOrders();
      unSubReviews();
    };
  }, [user]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  }, [reviews]);

  if (!profile) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Card.Title
          title={profile.displayName}
          subtitle={profile.email}
          left={() => (
            <View style={[styles.avatar, { backgroundColor: colors.soft }]}>
              <Text variant="titleMedium" style={{ color: colors.text }}>
                {profile.displayName?.[0]?.toUpperCase() ?? 'B'}
              </Text>
            </View>
          )}
        />
        <Card.Content>
          <Text style={{ color: colors.muted }}>Campus: {profile.campus || 'Not set'}</Text>
          <Text style={{ color: colors.muted }}>Uploaded books: {books.length}</Text>
          <Text style={{ color: colors.muted }}>Purchased books: {orders.length}</Text>
          <Text style={{ color: colors.muted }}>Average seller rating: {avgRating.toFixed(1)}</Text>
        </Card.Content>
        <Divider />
        <Card.Actions>
          <Button onPress={() => navigation.navigate('EditProfile')}>Edit Profile</Button>
          <Button onPress={logout}>Logout</Button>
        </Card.Actions>
      </Card>

      <View style={[styles.themeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={{ color: colors.text }}>Dark mode</Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>Switch the app to a darker stone palette.</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.statsRow}>
        <Chip icon="book-open-page-variant">{books.length} books</Chip>
        <Chip icon="receipt">{orders.length} orders</Chip>
        <Chip icon="star">{avgRating.toFixed(1)} rating</Chip>
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Uploaded Books
      </Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={[styles.bookItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Card.Title title={item.title} subtitle={`$${item.price.toFixed(2)} • ${item.condition}`} />
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Main', { screen: 'Sell', params: { bookId: item.id } })}>
                Edit
              </Button>
              <Button
                onPress={() =>
                  Alert.alert('Remove Book', 'This will archive the listing and hide it from buyers.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => deleteBookListing(item.id) },
                  ])
                }>
                Remove
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  heroCard: {
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionTitle: {
    marginBottom: 8,
  },
  bookItem: {
    marginBottom: 8,
    borderWidth: 1,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
