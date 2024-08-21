import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import React from "react";
import { Home, Login, Signup, Terms } from "src/pages";


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Terms: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigation =
  | NativeStackNavigationProp<RootStackParamList, "Login", undefined>
  | NativeStackNavigationProp<RootStackParamList, "Signup", undefined>
  | NativeStackNavigationProp<RootStackParamList, "Home", undefined>
  | NativeStackNavigationProp<RootStackParamList, "Terms", undefined>;

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  </NavigationContainer>
);
