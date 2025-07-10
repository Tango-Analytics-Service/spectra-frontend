import { AnalysisOptions } from "@/analysis/types";
import { ChannelsSet, SmartSetBuildCriteria } from "@/channels-sets/types";

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

export interface AddChannelsResponse {
    success: boolean;
    added_channels: string[];
    channels_to_parse: string[];
    total_in_set: number;
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

export interface RemoveChannelsResponse {
    success: boolean;
    removed_channels: string[];
    total_in_set: number;
}

export interface AnalyzeChannelsSetResponse {
    success: boolean;
    message: string;
    task_id: string;
    channel_count: number;
    filter_count: number;
}

export interface CancelSmartSetBuildResponse {
    message: string;
}
