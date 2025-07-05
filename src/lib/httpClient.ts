// src/services/httpClient.ts
import { getToken } from "@/auth/service";

interface RequestOptions extends RequestInit {
    authorized?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export const httpClient = {
    get: async <T>(
        endpoint: string,
        options: RequestOptions = {},
    ): Promise<T> => {
        return await request<T>(endpoint, { ...options, method: "GET" });
    },

    post: async <T>(
        endpoint: string,
        body?: unknown,
        options: RequestOptions = {},
    ): Promise<T> => {
        return await request<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        });
    },

    put: async <T>(
        endpoint: string,
        body: unknown,
        options: RequestOptions = {},
    ): Promise<T> => {
        return await request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        });
    },

    delete: async <T>(
        endpoint: string,
        options: RequestOptions = {},
    ): Promise<T> => {
        return await request<T>(endpoint, { ...options, method: "DELETE" });
    },
};

async function request<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { authorized = true, headers = {}, ...rest } = options;

    const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

    const requestHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (authorized) {
        const token = getToken();
        if (token) {
            requestHeaders["Authorization"] = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        ...rest,
        headers: requestHeaders,
    });

    if (!response.ok) {
        // Можно добавить обработку разных статусов, например 401 для перенаправления на логин
        const error = await response.text();
        throw new Error(error || `HTTP Error: ${response.status}`);
    }

    // Для пустых ответов (например, при DELETE)
    if (response.status === 204) {
        return {} as T;
    }

    return await response.json();
}
