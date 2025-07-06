import { create } from "zustand";
import { LoadStatus } from "@/lib/types";
import { authenticateWithTelegram, isTokenValid, saveToken } from "@/auth/service";
import { getUserFromTelegram, isTelegramWebApp, notifyAppReady } from "@/telegram/utils";

export interface AuthStore {
    isAuthenticated: boolean;
    user: WebAppUser | null;
    loadStatus: LoadStatus;
    error: string | null;
    login: () => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>,
}

const initialState = {
    isAuthenticated: false,
    user: null,
    loadStatus: "idle" as LoadStatus,
    error: null,
};

export const useAuthStore = create<AuthStore>((set, getState) => ({
    ...initialState,

    login: async (): Promise<void> => {
        set(state => ({
            ...state,
            loadStatus: "pending",
            error: null,
        }));

        try {
            if (isTelegramWebApp()) {
                // Only for dev mode, in production this should be await authenticateWithTelegram();
                const token = await authenticateWithTelegram();
                saveToken(token);
                set(state => ({ ...state, loadStatus: "success", isAuthenticated: true }));
            } else {
                // Для веб-браузера можно добавить другой способ авторизации
                set(state => ({ ...state, loadStatus: "error", error: "Non-Telegram authorization not supported yet" }));
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Authentication failed";
            set(state => ({ ...state, loadStatus: "error", error: errorMessage }));
            console.error("Login error:", e);
        }
    },

    initialize: async () => {
        const state = getState();
        set(state => ({ ...state, loadStatus: "pending" }));
        try {
            // Если находимся в Telegram WebApp и есть данные пользователя
            if (isTelegramWebApp()) {
                const telegramUser = getUserFromTelegram();

                if (telegramUser) {
                    set(state => ({ ...state, user: telegramUser }));

                    // Проверим, нужна ли авторизация
                    if (!isTokenValid()) {
                        await state.login();
                    } else {
                        set(state => ({ ...state, loadStatus: "success", isAuthenticated: true }));
                    }
                }

                // Сообщаем Telegram, что приложение готово
                notifyAppReady();
            } else if (isTokenValid()) {
                // Если это обычный веб-браузер и токен уже есть
                set(state => ({ ...state, loadStatus: "success", isAuthenticated: true }));
                // Тут можно добавить запрос на получение данных пользователя с бэкенда
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Unknown error";
            set(state => ({ ...state, loadStatus: "error", error: errorMessage }));
            console.error("Auth initialization error:", e);
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("refresh_token");
        set(state => ({
            ...state,
            isAuthenticated: false,
            loadStatus: "idle",
            user: null,
        }));
    },

}));
