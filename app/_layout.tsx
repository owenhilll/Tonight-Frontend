import { Stack } from 'expo-router';
import useAuth, { AuthContextProvider } from '../Hooks/authContext';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView className="flex-1 bg-black">
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: 'black',
          },
        }}>
        <Stack.Protected guard={!!user}>
          <Stack.Screen options={{ headerShown: false }} name="(app)" />
        </Stack.Protected>

        <Stack.Protected guard={!user}>
          <Stack.Screen options={{ headerShown: false }} name="index" />
          <Stack.Screen options={{ headerShown: false }} name="SignIn" />
          <Stack.Screen options={{ headerShown: false }} name="RegisterBusiness" />
          <Stack.Screen options={{ headerShown: false }} name="ResetPassword" />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  );
}
