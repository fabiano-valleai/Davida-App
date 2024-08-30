import React, { createContext, useState, ReactNode } from "react";
import { config } from "config";

interface User {
  name: string;
  email: string;
  metadata: any | null;
  customerId: string;
  subscriptionId: string | null;
  profilePictureUrl: string | null;
  createdAt: string;
}

interface AuthContextProps {
  user: User | null;
  submitLogin: (
    email: string,
    password: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setSnackMsg: React.Dispatch<React.SetStateAction<string>>,
    navigate: (screen: string) => void // Adding navigation callback as a parameter
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  submitLogin: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const submitLogin = async (
    email: string,
    password: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setSnackMsg: React.Dispatch<React.SetStateAction<string>>,
    navigate: (screen: string) => void // Receiving the navigation callback
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
      setUser(data.user);

      if (response.status === 200) {
        navigate("Home"); // Using the callback to navigate
        setLoading(false);
      }
      if ( response.status !== 200 )  {
        setIsVisible(true);
        setLoading(false);
        setSnackMsg("Não foi possível realizar o login, favor confira as credenciais fornecidas.");
      }
    } catch (error) {
      setIsVisible(true);
      setLoading(false);
      setSnackMsg(
        "Não foi possível realizar o login, favor confira as credenciais fornecidas."
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, submitLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
