import { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Button, Menu, Text, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import {
  createBookListing,
  getBookListingById,
  updateBookListing,
} from '@/src/services/bookService';
import { useAuthStore } from '@/src/store/authStore';
import type { BookCondition } from '@/src/utils/types';
import { notifyNewBook } from '@/src/services/notificationService';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';
import type { TabsParamList } from '@/src/navigation/types';
import { useCallback } from 'react';

const conditions: BookCondition[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

type Props = BottomTabScreenProps<TabsParamList, 'Sell'>;

export function BookUploadScreen({ route, navigation }: Props) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const bookId = route.params?.bookId;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<BookCondition>('Good');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalImageUri, setOriginalImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadBook = useCallback(async () => {
    if (!bookId) return;
    const book = await getBookListingById(bookId);
    if (!book || book.userId !== user?.uid) {
      Alert.alert('Not allowed', 'You can only edit your own book listings.');
      navigation.navigate('Profile');
      return;
    }

    setTitle(book.title);
    setAuthor(book.author);
    setPrice(String(book.price));
    setCondition(book.condition);
    setDescription(book.description ?? '');
    setImageUri(book.imageUrl);
    setOriginalImageUri(book.imageUrl);
  }, [bookId, navigation, user?.uid]);

  useEffect(() => {
    void loadBook();
  }, [loadBook]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow image library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: Platform.OS === 'web',
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const nextImageUri =
        Platform.OS === 'web' && asset.base64
          ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
          : asset.uri;

      setImageUri(nextImageUri);
    }
  };

  const onSubmit = async () => {
    if (!user || !profile) return;
    if (!title.trim() || !author.trim() || !price.trim() || !imageUri) {
      Alert.alert('Missing Fields', 'Fill all required fields and choose an image.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        condition,
        description: description.trim(),
        userId: user.uid,
        sellerName: profile.displayName,
      };

      if (bookId) {
        await updateBookListing(
          bookId,
          payload,
          imageUri && imageUri !== originalImageUri ? imageUri : undefined
        );
        Alert.alert('Updated', 'Book listing updated successfully.');
      } else {
        await createBookListing(payload, imageUri);
        await notifyNewBook(title.trim());
        Alert.alert('Uploaded', 'Book listed successfully.');
      }

      setTitle('');
      setAuthor('');
      setPrice('');
      setDescription('');
      setImageUri(null);
      setOriginalImageUri(null);
      navigation.setParams({ bookId: undefined });
      navigation.navigate('Profile');
    } catch (error: any) {
      Alert.alert('Upload Failed', error?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={{ color: colors.text }}>
        {bookId ? 'Edit Your Book' : 'List a Book'}
      </Text>
      <Text style={{ color: colors.muted, marginBottom: 4 }}>Add a clean photo and a fair price.</Text>
      <TextInput label="Title" mode="outlined" value={title} onChangeText={setTitle} style={{ backgroundColor: colors.input }} />
      <TextInput label="Author" mode="outlined" value={author} onChangeText={setAuthor} style={{ backgroundColor: colors.input }} />
      <TextInput
        label="Price"
        mode="outlined"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
        style={{ backgroundColor: colors.input }}
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<Button mode="outlined" onPress={() => setMenuVisible(true)}>{`Condition: ${condition}`}</Button>}>
        {conditions.map((item) => (
          <Menu.Item
            key={item}
            title={item}
            onPress={() => {
              setCondition(item);
              setMenuVisible(false);
            }}
          />
        ))}
      </Menu>
      <TextInput
        label="Description"
        mode="outlined"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        style={{ backgroundColor: colors.input }}
      />
      <Button mode="outlined" onPress={pickImage}>
        {bookId ? 'Replace Book Image' : 'Pick Book Image'}
      </Button>

      {imageUri ? <Image source={{ uri: imageUri }} style={[styles.preview, { backgroundColor: colors.soft }]} /> : null}

      <Button
        mode="contained"
        buttonColor={colors.button}
        textColor={colors.buttonText}
        loading={loading}
        onPress={onSubmit}
        disabled={!title.trim() || !author.trim() || !price.trim() || !imageUri}>
        {bookId ? 'Save Changes' : 'Upload Book'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});
