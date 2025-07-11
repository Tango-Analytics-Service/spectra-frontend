import { AnalysisOptions, AnalysisTaskBasic } from "@/analysis/types";

export interface AnalysisTasksListRequest {
    limit?: number;
    offset?: number;
    status?: string;
}

export interface ChannelAnalysisRequest {
    channels: string[];
    filter_ids: string[];
    options?: AnalysisOptions;
}

export interface ChannelAnalysisResponse {
    success: boolean;
    task_id: string;
    message: string;
}

export interface AnalysisTasksListResponse {
    tasks: AnalysisTaskBasic[];
    count: number;
}
