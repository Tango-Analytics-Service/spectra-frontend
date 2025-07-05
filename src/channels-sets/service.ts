import { httpClient } from "@/lib/httpClient";
import {
    ChannelsSet,
    ChannelsSetListResponse,
    CreateChannelsSetRequest,
    UpdateChannelsSetRequest,
    AddChannelsRequest,
    RemoveChannelsRequest,
    AnalyzeChannelsSetRequest,
    ParsingStatusResponse,
    ChannelDetails,
} from "@/channels-sets/types";

const API_ENDPOINT = "/channel-sets";

export const channelSetService = {
    /**
     * Get all channel sets
     */
    getChannelSets: async (
        includePublic: boolean = true,
        includePredefined: boolean = true,
    ): Promise<ChannelsSetListResponse> => {
        return httpClient.get<ChannelsSetListResponse>(
            `${API_ENDPOINT}?include_public=${includePublic}&include_predefined=${includePredefined}`,
        );
    },

    /**
     * Get a specific channel set by ID
     */
    getChannelSet: async (id: string): Promise<ChannelsSet> => {
        return httpClient.get<ChannelsSet>(`${API_ENDPOINT}/${id}`);
    },

    /**
     * Create a new channel set (включая умные наборы)
     */
    createChannelSet: async (
        data: CreateChannelsSetRequest,
    ): Promise<ChannelsSet> => {
        return httpClient.post<ChannelsSet>(API_ENDPOINT, data);
    },

    /**
     * Update a channel set
     */
    updateChannelSet: async (
        id: string,
        data: UpdateChannelsSetRequest,
    ): Promise<ChannelsSet> => {
        return httpClient.put<ChannelsSet>(`${API_ENDPOINT}/${id}`, data);
    },

    /**
     * Delete a channel set
     */
    deleteChannelSet: async (id: string): Promise<void> => {
        return httpClient.delete(`${API_ENDPOINT}/${id}`);
    },

    /**
     * Add channels to a set
     */
    addChannelsToSet: async (
        id: string,
        data: AddChannelsRequest,
    ): Promise<unknown> => {
        return httpClient.post<unknown>(`${API_ENDPOINT}/${id}/channels`, data);
    },

    /**
     * Remove channels from a set
     */
    removeChannelsFromSet: async (
        id: string,
        data: RemoveChannelsRequest,
    ): Promise<unknown> => {
        return httpClient.delete<unknown>(`${API_ENDPOINT}/${id}/channels`, {
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
        data: AnalyzeChannelsSetRequest,
    ): Promise<unknown> => {
        return httpClient.post<unknown>(`${API_ENDPOINT}/${id}/analyze`, data);
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

    // Методы для умных наборов
    /**
     * Cancel smart set building
     */
    cancelSmartSetBuild: async (id: string): Promise<{ success: boolean }> => {
        return httpClient.post<{ success: boolean }>(`${API_ENDPOINT}/${id}/cancel-build`);
    },

    /**
     * Get smart set build status
     */
    getSmartSetBuildStatus: async (id: string): Promise<ChannelsSet> => {
        return httpClient.get<ChannelsSet>(`${API_ENDPOINT}/${id}/build-status`);
    },

    /**
     * Refresh smart set status
     */
    refreshSmartSetStatus: async (id: string): Promise<ChannelsSet> => {
        return httpClient.get<ChannelsSet>(`${API_ENDPOINT}/${id}`);
    },
};
