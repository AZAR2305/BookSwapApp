import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, TextInput } from 'react-native-paper';
import type { BookCondition } from '@/src/utils/types';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

interface Props {
  query: string;
  setQuery: (value: string) => void;
  selectedCondition: BookCondition | 'All';
  setSelectedCondition: (value: BookCondition | 'All') => void;
  minPrice: string;
  maxPrice: string;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
}

const conditions: (BookCondition | 'All')[] = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

export function FilterBar({
  query,
  setQuery,
  selectedCondition,
  setSelectedCondition,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: Props) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        placeholder="Search by title or author"
        value={query}
        onChangeText={setQuery}
        style={[styles.search, { backgroundColor: colors.input }]}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {conditions.map((condition) => (
          <Chip
            key={condition}
            selected={selectedCondition === condition}
            onPress={() => setSelectedCondition(condition)}>
            {condition}
          </Chip>
        ))}
      </ScrollView>
      <View style={styles.row}>
        <TextInput
          mode="outlined"
          keyboardType="numeric"
          label="Min"
          value={minPrice}
          onChangeText={setMinPrice}
          style={[styles.priceInput, { backgroundColor: colors.input }]}
        />
        <TextInput
          mode="outlined"
          keyboardType="numeric"
          label="Max"
          value={maxPrice}
          onChangeText={setMaxPrice}
          style={[styles.priceInput, { backgroundColor: colors.input }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    gap: 10,
  },
  search: {
    backgroundColor: 'transparent',
  },
  chips: {
    gap: 8,
    paddingVertical: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  priceInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
