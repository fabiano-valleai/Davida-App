import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, ActivityIndicator } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "src/context/auth";
import { config } from "config";
import { useNavigation } from "@react-navigation/native";
import Divider from "src/components/Divider";
import Snackbar from "src/components/Snackbar";

const { width, height } = Dimensions.get('window');

// Função para obter o nome do dia da semana em português
const getWeekday = () => {
  const options = { weekday: 'long' };
  const today = new Date();
  return new Intl.DateTimeFormat('pt-BR', options).format(today);
};

export const DayDetails = () => {
  const { gestationData, jwt, user } = useContext<any>(AuthContext);
  const navigation = useNavigation<any>();
  const [dayInfo, setDayInfo] = useState<any>(null);
  const [note, setNote] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

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

  const fetchCurrentDayAnnotation = async () => {
    try {
      const response = await fetch(`${config.API_URL}/PregnantDay?userId=${user.metadata.userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
  
      const currentAnnotation = data.find(
        (annotation: any) =>
          annotation.day === gestationData.diaAtual &&
          annotation.weekNumber === gestationData.semanaCorrente
      );
  
      if (currentAnnotation) {
        setNote(currentAnnotation.annotation);  // Atualiza a anotação no campo de texto
      } else {
        setNote("");  // Não há anotação, mantém o campo vazio
      }
    } catch (error) {
      console.error("Error fetching current day annotation:", error);
    }
  };

  const submitAnotation = async () => {
    try {
      const response = await fetch(`${config.API_URL}/PregnantDay`, {
        method: "POST",
        body: JSON.stringify({
          annotation: note,
          userId: user.metadata.userId,
          day: gestationData.diaAtual,
          weekNumber: gestationData.semanaCorrente
        }),
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        setSnackMsg("Salvo com sucesso!")
        setIsVisible(true)
        fetchCurrentDayAnnotation(); // Recarrega as anotações após salvar
      } else {
        setIsVisible(true)
        setSnackMsg("Não foi possível salvar sua edição, tente novamente mais tarde.")
      }
    } catch (error) {
      setIsVisible(true)
      setSnackMsg("Não foi possível salvar sua edição, tente novamente mais tarde.")
      console.error("Error submitting annotation:", error);
    }
  };

  useEffect(() => {
    fetchDayInfo(gestationData.semanaCorrente);
    fetchCurrentDayAnnotation();
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
        <View style={styles.titlePage}>
          <Text style={styles.headerTitle}>
            Dia {`${gestationData.diaAtual + gestationData.semanaCorrente * 7} - ${getWeekday().toLocaleUpperCase()}`}
          </Text>
        </View>
        <View style={styles.dividerStyle}>
          <Divider orientation="horizontal" width={width * 0.002} color="#CF6C6E"></Divider>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.verseTitle}>VERSÍCULO DO DIA</Text>
        <View style={styles.verseContainer}>
          <Text style={styles.verseText}>{dayInfo.Verse[0].text}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.prayTitle}>ORAÇÃO DO DIA</Text>
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
        <Text style={styles.sectionTitle}>Anotação do Dia</Text>
        <View>
          <TextInput
            style={styles.textInput}
            value={note}
            onChangeText={setNote}
            placeholder="Escreva sua anotação aqui..."
            multiline
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={ submitAnotation }>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

      <Snackbar
        message={snackMsg}
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        duration={3000} 
        position="bottom" 
        backgroundColor={snackMsg === "Salvo com sucesso!" ? "green" : "#CF6C6E"}
        textColor="white"
        actionTextColor="white"
        containerStyle={{ marginHorizontal: 8 }}
        messageStyle={{ }}
        actionTextStyle={{ }}
      />
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
    backgroundColor: "#F5E7E7",
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
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  verseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C5F47",
    marginBottom: 10,
    marginLeft: 10
  },
  verseText: {
    fontSize: 16,
    color: "#3C5F47",
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 30,
    justifyContent: "flex-start",
    width: width * 0.85,
    alignSelf: "center"
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C5F47",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CF6C6E",
    marginLeft: 20,
    marginBottom: 10,
    width: width * 0.85,
    alignSelf: "center",
  },
  prayerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.85,
    alignSelf: "center"
  },
  prayerText: {
    fontSize: 16,
  },
  consecrationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
    backgroundColor: "#CF6C6E",
    padding: 10,
    alignSelf: "center",
    borderRadius: 15,
    width: width * 0.85
  },
  consecrationContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,

    width: width * 0.85,
    alignSelf: "center"
  },
  noteContainer: {
    marginBottom: 30,
  },
  textInput: {
    padding: 15,
    height: height * 0.15,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    borderColor: "#CF6C6E",
    borderWidth: 1,
    borderRadius: 15,
    alignSelf: "center",
    width: width * 0.85
  },
  saveButton: {
    backgroundColor: "#CF6C6E",
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    alignSelf: "center",
    marginBottom: 20
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  dividerStyle: {
    width: width * 0.4,
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10
  },
  headerTitle: {
    marginTop: 15,
    fontSize: 24,
    color: "#3C5F47",
    alignSelf: "center",
    // backgroundColor: "#CF6C6E",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    fontWeight: "bold",
  },
  prayTitle: {
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#CF6C6E",
  }
});

export default DayDetails;
