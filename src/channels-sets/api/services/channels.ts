import { apiFetch } from "@/lib/apiFetch";
import { ChannelDetails } from "@/channels-sets/types";

const API_ENDPOINT = "/channels";

/// Get detailed info about a channel
export function getChannelDetails(id: string) {
    return apiFetch<ChannelDetails>(`${API_ENDPOINT}/${id}/details`);
}

/// Search for channels
export function searchChannels(query: string) {
    return apiFetch<ChannelDetails[]>(`${API_ENDPOINT}/search`, {
        params: {
            q: query,
        }
    });
}
