// src/services/analysisService.mock.ts
import {
  mockAnalysisResults,
  mockAnalysisTask,
  mockAnalysisTaskInProgress,
} from "@/mocks/analysisMock";
import { mockSystemFilters, mockUserFilters } from "@/mocks/filtersMock";
import {
  AnalysisOptions,
  AnalysisResults,
  AnalysisTask,
  ChannelAnalysisResponse,
} from "@/types/analysis";
import { Filter } from "@/contexts/FilterContext";

export const mockAnalysisService = {
  analyzeChannels: async (
    channels: string[],
    filterIds: string[],
    options?: AnalysisOptions,
  ): Promise<ChannelAnalysisResponse> => {
    return {
      success: true,
      task_id: "mock-task-" + Date.now(),
      message: "Анализ запущен успешно",
    };
  },

  getAnalysisResults: async (taskId: string): Promise<AnalysisResults> => {
    return mockAnalysisResults;
  },

  getSystemFilters: async (): Promise<Filter[]> => {
    return mockSystemFilters;
  },

  getUserFilters: async (): Promise<Filter[]> => {
    return mockUserFilters;
  },

  createCustomFilter: async (data: any): Promise<Filter> => {
    const newFilter: Filter = {
      id: `custom-${Date.now()}`,
      name: data.name,
      criteria: data.criteria,
      threshold: data.threshold || 5,
      strictness: data.strictness || 0.5,
      category: data.category || "Другое",
      created_at: new Date().toISOString(),
      is_custom: true,
    };
    return newFilter;
  },

  deleteCustomFilter: async (filterId: string): Promise<void> => {
    return;
  },

  getUserTask: async (taskId: string): Promise<AnalysisTask> => {
    // Return different task based on taskId to simulate different states
    if (taskId.includes("progress")) {
      return mockAnalysisTaskInProgress;
    }
    return mockAnalysisTask;
  },

  getUserTasks: async (
    limit: number = 10,
    offset: number = 0,
    status?: string,
  ): Promise<{ tasks: AnalysisTask[]; count: number }> => {
    return {
      tasks: [mockAnalysisTask, mockAnalysisTaskInProgress],
      count: 2,
    };
  },
};
