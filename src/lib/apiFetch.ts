import { ofetch } from "ofetch";
import { Navigate } from "react-router";
import { getAuthToken } from "@/auth/api/utils";

const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = ofetch.create({
    baseURL: API_URL,
    onRequest({ options }) {
        const token = getAuthToken();
        if (token !== null) {
            options.headers.set("Authorization", `Bearer ${token}`);
        }
    },
    onResponseError({ response }) {
        if (response.status === 401) {
            Navigate({ to: "/login" });
        }
    }
});
