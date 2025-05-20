// src/contexts/ChannelSetsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { channelSetService } from "@/services/channelSetService";
import { toast } from "@/components/ui/use-toast";
import {
  mockChannelSets,
  mockChannelDetails,
  searchChannelsResults,
} from "@/mocks/channelSetsMock";
import { AnalysisOptions, ChannelAnalysisResponse } from "@/types/analysis";
import {
  ChannelSet,
  CreateChannelSetRequest,
  UpdateChannelSetRequest,
  ChannelDetails,
} from "@/types/channel-sets";

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
  addChannelsToSet: (setId: string, usernames: string[]) => Promise<any>;
  removeChannelsFromSet: (setId: string, usernames: string[]) => Promise<any>;
  analyzeChannelSet: (setId: string, filterIds: string[]) => Promise<any>;
  refreshChannelSet: (id: string) => Promise<ChannelSet | undefined>;
  searchChannels: (query: string) => Promise<ChannelDetails[]>;
}

const ChannelSetsContext = createContext<ChannelSetsContextType | undefined>(
  undefined,
);

export const ChannelSetsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Check if we're running in Tempo
  const isTempoEnvironment = import.meta.env.VITE_TEMPO === "true";

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
      // If in Tempo environment, use mock data
      if (isTempoEnvironment) {
        setChannelSets(mockChannelSets);
        setTotalSets(mockChannelSets.length);
        const total = mockChannelSets.reduce(
          (acc, set) => acc + set.channel_count,
          0,
        );
        setTotalChannels(total);
        setIsLoading(false);
        return;
      }

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
    [channelSets.length, lastFetched, isTempoEnvironment],
  );

  const getChannelSet = useCallback(
    async (id: string): Promise<ChannelSet | undefined> => {
      // If in Tempo environment, use mock data
      if (isTempoEnvironment) {
        const set = mockChannelSets.find((set) => set.id === id);
        if (set) {
          setChannelSetsCache((prevCache) => ({
            ...prevCache,
            [id]: { data: set, timestamp: Date.now() },
          }));
        }
        return set;
      }

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
    [channelSetsCache, isTempoEnvironment],
  );

  const refreshChannelSet = useCallback(
    async (id: string): Promise<ChannelSet | undefined> => {
      // If in Tempo environment, use mock data
      if (isTempoEnvironment) {
        const set = mockChannelSets.find((set) => set.id === id);
        if (set) {
          setChannelSetsCache((prevCache) => ({
            ...prevCache,
            [id]: { data: set, timestamp: Date.now() },
          }));
        }
        return set;
      }

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
    [isTempoEnvironment],
  );

  const createChannelSet = useCallback(
    async (data: CreateChannelSetRequest): Promise<ChannelSet | undefined> => {
      // If in Tempo environment, create mock channel set
      if (isTempoEnvironment) {
        const newSet: ChannelSet = {
          id: `mock-${Date.now()}`,
          name: data.name,
          description: data.description,
          is_public: data.is_public,
          is_predefined: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          channel_count: 0,
          channels: [],
          all_parsed: true,
        };

        setChannelSets((prevSets) => [newSet, ...prevSets]);
        setTotalSets((prev) => prev + 1);

        toast({
          title: "Успешно",
          description: `Набор "${newSet.name}" создан`,
        });

        return newSet;
      }

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
    [isTempoEnvironment],
  );

  const updateChannelSet = useCallback(
    async (
      id: string,
      data: UpdateChannelSetRequest,
    ): Promise<ChannelSet | undefined> => {
      // If in Tempo environment, update mock channel set
      if (isTempoEnvironment) {
        const setIndex = mockChannelSets.findIndex((set) => set.id === id);
        if (setIndex !== -1) {
          const updatedSet = {
            ...mockChannelSets[setIndex],
            ...data,
            updated_at: new Date().toISOString(),
          };

          setChannelSets((prevSets) =>
            prevSets.map((set) => (set.id === id ? updatedSet : set)),
          );

          setChannelSetsCache((prevCache) => ({
            ...prevCache,
            [id]: { data: updatedSet, timestamp: Date.now() },
          }));

          toast({
            title: "Успешно",
            description: `Набор "${updatedSet.name}" обновлен`,
          });

          return updatedSet;
        }
        return undefined;
      }

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
    [isTempoEnvironment],
  );

  const deleteChannelSet = useCallback(
    async (id: string): Promise<boolean> => {
      // If in Tempo environment, delete mock channel set
      if (isTempoEnvironment) {
        setChannelSets((prevSets) => prevSets.filter((set) => set.id !== id));
        setTotalSets((prev) => prev - 1);

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
      }

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
    },
    [isTempoEnvironment],
  );

  const addChannelsToSet = useCallback(
    async (setId: string, usernames: string[]): Promise<any> => {
      // If in Tempo environment, add channels to mock set
      if (isTempoEnvironment) {
        const setIndex = mockChannelSets.findIndex((set) => set.id === setId);
        if (setIndex !== -1) {
          const set = { ...mockChannelSets[setIndex] };
          const newChannels = usernames.map((username) => ({
            username,
            channel_id: Math.floor(Math.random() * 10000),
            is_parsed: Math.random() > 0.3, // 70% chance to be parsed
            added_at: new Date().toISOString(),
          }));

          set.channels = [...set.channels, ...newChannels];
          set.channel_count = set.channels.length;
          set.all_parsed = set.channels.every((channel) => channel.is_parsed);
          set.updated_at = new Date().toISOString();

          setChannelSets((prevSets) =>
            prevSets.map((prevSet) => (prevSet.id === setId ? set : prevSet)),
          );

          setChannelSetsCache((prevCache) => ({
            ...prevCache,
            [setId]: { data: set, timestamp: Date.now() },
          }));

          toast({
            title: "Успешно",
            description: `Каналы добавлены в набор`,
          });

          return { success: true };
        }
        return { success: false, message: "Набор не найден" };
      }

      try {
        const result = await channelSetService.addChannelsToSet(setId, {
          usernames,
        });

        if (result.success) {
          // Refresh the channel set to get updated data
          await refreshChannelSet(setId);

          toast({
            title: "Успешно",
            description: `Каналы добавлены в набор`,
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
    [refreshChannelSet, isTempoEnvironment],
  );

  const removeChannelsFromSet = useCallback(
    async (setId: string, usernames: string[]): Promise<any> => {
      // If in Tempo environment, remove channels from mock set
      if (isTempoEnvironment) {
        const setIndex = mockChannelSets.findIndex((set) => set.id === setId);
        if (setIndex !== -1) {
          const set = { ...mockChannelSets[setIndex] };
          set.channels = set.channels.filter(
            (channel) => !usernames.includes(channel.username),
          );
          set.channel_count = set.channels.length;
          set.all_parsed = set.channels.every((channel) => channel.is_parsed);
          set.updated_at = new Date().toISOString();

          setChannelSets((prevSets) =>
            prevSets.map((prevSet) => (prevSet.id === setId ? set : prevSet)),
          );

          setChannelSetsCache((prevCache) => ({
            ...prevCache,
            [setId]: { data: set, timestamp: Date.now() },
          }));

          toast({
            title: "Успешно",
            description: `Каналы удалены из набора`,
          });

          return { success: true };
        }
        return { success: false, message: "Набор не найден" };
      }

      try {
        const result = await channelSetService.removeChannelsFromSet(setId, {
          usernames,
        });

        if (result.success) {
          // Refresh the channel set to get updated data
          await refreshChannelSet(setId);

          toast({
            title: "Успешно",
            description: `Каналы удалены из набора`,
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
    [refreshChannelSet, isTempoEnvironment],
  );

  const analyzeChannelSet = useCallback(
    async (
      setId: string,
      filterIds: string[],
      options?: AnalysisOptions,
    ): Promise<ChannelAnalysisResponse | null> => {
      // If in Tempo environment, return mock analysis response
      if (isTempoEnvironment) {
        toast({
          title: "Анализ запущен",
          description: "Результаты анализа будут доступны в скором времени",
        });

        return {
          success: true,
          task_id: "mock-task-" + Date.now(),
          message: "Анализ запущен успешно",
        };
      }

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

        // Extract usernames from the channels
        const channelUsernames = set.channels.map(
          (channel) => channel.username,
        );

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
    [isTempoEnvironment],
  );

  const searchChannels = useCallback(
    async (query: string): Promise<ChannelDetails[]> => {
      // If in Tempo environment, return mock search results
      if (isTempoEnvironment) {
        if (!query || query.trim().length < 2) {
          return [];
        }

        // Filter mock results based on query
        return searchChannelsResults.filter(
          (channel) =>
            channel.username.toLowerCase().includes(query.toLowerCase()) ||
            (channel.title &&
              channel.title.toLowerCase().includes(query.toLowerCase())),
        );
      }

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
    [isTempoEnvironment],
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
