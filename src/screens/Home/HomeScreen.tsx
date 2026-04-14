import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';
import { BookCard } from '@/src/components/BookCard';
import { EmptyState } from '@/src/components/EmptyState';
import { FilterBar } from '@/src/components/FilterBar';
import { LoadingState } from '@/src/components/LoadingState';
import { useBooks } from '@/src/hooks/useBooks';
import { useCartStore } from '@/src/store/cartStore';
import type { RootStackParamList } from '@/src/navigation/types';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function HomeScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const addToCart = useCartStore((state) => state.addToCart);

  const {
    books,
    isLoading,
    query,
    setQuery,
    selectedCondition,
    setSelectedCondition,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    loadMore,
    isLoadingMore,
  } = useBooks();

  if (isLoading) return <LoadingState />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineSmall" style={[styles.header, { color: colors.text }]}>
        Discover Books
      </Text>

      <FilterBar
        query={query}
        setQuery={setQuery}
        selectedCondition={selectedCondition}
        setSelectedCondition={setSelectedCondition}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
            onAddToCart={() => addToCart(item)}
          />
        )}
        ListEmptyComponent={<EmptyState title="No books yet" subtitle="Try changing filters." />}
        ListFooterComponent={isLoadingMore ? <Text style={[styles.loadingMore, { color: colors.muted }]}>Loading more...</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  header: {
    marginBottom: 12,
  },
  loadingMore: {
    textAlign: 'center',
    paddingVertical: 10,
  },
});
