import { request } from '../utils/axios';
import React, { createContext, PropsWithChildren, use, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from 'expo-router/build/global-state/router-store';

// Requesting permissions (essential for Android)
// Add necessary permissions to AndroidManifest.xml (e.g., ACCESS_FINE_LOCATION)
// For iOS, add NSLocationWhenInUseUsageDescription to Info.plist
interface User {
  user: {
    id: number;
    name?: string;
    category?: string;
    email?: string;
    address?: string;
    city?: string;
    number?: string;
    profilepic?: string;
    state?: string;
    coordinates?: { x: string; y: string };
    website?: string;
  };
  business: boolean;
  guest?: boolean;
}
interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  latitude: number;
  longitude: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  radius: number;
  token: string;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [radius, setRadius] = useState<number>(5);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function login(email: string, password: string) {
    const res = await request.post(
      '/auth/login',
      { email, password },
      {
        withCredentials: true,
      }
    );

    if (res.status == 200) {
      await AsyncStorage.setItem('user', JSON.stringify(res.data.data));
      await AsyncStorage.setItem('token', res.data.token);
      setUser(res.data.data);
      setToken(res.data.token);
    }
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem('user');
  }

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');

        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const getlocation = async () => {
      const status = await Location.requestForegroundPermissionsAsync();

      if (status) {
        const location = await Location.getCurrentPositionAsync({});

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);

        loadAuthData();
      }
    };

    getlocation();
  }, []);

  const continueAsGuest = () => {
    let u: User = { user: { id: 0 }, guest: true, business: false };
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        latitude,
        longitude,
        setRadius,
        logout,
        continueAsGuest,
        radius,
        token,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}
