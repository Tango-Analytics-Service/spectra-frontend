import { httpClient } from "@/lib/httpClient";
import { Filter, FilterCreateRequest } from "./types";

export const filtersService = {
    /**
     * Get available system filters
     */
    getSystemFilters() {
        return httpClient.get<Filter[]>("/analysis/filters");
    },

    /**
     * Get all filters available to user
     */
    getUserFilters() {
        return httpClient.get<Filter[]>("/analysis/filters");
    },

    /**
     * Create a custom filter
     */
    createCustomFilter(data: FilterCreateRequest) {
        return httpClient.post<Filter>("/analysis/custom-filters", data);
    },

    /**
     * Delete a custom filter created by user
     */
    deleteCustomFilter(filterId: string) {
        return httpClient.delete(`/analysis/custom-filters/${filterId}`);
    },
};
