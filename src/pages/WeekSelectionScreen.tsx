import React, { useContext, useState, useEffect, memo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal, Button, Alert, ImageBackground } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "src/context/auth";
import Divider from "src/components/Divider";
import * as ImagePicker from 'expo-image-picker';
import { config } from "config";

const { width } = Dimensions.get('window');

// Função para buscar imagens
const fetchImages = async (userId : string, jwt : string, setImages : any) => {
  try {
    const response = await fetch(`${config.API_URL}/pregnantWeek-all/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data && data.result) {
      const formattedImages = data.result.map((item: any) => ({
        id: item.id,
        weekNumber: item.weekNumber,
        photoUrl: item.photoUrl,
      }));
      setImages(formattedImages);
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// Função para buscar a descrição do bebê na semana
const fetchBabyDescription = async (weekNumber : any , jwt : string, setBabyDescription : any) => {
  try {
    const response = await fetch(`${config.API_URL}/week-all?weekNumber=${weekNumber}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data && data.length > 0) {
      setBabyDescription(data[0].weekBabyDescription);
    }
  } catch (error) {
    console.error("Error fetching baby description:", error);
  }
};


// Componente de Dias da Semana (com React.memo)
const DayCircle = memo(({ day, currentDay, currentWeek, selectedWeek, onPress } : any )  => {
  // Ajuste de lógica para o dia atual e semanas futuras
  const isFutureDay = (selectedWeek > currentWeek) || (selectedWeek === currentWeek && day > currentDay);

  return (
    <TouchableOpacity
      style={[
         isFutureDay ? styles.dayCircleDisabled : styles.dayCircle,
      ]}
      onPress={() => onPress(day)}
      disabled={isFutureDay}  // Desabilita dias futuros
    >
      <Text style={styles.dayText}>{day}</Text>
    </TouchableOpacity>
  );
});





