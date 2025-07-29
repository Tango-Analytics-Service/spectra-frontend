import { ChannelResult, AnalysisSummary } from "@/analysis/types";

export interface SearchRequest {
    search_query: string;
    categories: string[];
    channel_limit: number;
    min_subscribers: number;
    max_subscribers: number;
}

export interface StartSearchResponse {
    success: boolean;
    search_session_id: string;
    message: string;
}

export type SearchStatus =
    | "pending"
    | "processing"
    | "checking_channels"
    | "parsing_channels"
    | "starting_analysis"
    | "completed"
    | "failed";

export interface SearchSession {
    search_session_id: string;
    status: SearchStatus;
    message: string;
    search_query: string;
    categories: string[];
    channel_limit: number;
    subscribers_range: {
        min_subscribers: number;
        max_subscribers: number;
    };
    created_at: string;
    updated_at: string;
    analysis_task_id?: string;
    task_status?: unknown;
    analysis_results: ChannelResult[];
    analysis_summary: AnalysisSummary;
    error_message?: string;
}

export interface SearchHistoryResponse {
  searches: SearchSession[];
  count: number;
}