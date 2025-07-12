import { apiFetch } from "@/lib/apiFetch";
import { Filter } from "@/filters/types";
import { FilterCreateRequest } from "@/filters/api/types";

/** Get available system filters */
export function getSystemFilters() {
    return apiFetch<Filter[]>("/analysis/filters-system");
}

/** Get all filters available to user */
export function getUserFilters() {
    return apiFetch<Filter[]>("/analysis/filters");
}

/** Create a custom filter */
export function createCustomFilter(data: FilterCreateRequest) {
    return apiFetch<Filter>("/analysis/custom-filters", {
        method: "POST",
        body: data,
    });
}

/** Delete a custom filter created by user */
export function deleteCustomFilter(filterId: string) {
    return apiFetch(`/analysis/custom-filters/${filterId}`, {
        method: "DELETE",
    });
}
