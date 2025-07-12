import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createDataCheckString } from "@/telegram/utils";
import { authenticate, refreshToken } from "./services";
import { getAuthToken, getTokenExp, setAuthToken } from "./utils";

export interface AuthState {
    token: string;
    expires_at: Date;
}

export function useAuth() {
    const queryClient = useQueryClient();
    const authCacheKeys = ["auth"];
    return useQuery<AuthState>({
        queryKey: ["auth"],
        async queryFn() {
            const token = getAuthToken();
            if (token !== undefined) {
                const expires_in = getTokenExp(token);
                return {
                    token,
                    expires_at: new Date(Date.now() + expires_in * 1000 - 30_000),
                };
            }
            const state = queryClient.getQueryData<AuthState>(authCacheKeys);
            let resp = undefined;
            if (state === undefined) {
                const data_check_string = createDataCheckString();
                resp = await authenticate({ data_check_string });
            } else {
                resp = await refreshToken(state.token);
            }
            setAuthToken(resp.access_token, resp.expires_in);
            return {
                token: resp.access_token,
                expires_at: new Date(Date.now() + resp.expires_in * 1000 - 30_000),
            };
        },
        staleTime(query) {
            const expires_at = query.state?.data?.expires_at;
            if (expires_at === undefined) {
                return undefined;
            }
            const expires_in = expires_at.getMilliseconds() - Date.now();
            return Math.max(expires_in, 0) / 1000;
        },
    });
}
