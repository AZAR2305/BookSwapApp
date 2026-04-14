import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/src/navigation/types';
import { registerWithEmail } from '@/src/services/authService';
import { isStrongPassword, isValidEmail } from '@/src/utils/validators';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ displayName?: string; email?: string; password?: string; submit?: string }>({});

  const onRegister = async () => {
    const nextErrors: typeof errors = {};

    if (!displayName.trim()) {
      nextErrors.displayName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (!isStrongPassword(password)) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);
      await registerWithEmail(email.trim(), password, displayName.trim());
    } catch (error: any) {
      const code = typeof error?.code === 'string' ? error.code : '';
      const message =
        code === 'auth/email-already-in-use'
          ? 'That email is already registered.'
          : code === 'auth/invalid-email'
            ? 'Please enter a valid email address.'
            : code === 'auth/weak-password'
              ? 'Password is too weak. Use at least 6 characters.'
              : 'Unable to create account. Check your details and try again.';
      setErrors({ submit: message });
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text variant="headlineSmall" style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Join the campus book market.</Text>
      </View>
      <TextInput
        label="Full Name"
        mode="outlined"
        value={displayName}
        onChangeText={setDisplayName}
        onBlur={() =>
          setErrors((current) => ({
            ...current,
            displayName: !displayName.trim() ? 'Please enter your full name.' : current.displayName,
          }))
        }
        error={Boolean(errors.displayName)}
        outlineColor={colors.inputBorder}
        activeOutlineColor={colors.button}
        style={[styles.input, { backgroundColor: colors.input }]}
      />
      <HelperText type="error" visible={Boolean(errors.displayName)}>
        {errors.displayName}
      </HelperText>
      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setErrors((current) => ({ ...current, email: !email.trim() ? 'Email is required.' : current.email }))}
        error={Boolean(errors.email)}
        outlineColor={colors.inputBorder}
        activeOutlineColor={colors.button}
        style={[styles.input, { backgroundColor: colors.input }]}
      />
      <HelperText type="error" visible={Boolean(errors.email)}>
        {errors.email}
      </HelperText>
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={() =>
          setErrors((current) => ({
            ...current,
            password: !password.trim() ? 'Password is required.' : current.password,
          }))
        }
        error={Boolean(errors.password)}
        outlineColor={colors.inputBorder}
        activeOutlineColor={colors.button}
        style={[styles.input, { backgroundColor: colors.input }]}
      />
      <HelperText type="error" visible={Boolean(errors.password)}>
        {errors.password}
      </HelperText>
      <HelperText type="error" visible={Boolean(errors.submit)}>
        {errors.submit}
      </HelperText>
      <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} loading={loading} onPress={onRegister}>
        Register
      </Button>
      <Button mode="text" onPress={() => navigation.goBack()}>
        Back to login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 10,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    lineHeight: 20,
  },
  input: {
    borderRadius: 14,
  },
});
