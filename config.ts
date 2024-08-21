import { Platform } from "react-native";

export const config = {
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  API_URL:
    Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_API_URL_ANDROID!
      : process.env.EXPO_PUBLIC_API_URL_IOS!,
};
