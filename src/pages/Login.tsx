import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

export const Login = () => {
  const [ email, setEmail ] = useState<string>("")
  return (
      <View>
        <Text>
          Hello word!
        </Text>
      </View>
  )
}