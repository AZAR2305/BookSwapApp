import { Alert, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, TextInput } from 'react-native-paper';
import { RatingStars } from '@/src/components/RatingStars';
import type { RootStackParamList } from '@/src/navigation/types';
import { useAuthStore } from '@/src/store/authStore';
import { createReview } from '@/src/services/reviewService';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function ReviewSellerScreen() {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ReviewSeller'>>();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    if (!user) return;

    try {
      await createReview({
        orderId: route.params.orderId,
        sellerId: route.params.sellerId,
        buyerId: user.uid,
        rating,
        comment,
      });
      Alert.alert('Thanks', 'Your review has been submitted.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Failed', error?.message ?? 'Could not submit review.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="titleLarge" style={{ color: colors.text }}>Rate your seller</Text>
      <RatingStars rating={rating} onChange={setRating} />
      <TextInput
        mode="outlined"
        label="Write a review"
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
        style={{ backgroundColor: colors.input }}
      />
      <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} onPress={submitReview}>
        Submit Review
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
});
