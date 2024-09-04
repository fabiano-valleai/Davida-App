import React, { createContext, useState, useEffect, ReactNode } from "react";
import { config } from "config";

// Interfaces existentes
interface Metadata {
  id: string;
  userId: string;
  conceptionDate: string | null;
  expectedBirthDate: string | null;
  babyName: string | null;
  fatherName: string | null;
  birthDate: string | null;
  gestationPeriod?: number; // Pode ser opcional
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  email: string;
  metadata: Metadata | null;
  customerId: string;
  subscriptionId: string | null;
  profilePicture: string | null;
  createdAt: string;
}

interface GestationData {
  semanaCorrente: number;
  diaAtual: number; // Refere-se ao dia absoluto na gestação
}

interface AuthContextProps {
  user: User | null;
  submitLogin: (
    email: string,
    password: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setSnackMsg: React.Dispatch<React.SetStateAction<string>>,
    navigate: (screen: string) => void
  ) => Promise<void>;
  jwt: string | undefined;
  gestationData: GestationData;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  submitLogin: async () => {},
  jwt: "",
  gestationData: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

const calcularDiaAtual = (dataCadastro: string, semanaCadastro: number | undefined): GestationData => {
  const dataInicial = new Date(dataCadastro);
  const dataAtual = new Date();

  // Zera as horas para comparar apenas as datas
  const inicioDiaCadastro = new Date(dataInicial.setHours(0, 0, 0, 0));
  const inicioDiaAtual = new Date(dataAtual.setHours(0, 0, 0, 0));

  // Calcula a diferença em dias, ignorando o horário
  const diffDays = Math.floor((inicioDiaAtual.getTime() - inicioDiaCadastro.getTime()) / (1000 * 60 * 60 * 24));

  // Determina a semana e o dia atual na semana
  const semanasCompletas = Math.floor(diffDays / 7);
  const diaAtualNaSemana = (diffDays % 7) + 1; // Ajuste para 1-7

  // Calcula a semana corrente
  const semanaCorrente = (semanaCadastro ?? 1) + semanasCompletas;

  return {
    semanaCorrente: semanaCorrente,
    diaAtual: diaAtualNaSemana, // Retorna o dia dentro da semana corrente
  };
};



const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string>();
  const [gestationData, setGestationData] = useState<GestationData | null>(null);

  useEffect(() => {
    if (user && user.metadata) {
      const gestationInfo = calcularDiaAtual(user.metadata.createdAt, user.metadata.gestationPeriod);
      setGestationData(gestationInfo);
    }
  }, [user]);
  
  
  const submitLogin = async (
    email: string,
    password: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setSnackMsg: React.Dispatch<React.SetStateAction<string>>,
    navigate: (screen: string) => void
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setUser(data.user);
        setJwt(data.jwt);
        navigate("Home");
      } else {
        setIsVisible(true);
        setSnackMsg("Não foi possível realizar o login, favor confira as credenciais fornecidas.");
      }
    } catch (error) {
      setIsVisible(true);
      setSnackMsg("Não foi possível realizar o login, favor confira as credenciais fornecidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, submitLogin, jwt, gestationData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
