import { request } from '../utils/axios';
import React, { createContext, PropsWithChildren, use, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Requesting permissions (essential for Android)
// Add necessary permissions to AndroidManifest.xml (e.g., ACCESS_FINE_LOCATION)
// For iOS, add NSLocationWhenInUseUsageDescription to Info.plist

const AuthContext = createContext(null);

export const AuthContextProvider: React.FC = ({ children }: PropsWithChildren) => {
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [radius, setRadius] = useState<number>(5);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email: string, password: string) {
    const res = await request.post(
      'http://localhost:8800/api/auth/login',
      { email, password },
      {
        withCredentials: true,
      }
    );
    console.log(res.data);
    if (res.status == 200) {
      await AsyncStorage.setItem('user', JSON.stringify(res.data.data));
      setUser(res.data.data);
    }
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem('user');
  }

  Location.requestForegroundPermissionsAsync()
    .then((status) => {
      if (status) {
        Location.getCurrentPositionAsync({}).then((location) => {
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
        });
      }
    })
    .catch(() => {});

  const setRadiusFromChild = (e: number) => {
    setRadius(e);
  };

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const continueAsGuest = () => {
    let u = { user: { id: null }, guest: true };
    setUser(u);
  };

  const contextValue = {
    user,
    login,
    latitude,
    longitude,
    setRadius,
    logout,
    continueAsGuest,
    radius,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}
