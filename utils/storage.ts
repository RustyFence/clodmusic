import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const storage = {
  setItem: async (key: string, value: string) => {
    if (isWeb && typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
      console.log("web");
    } else {
      await AsyncStorage.setItem(key, value);
      console.log("native");
    }
  },
  getItem: async (key: string) => {
    if (isWeb && typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  removeItem: async (key: string) => {
    if (isWeb && typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
}; 