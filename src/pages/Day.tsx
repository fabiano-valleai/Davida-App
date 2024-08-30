// Importe as dependências necessárias
import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
const { width, height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "src/context/auth";

export const Day = () => {
  const navigation = useNavigation<any>();
  const { user } = useContext<any>(AuthContext);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View>
          <Ionicons
            name="arrow-back"
            size={30}
            color="#3C5F47"
            onPress={() => navigation.navigate("Home")} 
          />
        </View>
        <View>
          <Image
            source={require("assets/logos/logoDavida.png")}
            style={styles.logoDavida}
            resizeMode="contain"
          />
        </View>
        <View>
          <Ionicons name="person" size={24} color="#3C5F47" onPress={() => navigation.navigate("Profile")} />
        </View>
      </View>
    </View>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  mainContainer: {
    height: height * 1.0,
    width: width * 1.0,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 20,
    backgroundColor: "#F5e7e7",
    height: height * 0.12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  logoDavida: {
    width: width * 0.3
  }
});
