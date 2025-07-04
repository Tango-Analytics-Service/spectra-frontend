import { authenticateWithTelegram, isTokenValid, saveToken } from "@/auth/service";
import { getUserFromTelegram, isTelegramWebApp, notifyAppReady } from "@/telegram/utils";
import { create } from "zustand";

export interface AuthStore {
    isAuthenticated: boolean;
    user: WebAppUser | null;
    isLoaded: boolean;
    error: string | null;
    isTelegram: boolean;
    login: () => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>,
}

const initialState = {
    isAuthenticated: false,
    user: null,
    isLoaded: false,
    error: null,
    // isTelegram: false,
};

export const useAuthStore = create<AuthStore>((set, getState) => ({
    ...initialState,
    isTelegram: isTelegramWebApp(),

    login: async (): Promise<void> => {
        const state = getState();
        set(state => ({
            ...state,
            isLoaded: false,
            error: null,
        }));

        try {
            if (state.isTelegram) {
                // Only for dev mode, in production this should be await authenticateWithTelegram();
                const token = await authenticateWithTelegram();
                saveToken(token);
                set(state => ({ ...state, isAuthenticated: true }));
            } else {
                // Для веб-браузера можно добавить другой способ авторизации
                set(state => ({ ...state, error: "Non-Telegram authorization not supported yet" }));
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Authentication failed";
            set(state => ({ ...state, error: errorMessage }));
            console.error("Login error:", e);
        } finally {
            set(state => ({ ...state, isLoaded: true }));
        }
    },

    initialize: async () => {
        const state = getState();
        set(state => ({ ...state, isLoaded: false }));
        try {
            // Если находимся в Telegram WebApp и есть данные пользователя
            if (state.isTelegram) {
                const telegramUser = getUserFromTelegram();

                if (telegramUser) {
                    set(state => ({ ...state, user: telegramUser }));

                    // Проверим, нужна ли авторизация
                    if (!isTokenValid()) {
                        await state.login();
                    } else {
                        set(state => ({ ...state, isAuthenticated: true }));
                    }
                }

                // Сообщаем Telegram, что приложение готово
                notifyAppReady();
            } else if (isTokenValid()) {
                // Если это обычный веб-браузер и токен уже есть
                set(state => ({ ...state, isAuthenticated: true }));
                // Тут можно добавить запрос на получение данных пользователя с бэкенда
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Unknown error";
            set(state => ({ ...state, error: errorMessage }));
            console.error("Auth initialization error:", e);
        } finally {
            set(state => ({ ...state, isLoaded: true }));
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
            user: null,
        }));
    },

}));
