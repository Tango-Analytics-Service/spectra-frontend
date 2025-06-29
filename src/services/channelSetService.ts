// src/services/channelSetService.ts - Обновленный с поддержкой Smart Sets
import { httpClient } from "./httpClient";
import {
  ChannelSet,
  ChannelSetListResponse,
  CreateChannelSetRequest,
  UpdateChannelSetRequest,
  AddChannelsRequest,
  RemoveChannelsRequest,
  AnalyzeChannelSetRequest,
  ParsingStatusResponse,
  SmartSetBuildStatusResponse,
  ChannelDetails,
} from "@/types/channel-sets";

const API_ENDPOINT = "/channel-sets";

export const channelSetService = {
  /**
   * Get all channel sets
   */
  getChannelSets: async (
    includePublic: boolean = true,
    includePredefined: boolean = true,
  ): Promise<ChannelSetListResponse> => {
    return httpClient.get<ChannelSetListResponse>(
      `${API_ENDPOINT}?include_public=${includePublic}&include_predefined=${includePredefined}`,
    );
  },

  /**
   * Get a specific channel set by ID
   */
  getChannelSet: async (id: string): Promise<ChannelSet> => {
    return httpClient.get<ChannelSet>(`${API_ENDPOINT}/${id}`);
  },

  /**
   * Create a new channel set (manual or smart)
   */
  createChannelSet: async (
    data: CreateChannelSetRequest,
  ): Promise<ChannelSet> => {
    return httpClient.post<ChannelSet>(API_ENDPOINT, data);
  },

  /**
   * Update a channel set
   */
  updateChannelSet: async (
    id: string,
    data: UpdateChannelSetRequest,
  ): Promise<ChannelSet> => {
    return httpClient.put<ChannelSet>(`${API_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a channel set
   */
  deleteChannelSet: async (id: string): Promise<void> => {
    return httpClient.delete(`${API_ENDPOINT}/${id}`);
  },

  /**
   * Add channels to a set (blocked for smart sets)
   */
  addChannelsToSet: async (
    id: string,
    data: AddChannelsRequest,
  ): Promise<any> => {
    return httpClient.post<any>(`${API_ENDPOINT}/${id}/channels`, data);
  },

  /**
   * Remove channels from a set
   */
  removeChannelsFromSet: async (
    id: string,
    data: RemoveChannelsRequest,
  ): Promise<any> => {
    return httpClient.delete<any>(`${API_ENDPOINT}/${id}/channels`, {
      body: JSON.stringify(data),
    });
  },

  /**
   * Check parsing status for channels in a set
   */
  checkParsingStatus: async (id: string): Promise<ParsingStatusResponse> => {
    return httpClient.get<ParsingStatusResponse>(
      `${API_ENDPOINT}/${id}/parsing-status`,
    );
  },

  /**
   * Analyze a channel set
   */
  analyzeChannelSet: async (
    id: string,
    data: AnalyzeChannelSetRequest,
  ): Promise<any> => {
    return httpClient.post<any>(`${API_ENDPOINT}/${id}/analyze`, data);
  },

  /**
   * Get smart set build status
   */
  getSmartSetBuildStatus: async (
    id: string,
  ): Promise<SmartSetBuildStatusResponse> => {
    return httpClient.get<SmartSetBuildStatusResponse>(
      `${API_ENDPOINT}/${id}/build-status`,
    );
  },

  /**
   * Cancel smart set build
   */
  cancelSmartSetBuild: async (id: string): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(
      `${API_ENDPOINT}/${id}/cancel-build`,
      {},
    );
  },

  /**
   * Get detailed info about a channel
   */
  getChannelDetails: async (
    channelId: string | number,
    username: string,
  ): Promise<ChannelDetails> => {
    return httpClient.get<ChannelDetails>(
      `/channels/${channelId || username}/details`,
    );
  },

  /**
   * Search for channels
   */
  searchChannels: async (query: string): Promise<ChannelDetails[]> => {
    return httpClient.get<ChannelDetails[]>(
      `/channels/search?q=${encodeURIComponent(query)}`,
    );
  },
};
