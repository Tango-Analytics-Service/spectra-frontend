import { apiFetch } from "@/lib/apiFetch";
import { TelegramAuthRequest, TokenResponse } from "@/auth/api/types";

const APP_ID = import.meta.env.VITE_APP_ID;

const API_ENDPOINT = "/auth";

export function authenticate(data: TelegramAuthRequest) {
    return apiFetch<TokenResponse>(`${API_ENDPOINT}/telegram/webapp`, {
        method: "POST",
        params: {
            app_id: APP_ID,
        },
        body: data,
    });
}

export function refreshToken(token: string) {
    return apiFetch<TokenResponse>(`${API_ENDPOINT}/refresh`, {
        method: "POST",
        headers: {
            "X-Refresh-Token": token,
        },
    });
}

export function checkPermission(permission: string) {
    return apiFetch<unknown>(`${API_ENDPOINT}/check-permission`, {
        params: {
            permission,
        },
    });
}
