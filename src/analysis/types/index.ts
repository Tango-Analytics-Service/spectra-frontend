import { ChannelsSet } from "@/channels-sets/types";

export enum ProcessingMode {
    BATCH = "batch",
    DIRECT = "direct",
}

export interface AnalysisOptions {
    detailed?: boolean;
    max_posts?: number;
    include_examples?: boolean;
    processing_mode?: ProcessingMode;
}

export interface ProblematicPost {
    post_id: string | number;
    url: string;
    issue: string;
}

export interface FilterResult {
    filter_id: string;
    filter_name: string;
    score: number;
    passed: boolean;
    explanation: string;
    problematic_posts: ProblematicPost[];
}

export interface ChannelResult {
    channel_id: string | number;
    channel_username: string;
    description?: string;
    filter_results: FilterResult[];
    overall_status: string;
}

export interface AnalysisSummary {
    total_channels: number;
    approved_channels: number;
    rejected_channels: number;
}

// ИСПРАВЛЕННЫЙ ТИП: Результаты анализа (соответствуют AnalysisResultsResponse)
export interface AnalysisResults {
    results: ChannelResult[];
    summary: AnalysisSummary;
}

// НОВЫЙ ТИП: Базовая информация о задаче (из списка)
export interface AnalysisTaskBasic {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    created_at: string;
    updated_at: string;
    completed_at?: string | null;
    error?: string | null;
}

// ИСПРАВЛЕННЫЙ ТИП: Полная информация о задаче (из детального запроса)
export interface AnalysisTask extends AnalysisTaskBasic {
    // Результаты анализа встроены прямо в объект задачи
    results?: ChannelResult[];
    summary?: AnalysisSummary;

    // Дополнительные поля, которые могут быть в детальном ответе
    type?: "channel_analysis";
    channel_set_id?: string;
    filter_ids?: string[];
    options?: AnalysisOptions;
    channel_usernames?: string[];
}

// ВСПОМОГАТЕЛЬНЫЙ ТИП: Для компонента AnalysisResultsCard
export interface AnalysisResultsForCard {
    results: ChannelResult[];
    summary: AnalysisSummary;
    task_id?: string;
    status?: string;
    started_at?: string;
    completed_at?: string;
    channel_set?: ChannelsSet;
}
