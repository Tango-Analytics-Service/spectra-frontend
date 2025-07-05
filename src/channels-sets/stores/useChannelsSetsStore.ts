import { toast } from "@/ui/components/use-toast";
import { channelSetService } from "@/channels-sets/service";
import { AnalysisOptions, ChannelAnalysisResponse } from "@/analysis/types";
import { ChannelDetails, ChannelsSet, CreateChannelsSetRequest, UpdateChannelsSetRequest } from "@/channels-sets/types";
import { create } from "zustand";

export interface ChannelsSetsStore {
    channelsSets: ChannelsSet[];
    isLoaded: boolean;
    totalSets: number;
    totalChannels: number;
    lastFetched: number;
    channelsSetsCache: Record<string, { data: ChannelsSet; timestamp: number }>,

    // Methods for managing channel sets
    fetchChannelsSets: (forceRefresh?: boolean) => Promise<void>;
    getChannelsSet: (id: string) => Promise<ChannelsSet | undefined>;
    createChannelsSet: (data: CreateChannelsSetRequest) => Promise<ChannelsSet | undefined>;
    updateChannelsSet: (id: string, data: UpdateChannelsSetRequest) => Promise<ChannelsSet | undefined>;
    deleteChannelsSet: (id: string) => Promise<boolean>;
    addChannelsToSet: (setId: string, usernames: string[]) => Promise<unknown>;
    removeChannelsFromSet: (setId: string, usernames: string[]) => Promise<unknown>;
    analyzeChannelsSet: (setId: string, filterIds: string[], options?: AnalysisOptions) => Promise<unknown>;
    refreshChannelsSet: (id: string) => Promise<ChannelsSet | undefined>;
    searchChannels: (query: string) => Promise<ChannelDetails[]>;

    // Methods for smart sets
    cancelSmartSetBuild: (setId: string) => Promise<boolean>;
    refreshSmartSetStatus: (setId: string) => Promise<ChannelsSet | undefined>;
}

const initialState = {
    channelsSets: [],
    isLoaded: false,
    totalSets: 0,
    totalChannels: 0,
    lastFetched: 0,
    channelsSetsCache: {},
};

