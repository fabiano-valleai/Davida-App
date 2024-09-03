import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "src/context/auth";
import { config } from "config";
import { useNavigation } from "@react-navigation/native";
import Divider from "src/components/Divider";

const { width, height } = Dimensions.get('window');

interface ImageItem {
  id: string;
  photoUrl: string;
}

export const Album: React.FC = () => {
  const { user, jwt } = useContext(AuthContext);
  const [images, setImages] = useState<ImageItem[]>([]);
  const navigation = useNavigation<any>();

  const fetchImages = async () => {
    try {
      const response = await fetch(`${config.API_URL}/pregnantWeek-all/${user?.metadata?.userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
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

      <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", marginLeft: 10 }}>
        <Ionicons name="image" style={{ marginRight: 10 }} size={24} />
        <Text style={styles.title}>
          Álbum de fotos
        </Text>
      </View>
      <Divider orientation="horizontal" width={width * 0.003} color="black" />
      <FlatList
        data={images}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.photoUrl }} style={styles.image} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.imageList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: height * 0.1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logoDavida: {
    width: width * 0.4,
    alignSelf: "center",
    height: height * 0.1,
    marginBottom: 40,
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
    overflow: 'hidden',
  },
  image: {
    width: (width / 2) - 30,
    height: (width / 2) - 30,
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: "#CF6C6E",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
    width: width * 0.5,
    alignSelf: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
});

export default Album;
