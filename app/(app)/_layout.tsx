import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(root)',
};
export default function AppLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          options={{ headerShown: false, contentStyle: { backgroundColor: 'black' } }}
          name="(root)"
        />
      </Stack>
    </QueryClientProvider>
  );
}
