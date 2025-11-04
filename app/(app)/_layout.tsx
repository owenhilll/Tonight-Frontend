import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(root)',
};
export default function AppLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="(root)"
      />
    </Stack>
  );
}
