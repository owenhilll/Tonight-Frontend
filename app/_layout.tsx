import { Stack } from 'expo-router';
import useAuth, { AuthContextProvider } from 'Hooks/authContext';
import '../global.css';
export default function AuthLayout() {
  console.log('here');
  return (
    <AuthContextProvider>
      <RootNavigator />
    </AuthContextProvider>
  );
}

function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen options={{ headerShown: false }} name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen options={{ headerShown: false }} name="index" />
        <Stack.Screen options={{ headerShown: false }} name="SignIn" />
        <Stack.Screen options={{ headerShown: false }} name="RegisterBusiness" />
      </Stack.Protected>
    </Stack>
  );
}
