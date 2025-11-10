import { Stack } from 'expo-router';
import useAuth, { AuthContextProvider } from '../Hooks/authContext';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
export default function AuthLayout() {
  const queryClient = new QueryClient();
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

function RootNavigator() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Stack screenOptions={{ contentStyle: { backgroundColor: 'black' } }}>
        <Stack.Protected guard={!!user}>
          <Stack.Screen options={{ headerShown: false }} name="(app)" />
        </Stack.Protected>

        <Stack.Protected guard={!user}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,

              contentStyle: {
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}
          />
          <Stack.Screen
            options={{
              headerShown: false,

              contentStyle: {
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}
            name="SignUp"
          />
          <Stack.Screen options={{ headerShown: false }} name="RegisterBusiness" />
          <Stack.Screen options={{ headerShown: false }} name="ResetPassword" />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  );
}
