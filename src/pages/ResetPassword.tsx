import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Snackbar from 'src/components/Snackbar';
import { config } from 'config';

// Obtenção das dimensões da tela
const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<any>();

  const [snackMsg, setSnackMsg] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!email) {
      setSnackMsg("Por favor, insira um e-mail válido.");
      setIsVisible(true);
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        setSnackMsg("E-mail de recuperação enviado com sucesso!");
      } else {
        const errorData = await response.json();
        setSnackMsg(errorData.message || "Erro ao enviar e-mail de recuperação.");
      }
    } catch (error) {
      setSnackMsg("Ocorreu um erro. Tente novamente mais tarde.");
    }
    setIsVisible(true);
  };
  

  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Image
        source={require("assets/logos/logoDavida.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Esqueceu sua senha?</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar e-mail de recuperação</Text>
      </TouchableOpacity>
      <Snackbar
        message={snackMsg}
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        duration={3000}
        position="bottom"
        backgroundColor={ snackMsg === "E-mail de recuperação enviado com sucesso!" ? "green" : "#CF6D6E"}
        textColor="white"
        actionTextColor="white" />
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.08, // 8% da largura da tela
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05, // 5% da altura da tela
    left: width * 0.05, // 5% da largura da tela
  },
  logo: {
    width: width * 0.5, // 50% da largura da tela
    height: height * 0.1, // 10% da altura da tela
    alignSelf: 'center',
    marginBottom: height * 0.05, // 5% da altura da tela
  },
  title: {
    fontSize: height * 0.03, // 3% da altura da tela
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.03, // 3% da altura da tela
    color: '#000',
  },
  label: {
    fontSize: height * 0.02, // 2% da altura da tela
    color: '#000',
    marginBottom: height * 0.01, // 1% da altura da tela
  },
  input: {
    height: height * 0.06, // 6% da altura da tela
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.04, // 4% da largura da tela
    marginBottom: height * 0.02, // 2% da altura da tela
  },
  button: {
    backgroundColor: '#D46C63',
    paddingVertical: height * 0.02, // 2% da altura da tela
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: height * 0.02, // 2% da altura da tela
  },
});

export default ForgotPasswordScreen;
