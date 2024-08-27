import React, { useState } from "react";
import { Image, Text, TextInput, View,  StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { useNavigation as useReactNativeNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { config } from "config";
import Snackbar from "src/components/Snackbar";

const { width, height } = Dimensions.get("window");

export const Signup = () => {

  const [ email, setEmail ] = useState<string>("");
  const [ fullName, setFullName ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ confirmPassword, setConfirmPassword ] = useState<string>("");
  const [ isVisible, setIsVisible ] = useState<boolean>(false);
  const [ snackMsg, setSnackMsg ] = useState<string>("");
  const navigation = useReactNativeNavigation<any>();

  const submitSignup = async () => {

    if (password !== confirmPassword) {
      setIsVisible(true);
      setSnackMsg("As senhas fornecidas não estão iguais, favor confira e tente novamente.");
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/user`, {
        method: "POST",
        body: JSON.stringify({
          name: fullName,
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log(data)
      console.log(response.status)

      if (response.status === 200) {
        setIsVisible(true);
        setSnackMsg("Cadastro efetuado com sucesso!");
        navigation.navigate("Login");
      }
      

    } catch (error) {
    console.error("cai no erro", error)
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerLogo}>
        <Image source={require("assets/logos/logoDavida.png")}
            style={styles.logoDavida}
            resizeMode="contain"
            />
        <View style={styles.headerText}>
          <Ionicons name="person-add" size={20} color="black" />
          <Text style={ styles.message}>Cadastro</Text>
        </View>
      </View>
      <View style={styles.containerInputs}>
        <View style={styles.containerLabel}>
          <Text>Nome Completo </Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setFullName}
          value={fullName}
        />

        <View style={styles.containerLabel}>
          <Text>Email</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          onChangeText={setEmail}
          value={email}
          style={styles.input}
        />
        
        <View style={styles.containerLabel}>
          <Text>Senha</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          onChangeText={setPassword}
          value={password}
          style={styles.input}
          secureTextEntry={true}
        />
        <View style={styles.containerLabel}>
          <Text>Confirme sua senha</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          style={styles.input}
        
        />
        <TouchableOpacity activeOpacity={0.8} style={styles.loginBtn} onPress={submitSignup}>
          <View>
            <Text style={styles.text}>Registrar</Text>
          </View>
        </TouchableOpacity>
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
        messageStyle={{ }}
        actionTextStyle={{ }}
      />
  </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    height: height * 1.0,
    width: width * 1.0,
  },
  logoDavida: {
    width: width * 0.4,
  },
  containerLogo: {
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    width: width * 1.0,
  },
  message: {
    color: "#3C5F47",
    fontSize: 20,
    textAlign: "center",
    marginLeft: 10
  },
  input: {
    borderWidth: 0.1,
    borderColor: "black",
    width: width * 0.8,
    marginBottom: 15,
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
  },
  containerInputs: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  loginBtn: {
    backgroundColor: "#CF6D6E",
    width: width * 0.8,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  text: {
    color: "#fff"
  },
  message2: {
    color: "#3C5F47",
  },
  message3: {
    color: "#3C5F47",
  },
  containerLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 4,
    width: width * 0.8,
    marginLeft: 20,
  },
  required: {
    color: "red",
    fontSize: 20,
    marginLeft: 7,
  },
  headerText: {
    flexDirection: "row",
    width: width * 0.8,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20
  }
})