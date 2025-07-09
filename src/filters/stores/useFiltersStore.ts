import { toast } from "@/ui/components/use-toast";
import { create } from "zustand";
import { Filter, FilterCreateRequest } from "../types";
import { filtersService } from "../service";
import { LoadStatus } from "@/lib/types";

const AUTO_REFRESH_TIMEOUT = 60 * 1000;

export interface FiltersStore {
    systemFilters: Filter[];
    userFilters: Filter[];
    systemFiltersLoadStatus: LoadStatus;
    userFiltersLoadStatus: LoadStatus;
    // Methods
    fetchSystemFilters: (force?: boolean) => Promise<void>;
    fetchUserFilters: (force?: boolean) => Promise<void>;
    createCustomFilter: (data: FilterCreateRequest) => Promise<Filter | null>;
    deleteCustomFilter: (id: string) => Promise<boolean>;
    getFilterById: (id: string) => Filter | undefined;
}

const initialState = {
    systemFilters: [],
    userFilters: [],
    systemFiltersLoadStatus: "idle" as LoadStatus,
    userFiltersLoadStatus: "idle" as LoadStatus,
};

export const useFiltersStore = create<FiltersStore>((set, getState) => ({
    ...initialState,

    // Fetch system filters (predefined by the system)
    fetchSystemFilters: async (force = false) => {
        const state = getState();
        if (!force) {
            if (state.systemFiltersLoadStatus !== "idle") {
                return;
            }
        }

        set(state => ({ ...state, systemFiltersLoadStatus: "pending" }));
        try {
            const filters = await filtersService.getSystemFilters();
            set(state => ({ ...state, systemFiltersLoadStatus: "success", systemFilters: filters }));
        } catch (error) {
            console.error("Error fetching system filters:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить системные фильтры",
                variant: "destructive",
            });
            set(state => ({ ...state, systemFiltersLoadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, systemFiltersLoadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    // Fetch all filters available to the user (system + custom)
    fetchUserFilters: async (force = false) => {
        const state = getState();
        if (!force) {
            if (state.userFiltersLoadStatus !== "idle") {
                return;
            }
        }

        set(state => ({ ...state, userFiltersLoadStatus: "pending" }));
        try {
            const filters = await filtersService.getUserFilters();
            set(state => ({ ...state, userFiltersLoadStatus: "success", userFilters: filters }));
        } catch (error) {
            console.error("Error fetching user filters:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить фильтры пользователя",
                variant: "destructive",
            });
            set(state => ({ ...state, userFiltersLoadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, userFiltersLoadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    // Create a custom filter
    createCustomFilter: async (data: FilterCreateRequest): Promise<Filter | null> => {
        try {
            const newFilter = await filtersService.createCustomFilter(data);

            // Update user filters list
            set(state => ({ ...state, userFilters: [...state.userFilters, newFilter] }));

            toast({
                title: "Успешно",
                description: `Фильтр "${newFilter.name}" создан`,
            });

            return newFilter;
        } catch (error) {
            console.error("Error creating custom filter:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось создать фильтр",
                variant: "destructive",
            });
            return null;
        }
    },

    // Delete a custom filter
    deleteCustomFilter: async (id: string): Promise<boolean> => {
        try {
            await filtersService.deleteCustomFilter(id);
            set(state => ({
                ...state,
                userFilters: state.userFilters.filter((filter) => filter.id !== id),
            }));
            toast({
                title: "Успешно",
                description: "Фильтр удален",
            });
            return true;
        } catch (error) {
            console.error(`Error deleting custom filter ${id}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить фильтр",
                variant: "destructive",
            });
            return false;
        }
    },

    // Get filter by ID
    getFilterById: (id: string): Filter | undefined => {
        const state = getState();
        return [...state.systemFilters, ...state.userFilters].find(
            (filter) => filter.id === id,
        );
    },
}));
