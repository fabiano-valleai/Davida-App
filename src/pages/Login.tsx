import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Snackbar from "src/components/Snackbar";
import { AuthContext } from "src/context/auth";

const { width, height } = Dimensions.get("window");

export const Login = () => {
  const { submitLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const navigation = useNavigation<any>();

  const handleLogin = () => {
    submitLogin(
      email,
      password,
      setLoading,
      setIsVisible,
      setSnackMsg,
      navigation.navigate,
    );
  };

  return (  
      <View style={styles.mainContainer}>
        <View style={styles.containerLogo}>
          <Image source={require("assets/logos/logoDavida.png")}
              style={styles.logoDavida}
              resizeMode="contain"
              />
        <Text style={ styles.message}>"Um milagre de Deus acontecendo em você."</Text>
        </View>
        <View style={styles.containerInputs}>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email.toLowerCase()}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Senha"
          />
          <TouchableOpacity activeOpacity={0.8} style={styles.loginBtn} onPress={handleLogin}>
            <View>
              <Text style={styles.text}>{ isLoading ? "Carregando..." : "Login"}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.hrefs}>
              <Text style={styles.message2}  onPress={ () => navigation.navigate("ResetPassword")}>Esqueceu sua senha?</Text>
              <Text style={styles.message3} onPress={ () => navigation.navigate("Signup")}>Cadastre-se</Text>
          </View>
        </View>
        <Snackbar
        message={snackMsg}
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        duration={3000}
        position="bottom"
        backgroundColor="#CF6D6E"
        textColor="white"
        actionTextColor="white"
        containerStyle={{ marginHorizontal: 8 }}
        messageStyle={{}}
        actionTextStyle={{}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: height * 1.0,
    width: width * 1.0,
  },
  logoDavida: {
    width: width * 0.5,
  },
  containerLogo: {
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    width: width * 1.0,
  },
  message: {
    color: "#3C5F47",
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 0.2,
    borderColor: "black",
    width: width * 0.8,
    marginBottom: 30,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  containerInputs: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtn: {
    backgroundColor: "#CF6D6E",
    width: width * 0.8,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  message2: {
    color: "#3C5F47",
  },
  message3: {
    color: "#3C5F47",
  },
  hrefs: {
    marginTop: 10,
    width: width * 1.0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
