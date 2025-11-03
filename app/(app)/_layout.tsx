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
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: 'black', flex: 1, margin: 0, padding: 0 },
          }}
          name="(root)"
        />
      </Stack>
    </QueryClientProvider>
  );
}
