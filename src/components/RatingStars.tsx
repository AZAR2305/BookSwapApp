import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

interface Props {
  rating: number;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, onChange }: Props) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <IconButton
          key={value}
          icon={value <= rating ? 'star' : 'star-outline'}
          iconColor={colors.button}
          onPress={onChange ? () => onChange(value) : undefined}
        />
      ))}
    </View>
  );
}
