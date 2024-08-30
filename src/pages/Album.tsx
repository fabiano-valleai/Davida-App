// Importe as dependências necessárias
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "src/hooks/useNavigation";

export const Album = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack(); // Função para voltar à tela anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termos de Uso</Text>
      <Text style={styles.content}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla commodo
        libero nec quam varius, nec tincidunt orci ultrices. Phasellus
        condimentum fringilla tempus. Duis at augue quis tortor vehicula feugiat
        vel in ante. Aliquam eget felis sed dolor sodales tempus. Nunc euismod,
        tortor sit amet posuere blandit, odio metus fermentum nulla, sit amet
        auctor lorem orci nec libero. Nulla non tortor non augue pulvinar
        dapibus. Fusce consequat consequat lobortis. Nam eu velit nec dui
        tincidunt consequat. Curabitur ut ex vel ex laoreet pharetra et vel
        nulla. Ut lacinia elementum est id dignissim.
      </Text>
      <Text style={styles.content}>
        Vestibulum convallis, risus ut viverra interdum, urna libero condimentum
        libero, ac semper turpis elit in mi. Integer id purus a ligula gravida
        pharetra. Mauris vitae purus nec metus venenatis venenatis vel vel
        nulla. Mauris sit amet risus id libero placerat pharetra. Morbi
        consequat tristique arcu, in ultricies est. Duis elementum convallis
        magna, et venenatis nisi. Cras id dapibus lorem.
      </Text>

      {/* Botão para voltar à tela de boas-vindas */}
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
