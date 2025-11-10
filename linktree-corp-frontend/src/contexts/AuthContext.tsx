import React, { createContext, useContext, useState, ReactNode} from 'react';



const BASE_API_URL = process.env.REACT_APP_API_URL;


const LOGIN_ENDPOINT = `${BASE_API_URL}/api/login`;



interface AuthContextType {
  isLoggedIn: boolean;
  login: (password: string) => Promise<boolean>; 
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // 2. TORNAR A FUNÇÃO LOGIN ASSÍNCRONA E CHAMAR A API
  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
 
        body: JSON.stringify({ password }),
      });

      if (response.ok) {

        setIsLoggedIn(true);
        return true;
      }

      return false; 

    } catch (error) {
      console.error("Erro ao comunicar com a API de login:", error);

      return false; 
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};