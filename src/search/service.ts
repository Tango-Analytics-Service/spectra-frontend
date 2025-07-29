// filepath: /Users/danonchik/dev/spectra-frontend/src/search/service.ts
import { httpClient } from "@/lib/httpClient";
import { SearchRequest, StartSearchResponse, SearchSession, SearchHistoryResponse } from "./types";

const SEARCH_API_ENDPOINT = "/search";

export const searchService = {
    startSearch: (data: SearchRequest): Promise<StartSearchResponse> => {
        return httpClient.post<StartSearchResponse>(SEARCH_API_ENDPOINT, data);
    },

    getSearchResults: (sessionId: string): Promise<SearchSession> => {
        return httpClient.get<SearchSession>(`${SEARCH_API_ENDPOINT}/${sessionId}/results`);
    },
    
    getAllSearchSessions: (limit: number = 50, offset: number = 0): Promise<SearchHistoryResponse> => {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
        });
        return httpClient.get<SearchHistoryResponse>(`${SEARCH_API_ENDPOINT}/history?${params.toString()}`);
    }
};