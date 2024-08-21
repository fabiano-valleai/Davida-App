import React from "react";
import { registerRootComponent } from "expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { config } from "./config";
import { Navigation } from "./Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export const App = registerRootComponent(() => {
  return (
    // <StripeProvider publishableKey={config.STRIPE_PUBLISHABLE_KEY}>}
    
      <SafeAreaProvider>
        <Navigation />
        <StatusBar style="light" />
      </SafeAreaProvider>
    /* </StripeProvider> */
  );
});
