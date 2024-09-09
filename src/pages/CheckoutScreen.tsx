import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  confirmPaymentSheetPayment,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { AuthContext } from "src/context/auth";
import { useNavigation } from "@react-navigation/native";

import { config } from "config";
const windowWidth = Dimensions.get("window").width;

export function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { user, jwt } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    userInfo: "",
    isPrecanceled: false,
    endPeriod: "",
  });
  const [trialExpired, setTrialExpired] = useState(false);
  const [subscription, setSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiEndpoint = config.API_URL;
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${apiEndpoint}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const paySubscription = async (
    clientSecret: string,
    subscriptionId: string,
  ) => {
    try {
      if (clientSecret === undefined) {
        return;
      }

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Davida",
        returnURL: "stripe-example://payment-sheet",
      });
      if (initError) throw new Error(initError.message);

      const payment = await presentPaymentSheet();
      if (payment.error) {
      } else {
        setIsLoading(false);
        user!.subscriptionId = subscriptionId;
        verifyUserCondition();
      }

      const cfPayment = await confirmPaymentSheetPayment();
      console.log(cfPayment);
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  };

  async function expiredPeriodTrial(createdAt: string) {
    // Converter a string de data para um objeto Date
    const createdDate = new Date(createdAt);

    // Obter a data atual
    const currentDate = new Date();

    // Calcular a diferença em milissegundos
    const diffTime = currentDate.getTime() - createdDate.getTime();

    // Converter a diferença de tempo em dias
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Retornar true se já passou 8 dias ou mais
    return diffDays >= 7;
  }
  async function initPaymentProcess() {
    setIsLoading(true);
    const { clientSecret, subscriptionId } =
      await fetchPaymentIntentClientSecret();
    await paySubscription(clientSecret, subscriptionId);
    setIsLoading(false);
    navigation.navigate("Home");
  }

  async function getSubscriptionInfo() {
    const response = await fetch(`${apiEndpoint}/subscription-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json();
    return data;
  }

  const verifyUserCondition = async () => {
    try {
      const subsInfo = await getSubscriptionInfo();
      setUserInfo(subsInfo);
      if (subsInfo.errorCode) {
        if (subsInfo.errorCode === "USER_NOT_SUBSCRIBED") {
          setSubscriptionStatus(subsInfo.errorCode);
          setSubscription(false);

          const trial = await expiredPeriodTrial(user!.createdAt);
          if (trial) {
            setTrialExpired(trial);
            setSubscriptionStatus("EXPIRED_TRIAL");
          }
          return;
        }
      }

      if (subsInfo.status === "ACTIVE") {
        setSubscription(true);
        setSubscriptionStatus(subsInfo.status);
      }
    } catch (error) {
      console.log("Payment confirmation error", error);
    }
  };
  function getPargraph() {
    switch (subscriptionStatus) {
      case "USER_NOT_SUBSCRIBED":
        return "Assine o plano mensal e continue usando.";
      case "TRAILING":
        return "Você está no periodo de avaliação gratuita.";
      case "EXPIRED_TRIAL":
        return " Seu periodo de avaliação do app expirou \n\n Assine o plano e continue usando";
      case "ACTIVE":
        const date = new Date(userInfo.endPeriod);
        const today = new Date();

        // Calcula a diferença em milissegundos
        const diffTime = date.getTime() - today.getTime();

        // Converte a diferença de tempo para dias
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `Você ainda tem ${diffDays} dias para usar o app.`;
      default:
        break;
    }
  }
  useEffect(() => {
    verifyUserCondition();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", alignItems: "center" }}>
        {/* Logo */}
        <Image
          source={require("assets/logos/logoDavida.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Plano atual */}
        <View style={styles.currentSubscriptionContainer}>
          <Text style={styles.currentSubscriptionText}> Aproveite o app</Text>

          <Text style={styles.testPlanText}>{getPargraph()}</Text>
        </View>

        {/* Plano mensal */}
        <View style={styles.planContainer}>
          <View style={styles.planHeader}>
            <View style={styles.radioCircle} />
            <Text style={styles.planText}>Plano Mensal</Text>
          </View>
          <Text style={styles.priceText}>R$ 29,90 / mês</Text>
          {isLoading && (
            <ActivityIndicator
              style={{ marginTop: 40 }}
              size="large"
              color="#CF6C6E"
            />
          )}
        </View>
      </View>

      {/* Botões de pagamento */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
          flex: 0,
          flexDirection: "column",
          gap: 8,
          justifyContent: "space-around",
        }}
      >
        {subscriptionStatus === "EXPIRED_TRIAL" ||
          (subscriptionStatus === "USER_NOT_SUBSCRIBED" && (
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={initPaymentProcess}
            >
              <Text style={styles.paymentButtonText}>Vá para o pagamento</Text>
            </TouchableOpacity>
          ))}

        <TouchableOpacity
          style={{ ...styles.paymentButton, backgroundColor: "#a7a7a7" }}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.paymentButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  logo: {
    width: windowWidth * 0.6,
    height: 100,
    marginBottom: 20,
  },
  currentSubscriptionContainer: {
    backgroundColor: "#e0f7e8",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  currentSubscriptionText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  testPlanText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
  uploadText: {
    fontSize: 14,
    color: "#000",
    marginTop: 8,
  },
  planContainer: {
    padding: 16,
    borderRadius: 10,
    borderColor: "#e6e6e6",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: "#CF6C6E",
    borderColor: "#CF6C6E",
    marginRight: 10,
  },
  planText: {
    fontSize: 18,
    color: "#000",
  },
  priceText: {
    fontSize: 20,
    color: "#28A745",
    fontWeight: "bold",
  },
  paymentButton: {
    backgroundColor: "#CF6C6E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
