// src/contexts/ChannelSetsContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { channelSetService } from "@/services/channelSetService";
import { toast } from "@/components/ui/use-toast";
import {
    ChannelSet,
    CreateChannelSetRequest,
    UpdateChannelSetRequest,
    ChannelDetails,
} from "@/types/channel-sets";
import { AnalysisOptions, ChannelAnalysisResponse } from "@/types/analysis";

interface ChannelSetsContextType {
    channelSets: ChannelSet[];
    isLoading: boolean;
    totalSets: number;
    totalChannels: number;
    // Methods for managing channel sets
    fetchChannelSets: (forceRefresh?: boolean) => Promise<void>;
    getChannelSet: (id: string) => Promise<ChannelSet | undefined>;
    createChannelSet: (
        data: CreateChannelSetRequest,
    ) => Promise<ChannelSet | undefined>;
    updateChannelSet: (
        id: string,
        data: UpdateChannelSetRequest,
    ) => Promise<ChannelSet | undefined>;
    deleteChannelSet: (id: string) => Promise<boolean>;
    addChannelsToSet: (setId: string, usernames: string[]) => Promise<unknown>;
    removeChannelsFromSet: (setId: string, usernames: string[]) => Promise<unknown>;
    analyzeChannelSet: (setId: string, filterIds: string[], options?: AnalysisOptions) => Promise<unknown>;
    refreshChannelSet: (id: string) => Promise<ChannelSet | undefined>;
    searchChannels: (query: string) => Promise<ChannelDetails[]>;
}

const ChannelSetsContext = createContext<ChannelSetsContextType | undefined>(
    undefined,
);

export const ChannelSetsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [channelSets, setChannelSets] = useState<ChannelSet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalSets, setTotalSets] = useState<number>(0);
    const [totalChannels, setTotalChannels] = useState<number>(0);
    const [lastFetched, setLastFetched] = useState<number>(0);
    // Cache for individual channel sets to avoid refetching details
    const [channelSetsCache, setChannelSetsCache] = useState<
        Record<string, { data: ChannelSet; timestamp: number }>
    >({});

    const fetchChannelSets = useCallback(
        async (forceRefresh = false) => {
            // If data was fetched less than 1 minute ago and no force refresh is requested, use cached data
            const now = Date.now();
            if (
                !forceRefresh &&
                channelSets.length > 0 &&
                now - lastFetched < 60000
            ) {
                return;
            }

            setIsLoading(true);
            try {
                const response = await channelSetService.getChannelSets();
                setChannelSets(response.sets);
                setTotalSets(response.count);

                // Calculate total channels across all sets
                const total = response.sets.reduce(
                    (acc, set) => acc + set.channel_count,
                    0,
                );
                setTotalChannels(total);
                setLastFetched(now);
            } catch (error) {
                console.error("Error fetching channel sets:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить наборы каналов",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [channelSets.length, lastFetched],
    );

    const getChannelSet = useCallback(
        async (id: string): Promise<ChannelSet | undefined> => {
            // Check if we have a fresh cached version (less than 30 seconds old)
            const now = Date.now();
            const cached = channelSetsCache[id];
            if (cached && now - cached.timestamp < 30000) {
                return cached.data;
            }

            try {
                const set = await channelSetService.getChannelSet(id);
                // Update cache
                setChannelSetsCache((prevCache) => ({
                    ...prevCache,
                    [id]: { data: set, timestamp: now },
                }));
                return set;
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
        [channelSetsCache],
    );

    const refreshChannelSet = useCallback(
        async (id: string): Promise<ChannelSet | undefined> => {
            try {
                const set = await channelSetService.getChannelSet(id);
                // Update cache
                setChannelSetsCache((prevCache) => ({
                    ...prevCache,
                    [id]: { data: set, timestamp: Date.now() },
                }));

                // Also update the set in the channelSets array
                setChannelSets((prevSets) =>
                    prevSets.map((prevSet) => (prevSet.id === id ? set : prevSet)),
                );

                return set;
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
        [],
    );

    const createChannelSet = useCallback(
        async (data: CreateChannelSetRequest): Promise<ChannelSet | undefined> => {
            try {
                const newSet = await channelSetService.createChannelSet(data);

                // Update local state
                setChannelSets((prevSets) => [newSet, ...prevSets]);
                setTotalSets((prev) => prev + 1);

                toast({
                    title: "Успешно",
                    description: `Набор "${newSet.name}" создан`,
                });

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
        [],
    );

    const updateChannelSet = useCallback(
        async (
            id: string,
            data: UpdateChannelSetRequest,
        ): Promise<ChannelSet | undefined> => {
            try {
                const updatedSet = await channelSetService.updateChannelSet(id, data);

                // Update local state
                setChannelSets((prevSets) =>
                    prevSets.map((set) => (set.id === id ? updatedSet : set)),
                );

                // Update cache
                setChannelSetsCache((prevCache) => ({
                    ...prevCache,
                    [id]: { data: updatedSet, timestamp: Date.now() },
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
        [],
    );

    const deleteChannelSet = useCallback(async (id: string): Promise<boolean> => {
        try {
            await channelSetService.deleteChannelSet(id);

            // Update local state
            setChannelSets((prevSets) => prevSets.filter((set) => set.id !== id));
            setTotalSets((prev) => prev - 1);

            // Remove from cache
            setChannelSetsCache((prevCache) => {
                const newCache = { ...prevCache };
                delete newCache[id];
                return newCache;
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
    }, []);

    const addChannelsToSet = useCallback(
        async (setId: string, usernames: string[]): Promise<unknown> => {
            try {
                const result = await channelSetService.addChannelsToSet(setId, {
                    usernames,
                }) as {
                    success: boolean,
                };

                if (result.success) {
                    // Refresh the channel set to get updated data
                    await refreshChannelSet(setId);

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
        [refreshChannelSet],
    );

    const removeChannelsFromSet = useCallback(
        async (setId: string, usernames: string[]): Promise<unknown> => {
            try {
                const result = await channelSetService.removeChannelsFromSet(setId, {
                    usernames,
                }) as {
                    success: boolean,
                };

                if (result.success) {
                    // Refresh the channel set to get updated data
                    await refreshChannelSet(setId);

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
        [refreshChannelSet],
    );

    const analyzeChannelSet = useCallback(
        async (
            setId: string,
            filterIds: string[],
            options?: AnalysisOptions,
        ): Promise<ChannelAnalysisResponse | null> => {
            try {
                // First get the channel set to get the channels
                const set = await channelSetService.getChannelSet(setId);
                if (!set) {
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
        }, []);

    const searchChannels = useCallback(
        async (query: string): Promise<ChannelDetails[]> => {
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
        [],
    );

    const value = {
        channelSets,
        isLoading,
        totalSets,
        totalChannels,
        fetchChannelSets,
        getChannelSet,
        createChannelSet,
        updateChannelSet,
        deleteChannelSet,
        addChannelsToSet,
        removeChannelsFromSet,
        analyzeChannelSet,
        refreshChannelSet,
        searchChannels,
    };

    return (
        <ChannelSetsContext.Provider value={value}>
            {children}
        </ChannelSetsContext.Provider>
    );
};

export const useChannelSets = () => {
    const context = useContext(ChannelSetsContext);
    if (context === undefined) {
        throw new Error("useChannelSets must be used within a ChannelSetsProvider");
    }
    return context;
};
