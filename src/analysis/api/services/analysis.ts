import { apiFetch } from "@/lib/apiFetch";
import { ChannelAnalysisRequest, ChannelAnalysisResponse } from "@/analysis/api/types";

const API_ENDPOINT = "/analysis";

/** Analyze channels with selected filters */
export function analyzeChannels(data: ChannelAnalysisRequest) {
    return apiFetch<ChannelAnalysisResponse>(`${API_ENDPOINT}/analyse`, {
        method: "POST",
        body: data,
    });
}
