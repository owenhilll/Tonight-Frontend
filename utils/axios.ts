import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const request = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_ENDPOINT}/api/`,
  withCredentials: true,
});
