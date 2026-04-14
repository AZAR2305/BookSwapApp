import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/src/screens/Auth/LoginScreen';
import { RegisterScreen } from '@/src/screens/Auth/RegisterScreen';
import type { AuthStackParamList } from '@/src/navigation/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Welcome Back' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
    </Stack.Navigator>
  );
}
