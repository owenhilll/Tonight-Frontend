import { request } from '../utils/axios';
import React, { createContext, PropsWithChildren, use, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from 'expo-router/build/global-state/router-store';
import { useStorageState } from './useStorageState';

// Requesting permissions (essential for Android)
// Add necessary permissions to AndroidManifest.xml (e.g., ACCESS_FINE_LOCATION)
// For iOS, add NSLocationWhenInUseUsageDescription to Info.plist

interface AuthContextProps {
  login: (email: string, password: string) => Promise<void>;
  latitude: number;
  longitude: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  radius: number;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, session], setSession] = useStorageState('session');

  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [radius, setRadius] = useState<number>(5);

  async function login(email: string, password: string) {
    const res = await request.post(
      '/auth/login',
      { email, password },
      {
        withCredentials: true,
      }
    );

    if (res.status == 200) {
      setSession(JSON.stringify({ user: res.data.data, token: res.data.token }));
    }
  }

  async function logout() {
    setSession(null);
  }

  useEffect(() => {
    const getlocation = async () => {
      const status = await Location.requestForegroundPermissionsAsync();

      if (status) {
        const location = await Location.getCurrentPositionAsync({});

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
    };

    getlocation();
  }, []);

  const continueAsGuest = () => {
    let u = JSON.stringify({ user: { id: 0 }, guest: true, business: false });
    setSession(u);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        latitude,
        longitude,
        setRadius,
        logout,
        continueAsGuest,
        radius,
        session,
        isLoading,
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
