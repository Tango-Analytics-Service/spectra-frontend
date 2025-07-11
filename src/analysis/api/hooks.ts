import { useQueries, useQuery } from "@tanstack/react-query";
import { getUserTask, getUserTasks } from "@/analysis/api/services/tasks";
import { AnalysisTask, AnalysisTaskBasic } from "@/analysis/types";

export function useFetchUserTasks() {
    return useQuery<AnalysisTaskBasic[]>({
        queryKey: ["tasks", "list"],
        async queryFn() {
            const resp = await getUserTasks();
            return resp.tasks;
        },
        placeholderData() { return []; },
        staleTime: Infinity,
    });
}

export function useFetchTaskDetails(id: string) {
    return useQuery<AnalysisTask>({
        queryKey: ["tasks", "details", id],
        queryFn() { return getUserTask(id); },
        staleTime: Infinity,
    });
}

export function useFetchUserTasksWithDetails(tasks: AnalysisTaskBasic[]) {
    return useQueries({
        queries: tasks.map(task => ({
            queryKey: ["tasks", "details", task.id],
            queryFn() { return getUserTask(task.id); },
            staleTime: Infinity,
        })),
    });
}
