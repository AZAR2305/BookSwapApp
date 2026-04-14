import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/src/navigation/types';
import { isStrongPassword, isValidEmail } from '@/src/utils/validators';
import { loginWithEmail } from '@/src/services/authService';
import { useThemeStore } from '@/src/store/themeStore';
import { getScreenColors } from '@/src/config/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const mapLoginError = (code: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account exists for this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect password. Try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    default:
      return 'Unable to sign in. Check your credentials and try again.';
  }
};

export function LoginScreen({ navigation }: Props) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const colors = getScreenColors(isDarkMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; submit?: string }>({});

  const onLogin = async () => {
    const nextErrors: typeof errors = {};

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
      await loginWithEmail(email.trim(), password);
    } catch (error: any) {
      const code = typeof error?.code === 'string' ? error.code : '';
      const message = mapLoginError(code);
      setErrors({ submit: message });
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text variant="headlineMedium" style={[styles.title, { color: colors.text }]}>BookSwap</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Buy and sell used books on campus.</Text>
      </View>

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
        onBlur={() => setErrors((current) => ({ ...current, password: !password.trim() ? 'Password is required.' : current.password }))}
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

      <Button mode="contained" buttonColor={colors.button} textColor={colors.buttonText} loading={loading} onPress={onLogin}>
        Login
      </Button>

      <Button mode="text" onPress={() => navigation.navigate('Register')}>
        Create an account
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
