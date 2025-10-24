import { Stack } from 'expo-router';
import useAuth, { AuthContextProvider } from 'Hooks/authContext';
import '../global.css';
export default function RootLayout() {
  console.log('here');
  return (
    <AuthContextProvider>
      <RootNavigator />
    </AuthContextProvider>
  );
}

function RootNavigator() {
  const { currentUser } = useAuth();
  return (
    <Stack>
      <Stack.Protected guard={!!currentUser}>
        <Stack.Screen options={{ headerShown: false }} name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!currentUser}>
        <Stack.Screen options={{ headerShown: false }} name="index" />
      </Stack.Protected>
    </Stack>
  );
}
