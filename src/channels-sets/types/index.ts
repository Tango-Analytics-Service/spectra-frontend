import { AnalysisOptions } from "@/analysis/types";

export interface ChannelsSetPermissions {
    can_view: boolean;
    can_edit: boolean;
    can_manage_channels: boolean;
    can_delete: boolean;
    can_analyze: boolean;
}

export interface ChannelInSet {
    username: string;
    channel_id?: number;
    is_parsed: boolean;
    added_at: string;
}

export interface ChannelsSet {
    id: string;
    name: string;
    description: string;
    is_public: boolean;
    is_predefined: boolean;
    is_owned_by_user: boolean; // Новое поле
    owner_id?: string; // Новое поле
    created_at: string;
    updated_at?: string;
    channel_count: number;
    channels: ChannelInSet[];
    all_parsed: boolean;
    permissions: ChannelsSetPermissions; // Новое поле с правами доступа
}

export interface CreateChannelsSetRequest {
    name: string;
    description: string;
    is_public: boolean;
}

export interface UpdateChannelsSetRequest {
    name?: string;
    description?: string;
    is_public?: boolean;
}

export interface AddChannelsRequest {
    usernames: string[];
}

export interface RemoveChannelsRequest {
    usernames: string[];
}

export interface AnalyzeChannelsSetRequest {
    filter_ids: string[];
    options?: AnalysisOptions;
}

export interface ChannelsSetListResponse {
    sets: ChannelsSet[];
    count: number;
}

export interface ParsingStatusResponse {
    success: boolean;
    all_parsed: boolean;
    total_channels: number;
    parsed_channels: number;
    unparsed_channels: number;
    newly_parsed: string[];
    still_unparsed: string[];
    channels_status: unknown[];
    message?: string;
}

// Дополнительные типы для удобства
export interface ChannelDetails {
    username: string;
    title?: string;
    stats?: {
        subscribers_count: number;
        average_views: number;
    };
}

export enum ChannelParsingStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
}
