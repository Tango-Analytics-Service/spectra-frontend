import { toast } from "@/ui/components/use-toast";
import { channelSetService } from "@/channels-sets/service";
import { AnalysisOptions, ChannelAnalysisResponse } from "@/analysis/types";
import { ChannelDetails, ChannelsSet, CreateChannelsSetRequest, UpdateChannelsSetRequest } from "@/channels-sets/types";
import { create } from "zustand";
import { LoadStatus } from "@/lib/types";

const AUTO_REFRESH_TIMEOUT = 60 * 1000;

export interface ChannelsSetsStore {
    channelsSets: ChannelsSet[];
    loadStatus: LoadStatus;
    totalSets: number;
    totalChannels: number;
    channelsSetsCache: Record<string, ChannelsSet>,

    // Methods for managing channel sets
    fetchChannelsSets: (force?: boolean) => Promise<void>;
    getChannelsSet: (id: string) => Promise<ChannelsSet | undefined>;
    createChannelsSet: (data: CreateChannelsSetRequest) => Promise<ChannelsSet | undefined>;
    updateChannelsSet: (id: string, data: UpdateChannelsSetRequest) => Promise<ChannelsSet | undefined>;
    deleteChannelsSet: (id: string) => Promise<boolean>;
    addChannelsToSet: (setId: string, usernames: string[]) => Promise<unknown>;
    removeChannelsFromSet: (setId: string, usernames: string[]) => Promise<unknown>;
    analyzeChannelsSet: (setId: string, filterIds: string[], options?: AnalysisOptions) => Promise<unknown>;
    searchChannels: (query: string) => Promise<ChannelDetails[]>;

    // Methods for smart sets
    cancelSmartSetBuild: (setId: string) => Promise<boolean>;
    refreshSmartSetStatus: (setId: string) => Promise<ChannelsSet | undefined>;
}

const initialState = {
    channelsSets: [],
    loadStatus: "idle" as LoadStatus,
    totalSets: 0,
    totalChannels: 0,
    channelsSetsCache: {},
};

export const useChannelsSetsStore = create<ChannelsSetsStore>((set, getState) => ({
    ...initialState,

    fetchChannelsSets: async (force = false) => {
        const state = getState();
        if (!force) {
            if (state.loadStatus !== "idle") {
                return;
            }
        }

        set(state => ({ ...state, loadStatus: "pending" }));
        try {
            const response = await channelSetService.getChannelSets();
            // Calculate total channels across all sets
            const total = response.sets.reduce((acc, set) => acc + set.channel_count, 0);
            set(state => ({
                ...state,
                loadStatus: "success",
                channelsSets: response.sets,
                totalSets: response.count,
                totalchannels: total,
            }));
        } catch (error) {
            console.error("Error fetching channel sets:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить наборы каналов",
                variant: "destructive",
            });
            set(state => ({ ...state, loadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, loadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    getChannelsSet: async (id: string): Promise<ChannelsSet | undefined> => {
        const state = getState();
        try {
            const channelsSet = await channelSetService.getChannelSet(id);
            const sets = state.channelsSets;
            const idx = sets.findIndex(s => s.id === id);
            if (idx === -1) {
                sets.push(channelsSet);
            } else {
                sets[idx] = channelsSet;
            }
            // Update cache
            set(state => ({ ...state, channelsSets: sets }));
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
        const state = getState();
        try {
            const updatedSet = await channelSetService.updateChannelSet(id, data);
            const sets = state.channelsSets;
            const idx = sets.findIndex(s => s.id === id);
            if (idx === -1) {
                sets.push(updatedSet);
            } else {
                sets[idx] = updatedSet;
            }
            set(state => ({ ...state, channelsSets: sets }));
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
            set(state => ({
                ...state,
                channelsSets: state.channelsSets.filter((set) => set.id !== id),
                totalSets: state.totalSets - 1,
            }));
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
            const result = await channelSetService.addChannelsToSet(setId, { usernames });
            if (result.success) {
                await state.getChannelsSet(setId);
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
                await state.getChannelsSet(setId);
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
            });

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
        const state = getState();
        try {
            const result = await channelSetService.cancelSmartSetBuild(setId);
            if (result.success) {
                // Refresh the set to get updated status
                await state.getChannelsSet(setId);
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

    refreshSmartSetStatus: async (id: string): Promise<ChannelsSet | undefined> => {
        const state = getState();
        try {
            const channelsSet = await channelSetService.refreshSmartSetStatus(id);
            const sets = state.channelsSets;
            const idx = sets.findIndex(s => s.id === id);
            if (idx === -1) {
                sets.push(channelsSet);
            } else {
                sets[idx] = channelsSet;
            }
            // Update cache
            set(state => ({ ...state, channelsSets: sets }));
            return channelsSet;
        } catch (error) {
            console.error(`Error refreshing smart set status ${id}:`, error);
            return undefined;
        }
    },
}));
