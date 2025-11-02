import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const request = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});


