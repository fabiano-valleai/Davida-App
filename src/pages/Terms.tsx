import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export const Terms = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack(); // Function to go back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termos de Uso do Aplicativo DAVIDA</Text>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.content}>
          Última atualização: 04/09/2024{"\n"}
          Bem-vindo ao aplicativo DAVIDA, desenvolvido e operado pelo Instituto Moura de Moura. 
          Ao utilizar o aplicativo DAVIDA, você concorda com os termos e condições descritos abaixo. 
          Leia atentamente antes de prosseguir.
        </Text>
        <Text style={styles.content}>
          {"\n"}1. Aceitação dos Termos{"\n"}
          Ao acessar e utilizar o aplicativo DAVIDA, você concorda em cumprir e estar legalmente vinculado a estes Termos de Uso, 
          bem como a nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não utilize o aplicativo.
        </Text>
        <Text style={styles.content}>
          {"\n"}2. Natureza Espiritual do Conteúdo{"\n"}
          O DAVIDA oferece um manual de orações diárias e consagração a Nossa Senhora para mulheres gestantes. O conteúdo disponibilizado 
          tem natureza exclusivamente espiritual e não substitui, em nenhuma circunstância, o acompanhamento, orientação ou cuidados 
          fornecidos por profissionais da saúde legalmente habilitados.
        </Text>
        <Text style={styles.content}>
          {"\n"}3. Isenção de Responsabilidade Médica{"\n"}
          O conteúdo do aplicativo DAVIDA, incluindo, mas não se limitando a orações, consagrações e reflexões, não é de caráter científico 
          ou médico. O aplicativo não se destina a diagnosticar, tratar, curar, informar ou prevenir qualquer condição médica. A gestação 
          deve ser acompanhada por profissionais de saúde qualificados, e o uso do aplicativo não dispensa a consulta a esses profissionais.
        </Text>
        <Text style={styles.content}>
          {"\n"}4. Registro de Gravidez e Coleta de Imagens{"\n"}
          O aplicativo permite o registro diário de sua gravidez por meio de orações e a coleção de imagens. Esses registros são pessoais 
          e voluntários, e o Instituto Moura de Moura não se responsabiliza pela perda ou acesso não autorizado a esses dados.
        </Text>
        <Text style={styles.content}>
          {"\n"}5. Período Gratuito e Assinatura{"\n"}
          O DAVIDA oferece um período gratuito de uso, após o qual o acesso ao aplicativo continuará mediante pagamento de uma assinatura. 
          Os detalhes da assinatura, incluindo preço e duração, serão apresentados durante o processo de inscrição. Todas as taxas são 
          não reembolsáveis, exceto conforme exigido por lei.
        </Text>
        <Text style={styles.content}>
          {"\n"}6. Propriedade Intelectual{"\n"}
          Todo o conteúdo do aplicativo, incluindo, mas não se limitando a textos, gráficos, logos, ícones, imagens e software, é de 
          propriedade do Instituto Moura de Moura ou de seus licenciadores e está protegido por leis de direitos autorais e outras leis 
          de propriedade intelectual.
        </Text>
        <Text style={styles.content}>
          {"\n"}7. Uso Indevido{"\n"}
          Você concorda em não usar o aplicativo DAVIDA para qualquer finalidade que seja ilegal ou proibida por estes Termos de Uso. 
          Qualquer uso não autorizado pode resultar na suspensão ou término de sua conta.
        </Text>
        <Text style={styles.content}>
          {"\n"}8. Modificações dos Termos{"\n"}
          O Instituto Moura de Moura reserva-se o direito de modificar estes Termos de Uso a qualquer momento. Quaisquer mudanças serão 
          comunicadas aos usuários e entrarão em vigor imediatamente após a publicação.
        </Text>
        <Text style={styles.content}>
          {"\n"}9. Limitação de Responsabilidade{"\n"}
          O Instituto Moura de Moura não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais 
          resultantes do uso ou incapacidade de uso do aplicativo, incluindo, mas não se limitando a, perda de dados, interrupção de negócios 
          ou perda de lucros.
        </Text>
        <Text style={styles.content}>
          {"\n"}10. Lei Aplicável e Jurisdição{"\n"}
          Estes Termos de Uso são regidos pelas leis do Brasil, e quaisquer disputas decorrentes destes termos ou do uso do aplicativo 
          serão resolvidas na comarca de João Pessoa-PB.
        </Text>
        <Text style={styles.content}>
          {"\n"}11. Contato{"\n"}
          Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail institutomdem@gmail.com.
        </Text>
      </ScrollView>
      {/* Button to go back */}
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
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
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
