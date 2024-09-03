import React, { useContext, useState } from "react";
import { Image, Text, TextInput, View, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Snackbar from "src/components/Snackbar";
import { AuthContext } from "src/context/auth";
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import { config } from "config";

const { width, height } = Dimensions.get("window");

export const Profile = () => {
  const { user, jwt } = useContext<any>(AuthContext);
  const [name, setName] = useState<string>(user.name);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [snackMsg, setSnackMsg] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [babyName, setBabyName] = useState<string>("");
  const [fatherName, setFatherName] = useState<string>("");
  const navigation = useNavigation<any>();

  const getFirstName = (fullName: string): string => {
    const nameParts = fullName.split(' ');
    return nameParts.slice(0, 1).join(' ');
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  }; 

  
  const submitEditProfile = async () => {
    try {
      const response = await fetch(`${config.API_URL}/metadata`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          fatherName,
          babyName,
          userId: user.metadata.userId,
          profilePicture
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });
      const data = await response.json();

      if (response.status === 200) {
        setIsVisible(true);
        setSnackMsg("Perfil editado com sucesso!")
      } else {
        setIsVisible(true);
        setSnackMsg("Não foi possivel editar seu perfil, favor verificar o preenchimento dos campos.");
      }

    } catch (error) {
      setIsVisible(true);
      setSnackMsg("Não foi possivel editar seu perfil, favor verificar o preenchimento dos campos.");
    }
  };


  return (
    <><View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profilePicture ? { uri: profilePicture } : { uri: "https://placehold.it/100x100" }}
            style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.profileName}>{getFirstName(user.name)}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Nome completo</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName} />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          editable={false}
          style={styles.input}
          value={user.email} />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Nome do bebê</Text>
        </View>
        <TextInput
          style={styles.input}
          value={babyName}
          onChangeText={setBabyName} />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Nome do pai</Text>
        </View>
        <TextInput
          style={styles.input}
          value={fatherName}
          onChangeText={setFatherName} />

        <TouchableOpacity style={styles.saveButton} onPress={submitEditProfile}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View><Snackbar
        message={snackMsg}
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        duration={3000}
        position="bottom"
        backgroundColor="#CF6D6E"
        textColor="white"
        actionTextColor="white" /></>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white", // Same background color as the example image
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "gray",
  },
  formContainer: {
    backgroundColor: "#ffffff", // Form container with white background
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  required: {
    color: "red",
    marginLeft: 2,
  },
  input: {
    borderWidth: 0.1,
    borderColor: "black",
    width: width * 0.8,
    marginBottom: 15,
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#CF6D6E",
    width: width * 0.8,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

