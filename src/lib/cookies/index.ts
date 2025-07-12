import { CookieOptions } from "./types";

export function setCookie(key: string, value: string, options?: CookieOptions) {
    let cookie = `${key}=${encodeURIComponent(value)}`;
    if (options === undefined) {
        document.cookie = cookie;
        return;
    }
    if (options.domain) {
        cookie += "; domain=" + options.domain;
    }
    if (options.expires) {
        cookie += "; expires=" + options.expires;
    }
    if (options["max-age"]) {
        cookie += "; max-age=" + options["max-age"];
    }
    if (options.partitioned) {
        cookie += "; partitioned";
    }
    if (options.path) {
        cookie += "; path=" + options.path;
    }
    if (options.samesite) {
        cookie += "; samesite=" + options.samesite;
    }
    if (options.secure) {
        cookie += "; secure";
    }
    document.cookie = cookie;
}

export function getCookie(key: string): string | undefined {
    const value = document.cookie
        .split(/; /g)
        .find(row => row.startsWith(key))
        ?.split("=")[1];
    if (value === undefined) {
        return undefined;
    }
    return decodeURIComponent(value);
}
