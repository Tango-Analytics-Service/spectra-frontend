// src/services/analysisService.ts (обновленный)
import { httpClient } from "./httpClient";
import {
    AnalysisOptions,
    ChannelAnalysisRequest,
    ChannelAnalysisResponse,
    AnalysisResults,
    AnalysisTask,
    AnalysisTasksListResponse,
} from "@/types/analysis";
import { Filter } from "@/contexts/FilterContext";

const API_ENDPOINT = "/analysis";

export const analysisService = {
    /**
   * Analyze channels with selected filters
   */
    analyzeChannels: async (
        channels: string[],
        filterIds: string[],
        options?: AnalysisOptions,
    ): Promise<ChannelAnalysisResponse> => {
        const requestData: ChannelAnalysisRequest = {
            channels,
            filter_ids: filterIds,
            options,
        };

        return httpClient.post<ChannelAnalysisResponse>(
            `${API_ENDPOINT}/analyze`,
            requestData,
        );
    },

    /**
   * Get analysis results by task ID
   * @deprecated Use getUserTask instead
   */
    getAnalysisResults: async (taskId: string): Promise<AnalysisResults> => {
        return httpClient.get<AnalysisResults>(`${API_ENDPOINT}/results/${taskId}`);
    },

    /**
   * Get all available system filters
   */
    getSystemFilters: async (): Promise<Filter[]> => {
        return httpClient.get<Filter[]>(`${API_ENDPOINT}/filters-system`);
    },

    /**
   * Get all filters available to the user (system + custom)
   */
    getUserFilters: async (): Promise<Filter[]> => {
        return httpClient.get<Filter[]>(`${API_ENDPOINT}/filters`);
    },

    /**
   * Create a custom filter
   */
    createCustomFilter: async (data: unknown): Promise<Filter> => {
        return httpClient.post<Filter>(`${API_ENDPOINT}/custom-filters`, data);
    },

    /**
   * Delete a custom filter
   */
    deleteCustomFilter: async (filterId: string): Promise<void> => {
        return httpClient.delete(`${API_ENDPOINT}/custom-filters/${filterId}`);
    },

    /**
   * Get task by ID (ИСПРАВЛЕННЫЙ ENDPOINT)
   */
    getUserTask: async (taskId: string): Promise<AnalysisTask> => {
        return httpClient.get<AnalysisTask>(`/tasks/${taskId}`);
    },

    /**
   * Get all user's tasks (ИСПРАВЛЕННЫЙ ENDPOINT с правильным типом ответа)
   */
    getUserTasks: async (
        limit: number = 10,
        offset: number = 0,
        status?: string,
    ): Promise<AnalysisTasksListResponse> => {
        let url = `/tasks?limit=${limit}&offset=${offset}`;
        if (status) url += `&status=${status}`;
        return httpClient.get<AnalysisTasksListResponse>(url);
    },
};
