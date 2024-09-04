import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, ActivityIndicator } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "src/context/auth";
import { config } from "config";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

export const DayDetails = () => {
  const { gestationData, jwt } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [dayInfo, setDayInfo] = useState<any>(null);
  const [note, setNote] = useState<string>("");

  const fetchDayInfo = async (weekNumber: number) => {
    try {
      const response = await fetch(`${config.API_URL}/week-all?weekNumber=${weekNumber}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const dayDetails = data[0].days.find((day: any) => day.dayNumber === gestationData.diaAtual);
      setDayInfo(dayDetails);
    } catch (error) {
      console.error("Error fetching day info:", error);
    }
  };

  useEffect(() => {
    fetchDayInfo(gestationData.semanaCorrente);
  }, [gestationData]);

  if (!dayInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3C5F47" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
      <View style={styles.sectionHeader}>
          <Ionicons name="calendar" size={30} color="#3C5F47" />
          <Text style={styles.sectionTitle}>Dia {gestationData.diaAtual}</Text>
      </View>

      <View style={styles.verseContainer}>
        <Text style={styles.verseTitle}>Versículo do dia</Text>
        <Text style={styles.verseText}>"Não se turbe o vosso coração, creiam em Deus..."</Text>
      </View>

      <View style={styles.sectionContainer}>
        
        <View style={styles.prayerContainer}>
          <Text style={styles.prayerText}>{dayInfo.pray}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.consecrationTitle}>CONSAGRAÇÃO À NOSSA SENHORA</Text>
        <View style={styles.consecrationContainer}>
          <Text style={styles.prayerText}>{dayInfo.consecration}</Text>
        </View>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.sectionTitle}>Nova anotação</Text>
        <TextInput
          style={styles.textInput}
          value={note}
          onChangeText={setNote}
          placeholder="Escreva aqui..."
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: width * 1.0
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 20,
    backgroundColor: "#F5e7e7",
    height: height * 0.12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width * 1.0
  },
  logoDavida: {
    width: width * 0.3,
  },
  verseContainer: {
    backgroundColor: "#FCE2DB",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  verseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C5F47",
    marginBottom: 5,
  },
  verseText: {
    fontSize: 14,
    color: "#3C5F47",
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C5F47",
    marginLeft: 10,
  },
  prayerContainer: {
    backgroundColor: "#F7F7F7",
    padding: 15,
    borderRadius: 10,
  },
  prayerText: {
    fontSize: 16,
    color: "#3C5F47",
  },
  consecrationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#CF6C6E",
    textAlign: "center",
    marginBottom: 10,
  },
  consecrationContainer: {
    backgroundColor: "#F7F7F7",
    padding: 15,
    borderRadius: 10,
  },
  noteContainer: {
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 15,
    height: height * 0.2,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#CF6C6E",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default DayDetails;
