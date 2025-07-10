import { apiFetch } from "@/lib/apiFetch";
import { ChannelsSet } from "@/channels-sets/types";
import {
    AddChannelsRequest,
    AddChannelsResponse,
    AnalyzeChannelsSetRequest,
    AnalyzeChannelsSetResponse,
    CancelSmartSetBuildResponse,
    ChannelsSetListResponse,
    CreateChannelsSetRequest,
    ParsingStatusResponse,
    RemoveChannelsRequest,
    RemoveChannelsResponse,
    UpdateChannelsSetRequest,
} from "@/channels-sets/api/types";

const API_ENDPOINT = "/channel-sets";

/** Get all channels sets */
export function getChannelsSets(includePublic = true, includePredefined = true) {
    return apiFetch<ChannelsSetListResponse>(API_ENDPOINT, {
        params: {
            include_public: includePublic,
            include_predefined: includePredefined,
        }
    });
}

/** Get a specific channels set by ID */
export function getChannelsSet(id: string) {
    return apiFetch<ChannelsSet>(`${API_ENDPOINT}/${id}`);
}

/** Create a new channels set (smart sets included) */
export function createChannelsSet(data: CreateChannelsSetRequest) {
    return apiFetch<ChannelsSet>(API_ENDPOINT, {
        method: "POST",
        body: data,
    });
}

/** Update a channels set */
export function updateChannelsSet(id: string, data: UpdateChannelsSetRequest) {
    return apiFetch<ChannelsSet>(`${API_ENDPOINT}/${id}`, {
        method: "PUT",
        body: data,
    });
}

/** Delete a channels set */
export function deleteChannelsSet(id: string) {
    return apiFetch<void>(`${API_ENDPOINT}/${id}`, {
        method: "DELETE",
    });
}

/** Add channels to a set */
export function addChannelsToSet(id: string, data: AddChannelsRequest) {
    return apiFetch<AddChannelsResponse>(`${API_ENDPOINT}/${id}/channels`, {
        method: "POST",
        body: data,
    });
}

/** Remove channels from a set */
export function removeChannelsFromSet(id: string, data: RemoveChannelsRequest) {
    return apiFetch<RemoveChannelsResponse>(`${API_ENDPOINT}/${id}/channels`, {
        method: "DELETE",
        body: data,
    });

}

/** Check parsing status for channels in a set */
export function checkParsingStatus(id: string) {
    return apiFetch<ParsingStatusResponse>(`${API_ENDPOINT}/${id}/parsing-status`);
}

/** Analyze a channel set */
export function analyzeChannelsSet(id: string, data: AnalyzeChannelsSetRequest) {
    return apiFetch<AnalyzeChannelsSetResponse>(`${API_ENDPOINT}/${id}/analyze`, {
        method: "POST",
        body: data,
    });
}

// Методы для умных наборов

/** Cancel smart set building */
export function cancelSmartSetBuild(id: string) {
    return apiFetch<CancelSmartSetBuildResponse>(`${API_ENDPOINT}/${id}/cancel-build`, {
        method: "POST",
    });
}

/** Get smart set build status */
export function getSmartSetBuildStatus(id: string) {
    return apiFetch<ChannelsSet>(`${API_ENDPOINT}/${id}/build-status`);
}

/** Refresh smart set status */
export function refreshSmartSetStatus(id: string) {
    return apiFetch<ChannelsSet>(`${API_ENDPOINT}/${id}`);
}
