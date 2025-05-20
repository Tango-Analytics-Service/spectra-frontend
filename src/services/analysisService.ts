// src/services/analysisService.ts
import { httpClient } from "./httpClient";
import { mockAnalysisService } from "./analysisService.mock";
import {
  AnalysisOptions,
  ChannelAnalysisRequest,
  ChannelAnalysisResponse,
  AnalysisResults,
  AnalysisTask,
} from "@/types/analysis";
import { Filter } from "@/contexts/FilterContext";

const API_ENDPOINT = "/analysis";

// Check if we're running in Tempo
const isTempoEnvironment = import.meta.env.VITE_TEMPO === "true";

// If in Tempo environment, use mock service
export const analysisService = isTempoEnvironment
  ? mockAnalysisService
  : {
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
       * @deprecated Use userService.getUserTask instead
       */
      getAnalysisResults: async (taskId: string): Promise<AnalysisResults> => {
        return httpClient.get<AnalysisResults>(
          `${API_ENDPOINT}/results/${taskId}`,
        );
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
      createCustomFilter: async (data: any): Promise<Filter> => {
        return httpClient.post<Filter>(`${API_ENDPOINT}/custom-filters`, data);
      },

      /**
       * Delete a custom filter
       */
      deleteCustomFilter: async (filterId: string): Promise<void> => {
        return httpClient.delete(`${API_ENDPOINT}/custom-filters/${filterId}`);
      },

      /**
       * Get task by ID from user's tasks
       */
      getUserTask: async (taskId: string): Promise<AnalysisTask> => {
        return httpClient.get<AnalysisTask>(`/users/me/tasks/${taskId}`);
      },

      /**
       * Get all user's tasks
       */
      getUserTasks: async (
        limit: number = 10,
        offset: number = 0,
        status?: string,
      ): Promise<{ tasks: AnalysisTask[]; count: number }> => {
        let url = `/users/me/tasks?limit=${limit}&offset=${offset}`;
        if (status) url += `&status=${status}`;
        return httpClient.get<{ tasks: AnalysisTask[]; count: number }>(url);
      },
    };
