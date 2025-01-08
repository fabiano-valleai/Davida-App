import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "src/context/auth";
import { config } from "config";
import { useNavigation } from "@react-navigation/native";
import Divider from "src/components/Divider";
import Feather from "@expo/vector-icons/Feather";

const { width, height } = Dimensions.get("window");

interface ImageItem {
  id: string;
  photoUrl: string;
}

export const Album: React.FC = () => {
  const { user, jwt } = useContext(AuthContext);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${config.API_URL}/pregnantWeek-all/${user?.metadata?.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Data fetch images", data);
      if (data && data.result) {
        // Mapeia os dados para o formato que precisamos para renderizar na FlatList
        const formattedImages = data.result.map((item: any) => ({
          id: item.id,
          photoUrl: item.photoUrl,
        }));
        setImages(formattedImages);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const deleteImagem = async (id: any) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza de que deseja excluir esta imagem?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Exclusão cancelada"),
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const response = await fetch(
                `${config.API_URL}/pregnantWeek/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              if (response.ok) {
                console.log("Imagem excluída com sucesso");
                const updatedImages = images.filter((image) => image.id !== id);
                setImages(updatedImages);
              } else {
                console.error("Falha ao excluir imagem:", response.status);
              }
            } catch (error) {
              console.error("Erro ao excluir imagem:", error);
            }
          },
        },
      ]
    );
  };

  const openImageModal = (photoUrl: string) => {
    setSelectedImage(photoUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="#3C5F47"
          onPress={() => navigation.navigate("Home")}
          style={{ marginLeft: 20 }}
        />
      </View>
      <Image
        source={require("assets/logos/logoDavida.png")}
        style={styles.logoDavida}
        resizeMode="contain"
      />

      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          marginLeft: 30,
        }}
      >
        <Ionicons name="image" style={{ marginRight: 10 }} size={24} />
        <Text style={styles.title}>Álbum de fotos</Text>
      </View>
      <Divider orientation="horizontal" width={width * 0.003} color="black" />
      {images.length === 0 ? (
        <Text style={styles.withoutImages}>
          Você ainda não possui imagens no seu álbum.
        </Text>
      ) : (
        <FlatList
          data={images}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => openImageModal(item.photoUrl)}>
                <Image source={{ uri: item.photoUrl }} style={styles.image} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImagem(item.id)}>
              <Feather name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.imageList}
        />
      )}

      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImageModal}
        >
          <TouchableWithoutFeedback onPress={closeImageModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={closeImageModal}>
                  <Ionicons
                    name="close-circle"
                    size={50}
                    color="white"
                    style={styles.closeButton}
                  />
                </TouchableOpacity>
                <Image source={{ uri: selectedImage }} style={styles.fullImage} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 40,
  },
  logoDavida: {
    width: width * 0.4,
    alignSelf: "center",
    height: height * 0.2
  },
  title: {
    fontSize: 20,
    marginVertical: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  imageList: {
    paddingBottom: 20,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative"
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 20,
    zIndex: 1,
  },
  image: {
    width: width / 2 - 30,
    height: width / 2 - 30,
    borderRadius: 10,
  },
  withoutImages: {
    alignSelf: "center",
    marginTop: 200,
    alignItems: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    maxWidth: width - 40,
    maxHeight: height - 80,
  },
  closeButton: {
    top: 50
  },
  fullImage: {
    width: width,
    height: height,
    resizeMode: "contain",
  },
});

export default Album;
