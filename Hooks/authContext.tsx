import { request } from '../utils/axios';
import { createContext, PropsWithChildren, use, useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Requesting permissions (essential for Android)
// Add necessary permissions to AndroidManifest.xml (e.g., ACCESS_FINE_LOCATION)
// For iOS, add NSLocationWhenInUseUsageDescription to Info.plist

const AuthContext = createContext(null);

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

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

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getLocation();
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        latitude,
        longitude,
        getLocation,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}
