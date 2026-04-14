import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import type { BookListing } from '@/src/utils/types';
import { appColors } from '@/src/config/theme';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

interface Props {
  book: BookListing;
  onPress: () => void;
  onAddToCart?: () => void;
}

export function BookCard({ book, onPress, onAddToCart }: Props) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  return (
    <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} mode="outlined" onPress={onPress}>
      <Card.Content>
        <Image source={{ uri: book.imageUrl }} style={[styles.image, { backgroundColor: colors.soft }]} />
        <View style={styles.headerRow}>
          <View style={styles.grow}>
            <Text variant="titleMedium" style={{ color: colors.text }}>{book.title}</Text>
            <Text style={[styles.muted, { color: colors.muted }]}>{book.author}</Text>
          </View>
          <Chip compact>{book.condition}</Chip>
        </View>
        <View style={styles.footerRow}>
          <Text variant="titleMedium" style={[styles.price, { color: colors.text }]}>
            ${book.price.toFixed(2)}
          </Text>
          {onAddToCart ? (
            <Button mode="contained" onPress={onAddToCart} buttonColor={colors.button} textColor={colors.buttonText}>
              Add
            </Button>
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderColor: appColors.cement200,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: appColors.cement100,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  grow: {
    flex: 1,
  },
  muted: {
    marginTop: 2,
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontWeight: '700',
  },
});
