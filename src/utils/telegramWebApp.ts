// src/utils/telegramWebApp.ts
import { WebAppInitData } from "@/types/telegram";

export const isTelegramWebApp = (): boolean => {
  return !!window.Telegram?.WebApp;
};

export const getTelegramWebApp = () => {
  if (!isTelegramWebApp()) {
    throw new Error("Telegram WebApp is not available");
  }
  return window.Telegram!.WebApp;
};

export const getInitData = (): WebAppInitData | null => {
  if (!isTelegramWebApp()) {
    return null;
  }
  return window.Telegram!.WebApp.initDataUnsafe;
};

export const getUserFromTelegram = () => {
  if (!isTelegramWebApp()) {
    return null;
  }
  return window.Telegram!.WebApp.initDataUnsafe.user;
};

export const adaptColorScheme = () => {
  if (!isTelegramWebApp()) {
    return "dark"; // По умолчанию для TANGO
  }
  return window.Telegram!.WebApp.colorScheme;
};

export const showMainButton = (text: string, onClick: () => void) => {
  if (!isTelegramWebApp()) {
    return;
  }

  const mainButton = window.Telegram!.WebApp.MainButton;
  mainButton.setText(text);
  mainButton.onClick(onClick);
  mainButton.show();
};

export const hideMainButton = () => {
  if (!isTelegramWebApp()) {
    return;
  }

  window.Telegram!.WebApp.MainButton.hide();
};

export const setBackButton = (onClick: () => void, show: boolean = true) => {
  if (!isTelegramWebApp()) {
    return;
  }

  const backButton = window.Telegram!.WebApp.BackButton;
  backButton.onClick(onClick);

  if (show) {
    backButton.show();
  } else {
    backButton.hide();
  }
};

export const notifyAppReady = () => {
  if (!isTelegramWebApp()) {
    return;
  }

  window.Telegram!.WebApp.ready();
};

// Преобразует initData в строку проверки данных для авторизации
export const createDataCheckString = (): string => {
  if (!isTelegramWebApp()) {
    return "";
  }

  return window.Telegram!.WebApp.initData;
};
