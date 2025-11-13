import { Slot, Stack } from 'expo-router';
import useAuth, { AuthContextProvider } from '../Hooks/authContext';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { SplashScreenController } from 'Hooks/splash';
export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}
