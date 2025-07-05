export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface TelegramAuthRequest {
    data_check_string: string;
}

