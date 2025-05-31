// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { WebAppUser } from "../types/telegram";
import {
  authenticateWithTelegram,
  getToken,
  isTokenValid,
  saveToken,
} from "../services/authService";
import {
  getUserFromTelegram,
  isTelegramWebApp,
  notifyAppReady,
} from "../utils/telegramWebApp";

interface AuthContextType {
  isAuthenticated: boolean;
  user: WebAppUser | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isTelegram: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isTelegram = isTelegramWebApp();

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      try {
        // Если находимся в Telegram WebApp и есть данные пользователя
        if (isTelegram) {
          const telegramUser = getUserFromTelegram();

          if (telegramUser) {
            setUser(telegramUser);

            // Проверим, нужна ли авторизация
            if (!isTokenValid()) {
              await login();
            } else {
              setIsAuthenticated(true);
            }
          }

          // Сообщаем Telegram, что приложение готово
          notifyAppReady();
        } else if (isTokenValid()) {
          // Если это обычный веб-браузер и токен уже есть
          setIsAuthenticated(true);
          // Тут можно добавить запрос на получение данных пользователя с бэкенда
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        setError(errorMessage);
        console.error("Auth initialization error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (isTelegram) {
        // Only for dev mode, in production this should be await authenticateWithTelegram();
        const token = await authenticateWithTelegram();
        saveToken(token);
        setIsAuthenticated(true);
      } else {
        // Для веб-браузера можно добавить другой способ авторизации
        setError("Non-Telegram authorization not supported yet");
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Authentication failed";
      setError(errorMessage);
      console.error("Login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        error,
        isTelegram,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
