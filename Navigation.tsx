import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import React from "react";
import { Home, Login, Signup, Terms, Profile, Day, Weeks, Album } from "src/pages";



export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Terms: undefined;
  Profile: undefined;
  Day: undefined;
  Weeks: undefined;
  Album: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigation =
  | NativeStackNavigationProp<RootStackParamList, "Login", undefined>
  | NativeStackNavigationProp<RootStackParamList, "Signup", undefined>
  | NativeStackNavigationProp<RootStackParamList, "Home", undefined>
  | NativeStackNavigationProp<RootStackParamList, "Terms", undefined>
  | NativeStackNavigationProp<RootStackParamList, "Profile", undefined>;

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
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Day" component={Day} />
        <Stack.Screen name="Weeks" component={Weeks} />
        <Stack.Screen name="Album" component={Album} />
      </Stack.Navigator>
    </NavigationContainer>
);
