import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Chip, Divider, Text } from 'react-native-paper';
import type { RootStackParamList } from '@/src/navigation/types';
import { useCartStore } from '@/src/store/cartStore';
import { useWishlistStore } from '@/src/store/wishlistStore';
import { ensureThread } from '@/src/services/chatService';
import { useAuthStore } from '@/src/store/authStore';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function BookDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'BookDetails'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { book } = route.params;
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(book.id));

  const startChat = async () => {
    if (!user) return;
    const threadId = await ensureThread(user.uid, book.userId, book.id);
    navigation.navigate('ChatRoom', { threadId, title: book.title, bookId: book.id });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Image source={{ uri: book.imageUrl }} style={[styles.image, { backgroundColor: colors.soft }]} />
      <Text variant="headlineSmall" style={{ color: colors.text }}>{book.title}</Text>
      <Text variant="titleMedium" style={[styles.author, { color: colors.muted }]}> 
        {book.author}
      </Text>

      <View style={styles.row}>
        <Chip>{book.condition}</Chip>
        <Text variant="titleLarge" style={{ color: colors.text }}>${book.price.toFixed(2)}</Text>
      </View>

      <Text style={{ color: colors.text }}>{book.description || 'No description provided.'}</Text>

      <Divider />

      <View style={styles.metaRow}>
        <Text style={{ color: colors.muted }}>Seller</Text>
        <Text style={{ color: colors.text }}>{book.sellerName || 'Student seller'}</Text>
      </View>

      <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} onPress={() => addToCart(book)}>
        Add to Cart
      </Button>

      <Button mode="outlined" onPress={() => toggleWishlist(book.id)}>
        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </Button>

      <Button mode="text" onPress={startChat}>
        Chat with Seller
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 12,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    gap: 4,
  },
});
