import { createDataCheckString } from "@/telegram/utils";
import type { TelegramAuthRequest, TokenResponse } from "@/auth/types";

const API_URL = import.meta.env.VITE_API_URL;
const APP_ID = import.meta.env.VITE_APP_ID;

export const authenticateWithTelegram = async (): Promise<TokenResponse> => {
    const dataCheckString = createDataCheckString();

    if (!dataCheckString) {
        throw new Error("Cannot authenticate: Not in Telegram WebApp context");
    }

    const request: TelegramAuthRequest = {
        data_check_string: dataCheckString,
    };

    try {
        const response = await fetch(
            `${API_URL}/auth/telegram/webapp?app_id=${APP_ID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            },
        );

        if (!response.ok) {
            const res = await response.json();
            console.error(res);
            throw new Error(`Authentication failed: ${response.status}`);
        }

        const data = await response.json();
        return data as TokenResponse;
    } catch (error) {
        console.error("Telegram authentication failed", error);
        throw error;
    }
};

// Функция для сохранения токена в локальное хранилище
export const saveToken = (token: TokenResponse): void => {
    localStorage.setItem("token", token.access_token);
    localStorage.setItem("token_type", token.token_type);

    if (token.expires_in) {
        const expiresAt = Date.now() + token.expires_in * 1000;
        localStorage.setItem("expires_at", expiresAt.toString());
    }

    if (token.refresh_token) {
        localStorage.setItem("refresh_token", token.refresh_token);
    }
};

// Функция для получения сохраненного токена
export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

// Проверка валидности токена
export const isTokenValid = (): boolean => {
    const token = getToken();
    if (!token) return false;

    const expiresAt = localStorage.getItem("expires_at");
    if (!expiresAt) return true; // Если срок не указан, считаем валидным

    return Number(expiresAt) > Date.now();
};
