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

// Добавляем типы для умных наборов
export interface SmartSetBuildCriteria {
    filter_ids: string[];
    target_count: number;
    acceptance_threshold: number;
    batch_size: number;
    custom_prompt?: string;
}

export type SmartSetBuildStatus = "pending" | "building" | "completed" | "failed" | "cancelled";

export interface SmartSetBuildProgress {
    current_batch: number;
    channels_analyzed: number;
    channels_accepted: number;
    target_count: number;
    success_rate: number;
}

export interface ChannelsSet {
    id: string;
    name: string;
    description: string;
    is_public: boolean;
    is_predefined: boolean;
    is_owned_by_user: boolean;
    owner_id?: string;
    created_at: string;
    updated_at?: string;
    channel_count: number;
    channels: ChannelInSet[];
    all_parsed: boolean;
    permissions: ChannelsSetPermissions;
    // Поля для умных наборов
    build_criteria?: SmartSetBuildCriteria;
    build_status?: SmartSetBuildStatus;
    build_progress?: SmartSetBuildProgress;
}

export interface CreateChannelsSetRequest {
    name: string;
    description: string;
    is_public: boolean;
    build_criteria?: SmartSetBuildCriteria; // Для умных наборов
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
