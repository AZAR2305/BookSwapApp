import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { updateUserProfile } from '@/src/services/authService';
import { useAuthStore } from '@/src/store/authStore';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

export function EditProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [campus, setCampus] = useState(profile?.campus ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [errors, setErrors] = useState<{ displayName?: string; submit?: string }>({});

  const onSave = async () => {
    if (!user) return;

    const nextErrors: typeof errors = {};

    if (!displayName.trim()) {
      nextErrors.displayName = 'Display name is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const payload = { displayName: displayName.trim(), campus: campus.trim(), bio: bio.trim() };
      await updateUserProfile(user.uid, payload);
      setProfile(profile ? { ...profile, ...payload } : null);
      navigation.goBack();
    } catch (error: any) {
      const message = error?.message ?? 'Could not update profile.';
      setErrors({ submit: message });
      Alert.alert('Save Failed', message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        label="Display Name"
        mode="outlined"
        value={displayName}
        onChangeText={setDisplayName}
        onBlur={() =>
          setErrors((current) => ({
            ...current,
            displayName: !displayName.trim() ? 'Display name is required.' : undefined,
          }))
        }
        error={Boolean(errors.displayName)}
        style={{ backgroundColor: colors.input }}
      />
      <HelperText type="error" visible={Boolean(errors.displayName)}>
        {errors.displayName}
      </HelperText>
      <TextInput label="Campus" mode="outlined" value={campus} onChangeText={setCampus} style={{ backgroundColor: colors.input }} />
      <TextInput label="Bio" mode="outlined" multiline numberOfLines={4} value={bio} onChangeText={setBio} style={{ backgroundColor: colors.input }} />
      <HelperText type="error" visible={Boolean(errors.submit)}>
        {errors.submit}
      </HelperText>
      <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} onPress={onSave}>
        Save
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