// Componente de Semanas (com React.memo)
const WeekItem = memo(({ week, isWeekPassed, selectedWeek, setSelectedWeek, handleDayPress, submitWeekPhoto, currentWeek, currentDay, images, jwt } : any) => {
  const startDayOfWeek = (week - 1) * 7 + 1;  // Calcula o primeiro dia da semana
  const days = Array.from({ length: 7 }, (_, i) => i + 1);  // Apenas os dias de 1 a 7 para a semana

  const [weekPicture, setWeekPicture] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [babyDescription, setBabyDescription] = useState<string | null>(null); 

  // Verifica se existe uma imagem para a semana
  const imageForThisWeek = images.find((img : any) => img.weekNumber === week);

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
      setWeekPicture(result.assets[0].uri);
      await submitWeekPhoto(result.assets[0].uri);  // Faz o POST da foto automaticamente
    }
  };

  // Função chamada ao selecionar a semana para obter o desenvolvimento do bebê
  const onWeekSelect = async () => {
    setSelectedWeek(week);
    fetchBabyDescription(week, jwt, setBabyDescription);  // Busca a descrição do bebê da semana selecionada
  };

  return (
    <View style={styles.weekContainer}>
      <TouchableOpacity
        style={[
          styles.weekDropdown,
          isWeekPassed ? styles.weekPassedTitle : styles.weekDontPass 
        ]}
        onPress={onWeekSelect}
      >
        <Text style={styles.weekText}>{`${week}ª Semana`}</Text>
        <Ionicons name={selectedWeek === week ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="#000" />
      </TouchableOpacity>

      {selectedWeek === week && (
        <View>
          <View style={{width: width * 0.5, alignSelf: "center", paddingTop: 20}}>
            <Text style={styles.dayIndi}>Dias</Text>
            <Divider orientation="horizontal" width={width * 0.003} color="black" />
          </View>
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <DayCircle
                key={day}
                day={day}
                currentDay={currentDay}
                currentWeek={currentWeek}
                selectedWeek={selectedWeek}
                onPress={handleDayPress}
              />
            ))}
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.cardLeft}>
              <Text style={styles.prayerText}>Desenvolvimento do bebê na semana</Text>
              <TouchableOpacity style={styles.moreButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.moreButtonText}>ver mais</Text>
              </TouchableOpacity>
            </View>

            {imageForThisWeek ? (
              <ImageBackground source={{ uri: imageForThisWeek.photoUrl }} style={styles.imageBackground}>
                <Ionicons name="camera-outline" size={24} color="#fff" />
                <Text style={styles.addPhotoButtonText}>Foto da semana</Text>
              </ImageBackground>
            ) : (
              <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                {weekPicture ? (
                  <ImageBackground source={{ uri: weekPicture }} style={styles.imageBackground}>
                    <Ionicons name="camera-outline" size={24} color="#fff" />
                    <Text style={styles.addPhotoButtonText}>Alterar foto da semana</Text>
                  </ImageBackground>
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={24} color="#fff" />
                    <Text style={styles.addPhotoButtonText}>Adicionar foto da semana</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Desenvolvimento do Bebê</Text>
                <Text style={styles.modalText}>
                  {babyDescription || "Não há descrição disponível para esta semana."}
                </Text>
                <Button title="Fechar" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
});

export const WeekSelectionScreen = () => {
  const { gestationData, jwt, user } = useContext<any>(AuthContext);
  const navigation = useNavigation<any>();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const currentWeek = gestationData.semanaCorrente;
  const currentDay = gestationData.diaCorrente;
  const [images, setImages] = useState([]);
  const weeks = Array.from({ length: 40 }, (_, i) => i + 1);

  useEffect(() => {
    fetchImages(user?.metadata?.userId, jwt, setImages);
  }, []);

  const isWeekPassed = (week: number) => {
    return week <= currentWeek;
  };

  const handleDayPress = (day: number) => {
    if (selectedWeek !== null) {
      navigation.navigate('DayDetails', { selectedDay: day, selectedWeek });
    } else {
      Alert.alert("Erro", "Nenhuma semana selecionada");
    }
  };

  // Função que faz o upload da foto da semana ao backend
  const submitWeekPhoto = async (photoUri: string) => {
    try {
      const formData : any = new FormData();
      formData.append('userId', user.metadata.userId);
      formData.append('weekNumber', selectedWeek);
  
      if (photoUri) {
        formData.append('photo', {
          uri: photoUri,
          name: 'photo.jpg',
          type: 'image/jpeg'
        });
      }
      
      const response = await fetch(`${config.API_URL}/pregnantWeek`, {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jwt}`
        }
      });
  
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={30} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Semanas</Text>
      </View>
      <View style={styles.containerDivider}>
        <Divider orientation="horizontal" width={width * 0.002} color="#CF6C6E" />
      </View>

      <FlatList
        data={weeks}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item: week }) => (
          <WeekItem
            week={week}
            isWeekPassed={isWeekPassed(week)}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            handleDayPress={handleDayPress}
            submitWeekPhoto={submitWeekPhoto}
            currentWeek={currentWeek}
            currentDay={currentDay}
            images={images}
            jwt={jwt}
          />
        )}
        windowSize={5}
        extraData={selectedWeek}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10
  },
  weekContainer: {
    marginBottom: 20,
  },
  weekDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center"
  },
  weekPassedTitle: {
    backgroundColor: "#CEF2D4",
  },
  weekText: {
    fontSize: 18,
    color: "#3C5F47"
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10
  },
  containerDivider: {
    marginBottom: 20,
    alignSelf: "center"
  },
  weekDontPass: {
    color: "#FCE2DB"
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  cardLeft: {
    flex: 1,
  },
  prayerText: {
    color: "#CF6C6E",
    fontSize: 16,
    fontWeight: "bold",
  },
  moreButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  moreButtonText: {
    color: "#000",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  imageBackground: {
      width: 120,  // Largura fixa para a imagem
      height: 80,  // Altura fixa para a imagem
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
    imageOverlay: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',  // Leve escurecimento para destacar o texto
      width: '100%',
      height: '100%',
    },
    addPhotoButton: {
      width: 120,
      height: 80,
      backgroundColor: "#CF6C6E",
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    addPhotoButtonText: {
      color: "#fff",
      fontSize: 12,
      textAlign: "center",
    },
    dayCurrent: {
      backgroundColor: "#FFA500",
    },
      dayCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        backgroundColor: "grey",
      },
      dayCircleDisabled: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        backgroundColor: "grey",
        opacity: 0.5
      },
      dayText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
      },
      dayIndi: {
        alignItems: "center",
        textAlign: "center",
        fontSize: 16,
        marginBottom: 10,
        fontWeight: "bold"
      }
  });

export default WeekSelectionScreen;
