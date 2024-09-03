import React, { useState } from "react";
import { Image, Text, TextInput, View,  StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { useNavigation as useReactNativeNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { config } from "config";
import Snackbar from "src/components/Snackbar";
import { z } from "zod";

const { width, height } = Dimensions.get("window");

const SignupSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  fullName: z.string().min(1, "Nome completo é obrigatório."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirmPassword: z.string(),
  weekPregnancy: z.number().min(1, "A semana de gravidez deve ser maior ou igual a 1.").max(40, "A semana de gravidez não pode ser maior que 40."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas fornecidas não estão iguais, favor confira e tente novamente.",
  path: ["confirmPassword"],
});


export const Signup = () => {

  const [ email, setEmail ] = useState<string>("");
  const [ fullName, setFullName ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ confirmPassword, setConfirmPassword ] = useState<string>("");
  const [ isVisible, setIsVisible ] = useState<boolean>(false);
  const [ snackMsg, setSnackMsg ] = useState<string>("");
  const navigation = useReactNativeNavigation<any>();
  const [ weekPregnancy, setWeekPregnancy] = useState<string>();


  const submitSignup = async () => {
    try {
      // Verifica se weekPregnancy está definido e não é vazio antes de tentar converter
      const weekPregnancyNumber = weekPregnancy && weekPregnancy.trim() !== "" ? Number(weekPregnancy) : NaN;
  
      // Verifica se o valor é um número válido
      if (isNaN(weekPregnancyNumber)) {
        setIsVisible(true);
        setSnackMsg("Por favor, insira uma semana válida de gravidez.");
        return;
      }
  
      // Fazendo a validação com Zod
      const parsedData = SignupSchema.parse({
        email,
        fullName,
        password,
        confirmPassword,
        weekPregnancy: weekPregnancyNumber,
      });
      
      const response = await fetch(`${config.API_URL}/user`, {
        method: "POST",
        body: JSON.stringify({
          name: parsedData.fullName,
          email: parsedData.email,
          password: parsedData.password,
          weekPregnancy: parsedData.weekPregnancy,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log(response)

      if (response.status === 200) {
        setIsVisible(true);
        setSnackMsg("Cadastro efetuado com sucesso!");
        navigation.navigate("Login");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        setIsVisible(true);
        setSnackMsg(firstError.message);
      } else {
        console.error("Erro inesperado", error);
      }
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
            <Text>Em qual semana da gravidez você está?</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TextInput
             onChangeText={(text) => setWeekPregnancy(text.replace(/[^0-9]/g, ''))}
            value={weekPregnancy}
            style={styles.input}
            placeholder="Ex: 2"
            keyboardType="numeric"
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