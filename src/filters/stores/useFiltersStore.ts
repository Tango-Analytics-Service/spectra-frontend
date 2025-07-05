import { toast } from "@/ui/components/use-toast";
import { httpClient } from "@/lib/httpClient";
import { create } from "zustand";
import { Filter, FilterCreateRequest } from "../types";

export interface FiltersStore {
    systemFilters: Filter[];
    userFilters: Filter[];
    isSystemFiltersLoaded: boolean;
    isUserFiltersLoaded: boolean;
    selectedFilters: string[];
    // Methods
    fetchSystemFilters: () => Promise<void>;
    fetchUserFilters: () => Promise<void>;
    createCustomFilter: (data: FilterCreateRequest) => Promise<Filter | null>;
    deleteCustomFilter: (id: string) => Promise<boolean>;
    toggleFilterSelection: (id: string) => void;
    setSelectedFilters: (filterIds: string[]) => void;
    clearSelectedFilters: () => void;
    getFilterById: (id: string) => Filter | undefined;
}

const initialState = {
    systemFilters: [],
    userFilters: [],
    isSystemFiltersLoaded: false,
    isUserFiltersLoaded: false,
    selectedFilters: [],
};

export const useFiltersStore = create<FiltersStore>((set, getState) => ({
    ...initialState,

    // Fetch system filters (predefined by the system)
    fetchSystemFilters: async () => {
        set(state => ({ ...state, isSystemFiltersLoaded: false }));
        try {
            const filters = await httpClient.get<Filter[]>(
                "/analysis/filters-system",
            );
            set(state => ({ ...state, systemFilters: filters }));
        } catch (error) {
            console.error("Error fetching system filters:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить системные фильтры",
                variant: "destructive",
            });
        } finally {
            set(state => ({ ...state, isSystemFiltersLoaded: true }));
        }
    },

    // Fetch all filters available to the user (system + custom)
    fetchUserFilters: async () => {
        set(state => ({ ...state, isUserFiltersLoaded: false }));
        try {
            const filters = await httpClient.get<Filter[]>("/analysis/filters");
            set(state => ({ ...state, userFilters: filters }));
        } catch (error) {
            console.error("Error fetching user filters:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить фильтры пользователя",
                variant: "destructive",
            });
        } finally {
            set(state => ({ ...state, isUserFiltersLoaded: true }));
        }
    },

    // Create a custom filter
    createCustomFilter: async (data: FilterCreateRequest): Promise<Filter | null> => {
        try {
            // TODO: move to ../service
            const newFilter = await httpClient.post<Filter>(
                "/analysis/custom-filters",
                data,
            );

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
            await httpClient.delete(`/analysis/custom-filters/${id}`);

            set(state => ({
                ...state,
                // Update user filters list
                userFilters: state.userFilters.filter((filter) => filter.id !== id),
                // Remove from selected filters if it was selected
                selectedFilters: state.selectedFilters.filter((filterId) => filterId !== id),
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

    // Toggle filter selection (add/remove from selected)
    toggleFilterSelection: (id: string) => {
        set(state => ({
            ...state,
            selectedFilters: state.selectedFilters.includes(id)
                ? state.selectedFilters.filter((filterId) => filterId !== id)
                : [...state.selectedFilters, id],
        }));
    },

    // Set selected filters directly
    setSelectedFilters: (filtersIds: string[]) => {
        set(state => ({ ...state, selectedFilters: filtersIds }));
    },

    // Clear all selected filters
    clearSelectedFilters: () => {
        set(state => ({ ...state, selectedFilters: [] }));
    },

    // Get filter by ID
    getFilterById: (id: string): Filter | undefined => {
        const state = getState();
        return [...state.systemFilters, ...state.userFilters].find(
            (filter) => filter.id === id,
        );
    },

}));
