import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    addChannelsToSet,
    cancelSmartSetBuild,
    createChannelsSet,
    deleteChannelsSet,
    getChannelsSet,
    getChannelsSets,
    refreshSmartSetStatus,
    removeChannelsFromSet,
    updateChannelsSet,
} from "@/channels-sets/api/services/channels-sets";
import { CreateChannelsSetRequest, UpdateChannelsSetRequest } from "@/channels-sets/api/types";
import { ChannelInSet, ChannelsSet } from "@/channels-sets/types";

export function useFetchChannelsSets() {
    return useQuery<ChannelsSet[]>({
        queryKey: ["channels-sets", "list"],
        async queryFn() {
            const response = await getChannelsSets();
            return response.sets;
        },
        placeholderData() { return []; },
        staleTime: Infinity,
    });
}

export function useFetchChannelsSet(id: string) {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    return useQuery({
        queryKey: ["channels-sets", "single", id],
        async queryFn() {
            const set = await getChannelsSet(id);
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(s => s.id === id);
                if (idx === -1) {
                    sets.push(set);
                } else {
                    sets[idx] = set;
                }
                return sets;
            });
            return set;
        },
        initialData() {
            const sets = queryClient.getQueryData<ChannelsSet[]>(setsCacheKeys);
            return sets?.find(set => set.id === id);
        },
        initialDataUpdatedAt() {
            return queryClient.getQueryState(setsCacheKeys)?.dataUpdatedAt;
        },
        subscribed: false,
    });
}

export function useCreateChannelsSet() {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    return useMutation({
        mutationFn(req: CreateChannelsSetRequest) { return createChannelsSet(req); },
        onMutate(req) {
            const isSmart = req.build_criteria !== undefined;
            const set = {
                id: Math.random().toString(),
                name: req.name,
                description: req.description,
                is_public: req.is_public,
                is_predefined: false,
                is_owned_by_user: true,
                created_at: new Date().toISOString(),
                channel_count: 0,
                channels: [],
                all_parsed: false,
                permissions: {
                    can_view: true,
                    can_edit: false,
                    can_manage_channels: false,
                    can_delete: false,
                    can_analyze: false,
                },
                type: isSmart ? "smart" : "manual",
                build_criteria: req.build_criteria,
                build_status: isSmart ? "pending" : undefined,
                build_progress: isSmart ? {
                    current_batch: 0,
                    channels_accepted: 0,
                    channels_analyzed: 0,
                    target_count: 0,
                    success_rate: 0,
                } : undefined,
            } satisfies ChannelsSet;
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, sets => [...sets, set]);
            return { newSet: set };
        },
        onError(_error, _req, context) {
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                return oldSets.filter(set => set.id !== context.newSet.id);
            });
        },
        onSuccess(data, _variables, context) {
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = oldSets.filter(set => set.id !== context.newSet.id);
                sets.push(data);
                return sets;
            });
        },
    });
}

export function useUpdateChannelsSet(id: string) {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    return useMutation({
        mutationFn(req: UpdateChannelsSetRequest) { return updateChannelsSet(id, req); },
        onMutate(req) {
            let updatedSet: ChannelsSet = undefined;
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                updatedSet = { ...sets[idx] };
                sets[idx] = { ...sets[idx], ...req };
                return sets;
            });
            return { updatedSet };
        },
        onError(_error, _req, context) {
            if (context.updatedSet === undefined) {
                return;
            }
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                sets[idx] = context.updatedSet;
                return sets;
            });
        },
        onSuccess(data, _req, _context) {
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                sets[idx] = data;
                return sets;
            });
        },
    });
}

export function useDeleteChannelsSet(id: string) {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    return useMutation({
        mutationFn() { return deleteChannelsSet(id); },
        onMutate() {
            let deletedSet: ChannelsSet = undefined;
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                deletedSet = sets[idx];
                sets.splice(idx, 1);
                return sets;
            });
            return { deletedSet };
        },
        onError(_error, _variables, context) {
            if (context.deletedSet === undefined) {
                return;
            }
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                return [...oldSets, context.deletedSet];
            });
        },
    });
}

export function useAddChannelsToSet(id: string) {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    const singleSetCacheKeys = ["channels-sets", "single", id];
    return useMutation({
        mutationFn(usernames: string[]) { return addChannelsToSet(id, { usernames }); },
        onMutate(usernames) {
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                const added: ChannelInSet[] = usernames.map(username => ({
                    username,
                    is_parsed: false,
                    added_at: new Date().toISOString(),
                }));
                sets[idx].channels.push(...added);
                sets[idx].channel_count += added.length;
                return sets;
            });
        },
        onError(_error, usernames) {
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                sets[idx].channels = sets[idx].channels.filter(ch => !usernames.includes(ch.username));
                sets[idx].channel_count = sets[idx].channels.length;
                return sets;
            });
        },
        onSuccess() {
            // TODO: No useful response to update data for now
            return queryClient.invalidateQueries({ queryKey: singleSetCacheKeys, });
        },
    });
}

export function useRemoveChannelsFromSet(id: string) {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    return useMutation({
        mutationFn(usernames: string[]) { return removeChannelsFromSet(id, { usernames }); },
        onMutate(usernames) {
            const sets = queryClient.getQueryData<ChannelsSet[]>(setsCacheKeys);
            const idx = sets.findIndex(set => set.id === id);
            if (idx === -1) {
                return;
            }
            const deletedChannels = sets[idx].channels.filter(ch => usernames.includes(ch.username));
            sets[idx].channels = sets[idx].channels.filter(ch => !usernames.includes(ch.username));
            queryClient.setQueryData(setsCacheKeys, sets);
            return deletedChannels;
        },
        onError(_error, _usernames, deletedChannels) {
            if (deletedChannels === undefined) {
                return;
            }
            const sets = queryClient.getQueryData<ChannelsSet[]>(setsCacheKeys);
            const idx = sets.findIndex(set => set.id === id);
            if (idx === -1) {
                return;
            }
            sets[idx].channels.push(...deletedChannels);
            queryClient.setQueryData(setsCacheKeys, sets);
        },
    });
}

export function useCancelSmartSetBuild(id: string) {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    return useMutation({
        mutationFn() { return cancelSmartSetBuild(id); },
        onMutate() {
            let cancelledSet: ChannelsSet = undefined;
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                cancelledSet = { ...sets[idx] };
                sets[idx] = { ...sets[idx], build_status: "cancelled", };
                return sets;
            });
            return { cancelledSet };
        },
        onError(_error, _req, context) {
            if (context.cancelledSet === undefined) {
                return;
            }
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                sets[idx] = context.cancelledSet;
                return sets;
            });
        },
    });
}

export function useRefreshSmartSetStatus(id: string) {
    const queryClient = useQueryClient();
    const setsCacheKeys = ["channels-sets", "list"];
    return useMutation<ChannelsSet>({
        mutationFn() { return refreshSmartSetStatus(id); },
        onSuccess(data) {
            queryClient.setQueryData<ChannelsSet[]>(setsCacheKeys, oldSets => {
                const sets = [...oldSets];
                const idx = sets.findIndex(set => set.id === id);
                if (idx === -1) {
                    return sets;
                }
                sets[idx] = data;
                return sets;
            });
        },
    });
}
