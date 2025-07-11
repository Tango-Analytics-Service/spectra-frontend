import { apiFetch } from "@/lib/apiFetch";
import { AnalysisTask } from "@/analysis/types";
import { AnalysisTasksListRequest, AnalysisTasksListResponse } from "@/analysis/api/types";

const API_ENDPOINT = "/tasks";

/** Get all user's tasks */
export function getUserTasks(data?: AnalysisTasksListRequest) {
    return apiFetch<AnalysisTasksListResponse>(API_ENDPOINT, {
        params: {
            limit: data?.limit ?? 10,
            offset: data?.offset ?? 0,
            status: data?.status,
        },
    });
}

/** Get task by ID */
export function getUserTask(id: string) {
    return apiFetch<AnalysisTask>(`${API_ENDPOINT}/${id}`);
}

