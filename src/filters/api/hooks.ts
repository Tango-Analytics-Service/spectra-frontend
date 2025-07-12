import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomFilter, deleteCustomFilter, getSystemFilters, getUserFilters } from "./services";
import { Filter } from "@/filters/types";
import { FilterCreateRequest } from "@/filters/api/types";

export function useFetchUserFilters() {
    return useQuery({
        queryKey: ["filters", "list", "user"],
        queryFn() { return getUserFilters(); },
        placeholderData() { return []; },
        staleTime: Infinity,
    });
}

export function useFetchSystemFilters() {
    return useQuery({
        queryKey: ["filters", "list", "system"],
        queryFn() { return getSystemFilters(); },
        placeholderData() { return []; },
        staleTime: Infinity,
    });
}

export function useFetchFilters() {
    const queryClient = useQueryClient();
    const systemFiltersCacheKeys = ["filters", "list", "system"];
    const userFiltersCacheKeys = ["filters", "list", "user"];
    return useQuery({
        queryKey: ["filters", "list"],
        async queryFn() {
            const [user, system] = await Promise.all([getUserFilters(), getSystemFilters()]);
            return [...system, ...user];
        },
        initialData() {
            const system = queryClient.getQueryData<Filter[]>(systemFiltersCacheKeys) ?? [];
            const user = queryClient.getQueryData<Filter[]>(userFiltersCacheKeys) ?? [];
            return [...system, ...user];
        },
        initialDataUpdatedAt() {
            return Math.min(queryClient.getQueryState(systemFiltersCacheKeys)?.dataUpdatedAt,
                queryClient.getQueryState(userFiltersCacheKeys)?.dataUpdatedAt);
        },
        staleTime: Infinity,
    });
}

export function useCreateCustomFilter() {
    const queryClient = useQueryClient();
    const userFiltersCacheKeys = ["filters", "list", "user"];
    return useMutation({
        mutationFn(req: FilterCreateRequest) { return createCustomFilter(req); },
        onMutate(req) {
            const newFilter = {
                id: Math.random().toString(),
                name: req.name,
                criteria: req.criteria,
                threshold: req.threshold,
                strictness: req.strictness,
                category: req.category,
                created_at: new Date().toISOString(),
                is_custom: true,
            } satisfies Filter;
            queryClient.setQueryData<Filter[]>(userFiltersCacheKeys, oldFilters => {
                return [newFilter, ...oldFilters];
            });
            return { newFilter };
        },
        onError(_error, _req, context) {
            queryClient.setQueryData<Filter[]>(userFiltersCacheKeys, oldFilters => {
                return oldFilters.filter(filter => filter.id != context.newFilter.id);
            });
        },
        onSuccess(data, _req, context) {
            queryClient.setQueryData<Filter[]>(userFiltersCacheKeys, oldFilters => {
                const filters = [...oldFilters];
                const idx = filters.findIndex(filter => filter.id === context.newFilter.id);
                if (idx === -1) {
                    return filters;
                }
                filters[idx] = data;
                return filters;
            });
        },
    });
}

export function useDeleteCustomFilter() {
    const queryClient = useQueryClient();
    const userDiltersCacheKeys = ["filters", "list", "user"];
    return useMutation({
        mutationFn(id: string) { return deleteCustomFilter(id); },
        onMutate(id) {
            let deletedFilter: Filter = undefined;
            queryClient.setQueryData<Filter[]>(userDiltersCacheKeys, oldFilters => {
                const filters = [...oldFilters];
                const idx = filters.findIndex(filter => filter.id === id);
                if (idx === -1) {
                    return filters;
                }
                deletedFilter = filters.splice(idx, 1)[0];
                return filters;
            });
            return { deletedFilter };
        },
        onError(_error, _id, context) {
            if (context.deletedFilter === undefined) {
                return;
            }
            queryClient.setQueryData<Filter[]>(userDiltersCacheKeys, oldFilters => {
                return [...oldFilters, context.deletedFilter];
            });
        },
    });
}
