import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "src/context/auth";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

export const Home = () => {
  const { user } = useContext<any>(AuthContext);
  const navigation = useNavigation<any>();
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false);

  const getFirstTwoNames = (fullName: string): string => {
    const nameParts = fullName.split(' ');
    return nameParts.slice(0, 2).join(' ');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header sempre visível */}
      <View style={styles.header}>
        <View>
          <Ionicons
            name={isOpenMenu ? "close-circle" : "menu-sharp"} // Mudar ícone conforme estado do menu
            size={30}
            color="#3C5F47"
            onPress={() => setOpenMenu(!isOpenMenu)} // Alternar o menu e ícone
          />
        </View>
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Seja bem vinda,</Text>
          <Text style={styles.userName}>{`${getFirstTwoNames(user.name)}!`}</Text>
        </View>
        <View>
          <Ionicons name="person" size={24} color="#3C5F47" onPress={() => navigation.navigate("Profile")} />
        </View>
      </View>

      {isOpenMenu && (
        <TouchableOpacity style={styles.opacityBackground} onPress={() => setOpenMenu(false)}>
          <View />
        </TouchableOpacity>
      )}

      {isOpenMenu && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => setOpenMenu(false)}>
            <Ionicons name="close-circle" size={25} color="#3C5F47" />
          </TouchableOpacity>
          <View style={styles.contentMenu}>
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Day")}>
                <Ionicons name="calendar-number" size={25} color="#3C5F47" />
                <Text style={styles.textMenu}>Dia</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Weeks")}>
                <Ionicons name="today" size={25} color="#3C5F47" />
                <Text style={styles.textMenu}>Semana</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Subscription")}>
                <Ionicons name="cart" size={25} color="#3C5F47" />
                <Text style={styles.textMenu}>Pagamento</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Profile")}>
                <Ionicons name="person" size={25} color="#3C5F47" />
                <Text style={styles.textMenu}>Perfil</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Album")}>
                <Ionicons name="albums" size={25} color="#3C5F47" />
                <Text style={styles.textMenu}>Album</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.menuLogout} onPress={() => navigation.navigate("Login")}>
                <Ionicons name="log-out" size={25} color="#3C5F47" />
                <Text style={styles.textMenu}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={styles.mainContent}>
        <View>
          <View style={styles.containerLogo}>
            <Image
              source={require("assets/logos/logoDavida.png")}
              style={styles.logoDavida}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.message}>"Porque os filhos são um dom de Deus."</Text>
              <Text style={styles.citation}>(Sl 126, 3)</Text>
            </View>
          </View>
        </View>
        <View style={styles.containerNavigate}>
          <View style={styles.containerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate("Day")}>
              <Text>Dia</Text>
              <Ionicons name="calendar-number" size={30} color="#3C5F47" />
            </TouchableOpacity>
          </View>
          <View style={styles.containerIcons}>
            <TouchableOpacity style={styles.touchableNavigation} onPress={() => navigation.navigate("Weeks")}>
              <Text>Semanas</Text>
              <Ionicons name="today" size={30} color="#3C5F47" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Album")}>
            <View style={styles.containerIcons}>
              <Text>Album</Text>
              <Ionicons name="albums" size={30} color="#3C5F47" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.prays}>
          <Text style={styles.textIdentifier}>Orações</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.containerPray}>
              <Text>Titulo da oração</Text>
              <View style={styles.rowPray}>
                <Text style={styles.pray}>-Pai nosso que está no céus...</Text>
                <Ionicons style={styles.iconView} name="eye-sharp" size={30} color="#3C5F47" />
              </View> 
            </View>
            <View style={styles.containerPray}>
              <Text>Titulo da oração</Text>
              <View style={styles.rowPray}>
                <Text style={styles.pray}>-Pai nosso que está no céus...</Text>
                <Ionicons style={styles.iconView} name="eye-sharp" size={30} color="#3C5F47" />
              </View> 
            </View>
            <View style={styles.containerPray}>
              <Text>Titulo da oração</Text>
              <View style={styles.rowPray}>
                <Text style={styles.pray}>-Pai nosso que está no céus...</Text>
                <Ionicons style={styles.iconView} name="eye-sharp" size={30} color="#3C5F47" />
              </View> 
            </View>
            <View style={styles.containerPray}>
              <Text>Titulo da oração</Text>
              <View style={styles.rowPray}>
                <Text style={styles.pray}>-Pai nosso que está no céus...</Text>
                <Ionicons style={styles.iconView} name="eye-sharp" size={30} color="#3C5F47" />
              </View> 
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: height * 1.0,
    width: width * 1.0,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    paddingTop: 20,
    backgroundColor: "#F5e7e7",
    height: height * 0.12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 3, // Manter o cabeçalho no topo
  },
  welcome: {
    flexDirection: "row",
  },
  userName: {
    color: "#CF6C6E",
    marginLeft: 5,
    fontSize: 18,
  },
  welcomeText: {
    color: "#3C5F47",
    fontSize: 18,
  },
  logoDavida: {
    width: width * 0.60,
    alignSelf: "center",
  },
  containerLogo: {
    height: height * 0.20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  message: {
    color: "#3C5F47",
    fontSize: 16,
    textAlign: "center",
  },
  citation: {
    textAlign: "right",
    color: "#3C5F47",
  },
  containerNavigate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: height * 0.1,
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'center',
    fontSize: 20,
  },
  containerIcons: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    marginHorizontal: 20,
    height: height * 0.35,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'center',
    fontSize: 20,
    width: width * 0.9,
  },
  prays: {
    width: width * 0.9,
    alignSelf: "center",
    marginTop: 30,
  },
  rowPray: {
    flexDirection: "row",
    alignItems: "center",
  },
  pray: {
    borderWidth: 0.1,
    borderColor: "black",
    borderRadius: 4,
    padding: 15,
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  textIdentifier: {
    fontSize: 16,
    color: "#3C5F47",
    marginBottom: 15,
  },
  containerPray: {
    marginTop: 20,
    width: width * 0.8,
    alignSelf: "center",
  },
  iconView: {
    marginLeft: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  touchableNavigation: {
    alignItems: "center",
  },
  opacityBackground: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    width: width * 0.50,
    height: height,
    backgroundColor: '#fff',
    zIndex: 2,
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  mainContent: {
    flex: 1,
    zIndex: 0,
  },
  menuItem: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    width: width * 0.40,
  },
  menuLogout: {
    flexDirection: "row",
    marginTop: 370,
    alignItems: "center",
  },
  contentMenu: {
    marginTop: 30,
  },
  textMenu: {
    marginLeft: 20,
    fontSize: 18,
  },
});

