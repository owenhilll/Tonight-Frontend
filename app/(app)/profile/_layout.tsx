import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'black' } }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="index"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="success"
      />
    </Stack>
  );
}