export const useChannelsSetsStore = create<ChannelsSetsStore>((set, getState) => ({
    ...initialState,

    fetchChannelsSets: async (forceRefresh = false) => {
        const state = getState();
        // If data was fetched less than 1 minute ago and no force refresh is requested, use cached data
        const now = Date.now();
        if (!forceRefresh && state.channelsSets.length > 0 && now - state.lastFetched < 60000) {
            return;
        }

        set(state => ({ ...state, isLoaded: false }));
        try {
            const response = await channelSetService.getChannelSets();
            set(state => ({
                ...state,
                channelsSets: response.sets,
                totalSets: response.count,
            }));

            // Calculate total channels across all sets
            const total = response.sets.reduce(
                (acc, set) => acc + set.channel_count,
                0,
            );
            set(state => ({
                ...state,
                totalchannels: total,
                lastfetched: now,
            }));
        } catch (error) {
            console.error("Error fetching channel sets:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить наборы каналов",
                variant: "destructive",
            });
        } finally {
            set(state => ({ ...state, isLoaded: true }));
        }
    },

    getChannelsSet: async (id: string): Promise<ChannelsSet | undefined> => {
        const state = getState();
        // Check if we have a fresh cached version (less than 30 seconds old)
        const now = Date.now();
        const cached = state.channelsSetsCache[id];
        if (cached && now - cached.timestamp < 30000) {
            return cached.data;
        }

        try {
            const channelsSet = await channelSetService.getChannelSet(id);
            // Update cache
            set(state => ({
                ...state,
                channelsSetsCache: {
                    ...state.channelsSetsCache,
                    [id]: { data: channelsSet, timestamp: now },
                },
            }));
            return channelsSet;
        } catch (error) {
            console.error(`Error fetching channel set ${id}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить детали набора каналов",
                variant: "destructive",
            });
            return undefined;
        }
    },

    refreshChannelsSet: async (id: string): Promise<ChannelsSet | undefined> => {
        try {
            const channelsSet = await channelSetService.getChannelSet(id);
            set(state => ({
                ...state,
                // Update cache
                channelsSetsCache: {
                    ...state.channelsSetsCache,
                    [id]: { data: channelsSet, timestamp: Date.now() },
                },
                // Also update the set in the channelSets array
                channelsSets: state.channelsSets.map((prevSet) => (prevSet.id === id ? channelsSet : prevSet)),
            }));
            return channelsSet;
        } catch (error) {
            console.error(`Error refreshing channel set ${id}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось обновить данные набора каналов",
                variant: "destructive",
            });
            return undefined;
        }
    },

    createChannelsSet: async (data: CreateChannelsSetRequest): Promise<ChannelsSet | undefined> => {
        try {
            const newSet = await channelSetService.createChannelSet(data);

            set(state => ({
                ...state,
                // Update local state
                channelsSets: [...state.channelsSets, newSet],
                totalSets: state.totalSets + 1,
            }));

            // Разные сообщения для обычных и умных наборов
            if (data.build_criteria) {
                toast({
                    title: "Умный набор создан",
                    description: `Набор "${newSet.name}" создан и начато построение`,
                });
            } else {
                toast({
                    title: "Успешно",
                    description: `Набор "${newSet.name}" создан`,
                });
            }

            return newSet;
        } catch (error) {
            console.error("Error creating channel set:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось создать набор каналов",
                variant: "destructive",
            });
            return undefined;
        }
    },

    updateChannelsSet: async (
        id: string,
        data: UpdateChannelsSetRequest,
    ): Promise<ChannelsSet | undefined> => {
        try {
            const updatedSet = await channelSetService.updateChannelSet(id, data);

            set(state => ({
                ...state,
                // Update local state
                channelsSets: state.channelsSets.map((set) => (set.id === id ? updatedSet : set)),
                // Update cache
                channelsSetsCache: {
                    ...state.channelsSetsCache,
                    [id]: { data: updatedSet, timestamp: Date.now() },
                },
            }));
            toast({
                title: "Успешно",
                description: `Набор "${updatedSet.name}" обновлен`,
            });

            return updatedSet;
        } catch (error) {
            console.error(`Error updating channel set ${id}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось обновить набор каналов",
                variant: "destructive",
            });
            return undefined;
        }
    },

    deleteChannelsSet: async (id: string): Promise<boolean> => {
        try {
            await channelSetService.deleteChannelSet(id);

            set(state => {
                const newCache = { ...state.channelsSetsCache };
                delete newCache[id];
                return ({
                    ...state,
                    // Update local state
                    channelsSets: state.channelsSets.filter((set) => set.id !== id),
                    totalSets: state.totalSets - 1,
                    // Remove from cache
                    channelsSetsCache: newCache
                });
            });

            toast({
                title: "Успешно",
                description: "Набор каналов удален",
            });

            return true;
        } catch (error) {
            console.error(`Error deleting channel set ${id}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить набор каналов",
                variant: "destructive",
            });
            return false;
        }
    },

    addChannelsToSet: async (setId: string, usernames: string[]): Promise<unknown> => {
        const state = getState();
        try {
            const result = await channelSetService.addChannelsToSet(setId, {
                usernames,
            }) as {
                success: boolean,
            };

            if (result.success) {
                // Refresh the channel set to get updated data
                await state.refreshChannelsSet(setId);

                toast({
                    title: "Успешно",
                    description: "Каналы добавлены в набор",
                });
            }

            return result;
        } catch (error) {
            console.error(`Error adding channels to set ${setId}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось добавить каналы в набор",
                variant: "destructive",
            });
            return { success: false, message: "Ошибка добавления каналов" };
        }
    },

    removeChannelsFromSet: async (setId: string, usernames: string[]): Promise<unknown> => {
        const state = getState();
        try {
            const result = await channelSetService.removeChannelsFromSet(setId, {
                usernames,
            }) as {
                success: boolean,
            };

            if (result.success) {
                // Refresh the channel set to get updated data
                await state.refreshChannelsSet(setId);

                toast({
                    title: "Успешно",
                    description: "Каналы удалены из набора",
                });
            }

            return result;
        } catch (error) {
            console.error(`Error removing channels from set ${setId}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить каналы из набора",
                variant: "destructive",
            });
            return { success: false, message: "Ошибка удаления каналов" };
        }
    },

    analyzeChannelsSet: async (setId: string, filterIds: string[], options?: AnalysisOptions,): Promise<ChannelAnalysisResponse | null> => {
        try {
            // First get the channel set to get the channels
            const channelsSet = await channelSetService.getChannelSet(setId);
            if (!channelsSet) {
                toast({
                    title: "Ошибка",
                    description: "Набор каналов не найден",
                    variant: "destructive",
                });
                return null;
            }

            // Perform analysis
            const response = await channelSetService.analyzeChannelSet(setId, {
                filter_ids: filterIds,
                options: options,
            }) as {
                success: boolean,
                message: string,
                task_id: string,
            };

            if (response.success) {
                toast({
                    title: "Анализ запущен",
                    description: "Результаты анализа будут доступны в скором времени",
                });
            } else {
                toast({
                    title: "Ошибка",
                    description: response.message || "Не удалось запустить анализ",
                    variant: "destructive",
                });
            }

            return response;
        } catch (error) {
            console.error(`Error analyzing channel set ${setId}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось запустить анализ набора каналов",
                variant: "destructive",
            });
            return null;
        }
    },

    searchChannels: async (query: string): Promise<ChannelDetails[]> => {
        if (!query || query.trim().length < 2) {
            return [];
        }

        try {
            return await channelSetService.searchChannels(query);
        } catch (error) {
            console.error("Error searching channels:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось выполнить поиск каналов",
                variant: "destructive",
            });
            return [];
        }
    },

    // Smart sets methods
    cancelSmartSetBuild: async (setId: string): Promise<boolean> => {
        try {
            const result = await channelSetService.cancelSmartSetBuild(setId);

            if (result.success) {
                // Refresh the set to get updated status
                const state = getState();
                await state.refreshChannelsSet(setId);

                toast({
                    title: "Построение отменено",
                    description: "Построение умного набора было отменено",
                });
            }

            return result.success;
        } catch (error) {
            console.error(`Error cancelling smart set build ${setId}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось отменить построение набора",
                variant: "destructive",
            });
            return false;
        }
    },

    refreshSmartSetStatus: async (setId: string): Promise<ChannelsSet | undefined> => {
        try {
            const channelsSet = await channelSetService.refreshSmartSetStatus(setId);

            set(state => ({
                ...state,
                // Update cache
                channelsSetsCache: {
                    ...state.channelsSetsCache,
                    [setId]: { data: channelsSet, timestamp: Date.now() },
                },
                // Also update the set in the channelSets array
                channelsSets: state.channelsSets.map((prevSet) => (prevSet.id === setId ? channelsSet : prevSet)),
            }));

            return channelsSet;
        } catch (error) {
            console.error(`Error refreshing smart set status ${setId}:`, error);
            return undefined;
        }
    },
}));
