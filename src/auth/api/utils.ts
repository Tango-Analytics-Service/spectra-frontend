import { getCookie, setCookie } from "@/lib/cookies/index";

const COOKIE_NAME = "spectra_auth_token";

export function getAuthToken(): string | undefined {
    return getCookie(COOKIE_NAME);
}

export function setAuthToken(token: string, expires_in: number | null) {
    setCookie(COOKIE_NAME, token, {
        path: "/",
        samesite: "strict",
        "max-age": expires_in === null ? undefined : expires_in.toString(),
        expires: expires_in === null ? undefined : new Date(Date.now() + expires_in * 1000).toUTCString(),
        secure: process.env.NODE_ENV === "production",
    });
}

export function getTokenExp(token: string): number | null {
    const jwt = parseJWT(token);
    if (jwt === null) {
        return null;
    }
    const payload = jwt.payload;
    if (typeof payload === "object"
        && payload !== null
        && "exp" in payload
        && typeof payload.exp === "number"
    ) { return payload.exp; }
    return null;
}

export function parseJWT(token: string): { header: unknown; payload: unknown } | null {
    try {
        const raw = token.split(".");
        return {
            header: JSON.parse(atob(raw[0])),
            payload: JSON.parse(atob(raw[1])),
        };
    } catch {
        return null;
    }
}
