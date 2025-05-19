// src/components/auth/LoginPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const LoginPage: React.FC = () => {
  const { isAuthenticated, login, isLoading, error, isTelegram } = useAuth();
  const navigate = useNavigate();

  const telegramBotUrl =
    import.meta.env.VITE_TELEGRAM_BOT_URL ||
    "https://t.me/tango_development_personal_bot";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!isLoading) {
      await login();
    }
  };

  const renderLoginButton = () => {
    if (isTelegram) {
      return (
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all px-5 py-3"
        >
          {isLoading ? "Авторизация..." : "Войти через Telegram"}
        </Button>
      );
    } else {
      return (
        <div className="text-center">
          <p className="mb-4 text-red-400">
            Приложение должно быть открыто через Telegram
          </p>
          <a
            href={telegramBotUrl}
            className="inline-block px-5 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Открыть в Telegram
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0F172A] to-[#131c2e] text-white px-4">
      <div className="text-3xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
        SPECTRA
      </div>
      <p className="mb-6 text-blue-300 text-center">
        Аналитика и управление телеграм-каналами
      </p>

      {error && (
        <div className="mb-6 p-3 rounded-md bg-red-500/20 border border-red-500/40 text-red-300 max-w-md text-center">
          {error}
        </div>
      )}

      {renderLoginButton()}
    </div>
  );
};

export default LoginPage;
