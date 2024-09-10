import React from "react";
import { registerRootComponent } from "expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Navigation } from "./Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AuthProvider from "src/context/auth";
import { config } from "config";

export const App = registerRootComponent(() => {
  return (
    <StripeProvider publishableKey={config.STRIPE_PUBLISHABLE_KEY}>
      <AuthProvider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar style="light" />
        </SafeAreaProvider>
      </AuthProvider>
    </StripeProvider>
  );
});
