import { useNavigation as useReactNativeNavigation } from "@react-navigation/native";

export const useNavigation = () => {
  const navigation = useReactNativeNavigation();
  return navigation;
};
