import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const request = axios.create({
  baseURL: `https://54.221.157.136.nip.io/api/`,
  withCredentials: true,
});
