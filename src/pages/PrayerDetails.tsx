import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get("window");

export const PrayerDetails = ({ route, navigation }) => {
  const { title, pray } = route.params; // Receber os parâmetros passados

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="#3C5F47"
          onPress={() => navigation.goBack()} // Voltar para a tela anterior
        />
        <Image
          source={require("assets/logos/logoDavida.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Ionicons name="person" size={24} color="#3C5F47" />
      </View>
      <View style={styles.prayerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView style={styles.prayerBox}>
          <Text style={styles.prayerText}>{pray}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  header: {
    paddingTop: 20,
    backgroundColor: "#F5e7e7",
    height: height * 0.12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width
  },
  logo: {
    width: width * 0.4,
    height: height * 0.06,
  },
  prayerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    width: width * 0.9,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    flex: 1, // Allows the container to take the remaining space
    marginBottom: 20
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3C5F47",
  },
  prayerBox: {
    flex: 1, // Ensures that the ScrollView expands to fill available space
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#FFF",
  },
  prayerText: {
    fontSize: 20,
    color: "#3C5F47",
    lineHeight: 24,
  },
});

export default PrayerDetails;
