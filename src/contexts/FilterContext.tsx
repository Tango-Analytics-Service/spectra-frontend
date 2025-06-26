// src/contexts/FilterContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { httpClient } from "@/services/httpClient";
import { toast } from "@/components/ui/use-toast";

export interface Filter {
    id: string;
    name: string;
    criteria: string;
    threshold?: number;
    strictness?: number;
    category: string;
    created_at: string;
    updated_at?: string;
    is_custom?: boolean;
}

export interface FilterCreateRequest {
    name: string;
    criteria: string;
    threshold: number;
    strictness: number;
    category?: string;
    template?: string;
}

interface FilterContextType {
    systemFilters: Filter[];
    userFilters: Filter[];
    isSystemFiltersLoading: boolean;
    isUserFiltersLoading: boolean;
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

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // State
    const [systemFilters, setSystemFilters] = useState<Filter[]>([]);
    const [userFilters, setUserFilters] = useState<Filter[]>([]);
    const [isSystemFiltersLoading, setIsSystemFiltersLoading] = useState(false);
    const [isUserFiltersLoading, setIsUserFiltersLoading] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    // Fetch system filters (predefined by the system)
    const fetchSystemFilters = useCallback(async () => {
        setIsSystemFiltersLoading(true);
        try {
            const filters = await httpClient.get<Filter[]>(
                "/analysis/filters-system",
            );
            setSystemFilters(filters);
        } catch (error) {
            console.error("Error fetching system filters:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить системные фильтры",
                variant: "destructive",
            });
        } finally {
            setIsSystemFiltersLoading(false);
        }
    }, []);

    // Fetch all filters available to the user (system + custom)
    const fetchUserFilters = useCallback(async () => {
        setIsUserFiltersLoading(true);
        try {
            const filters = await httpClient.get<Filter[]>("/analysis/filters");
            setUserFilters(filters);
        } catch (error) {
            console.error("Error fetching user filters:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить фильтры пользователя",
                variant: "destructive",
            });
        } finally {
            setIsUserFiltersLoading(false);
        }
    }, []);

    // Create a custom filter
    const createCustomFilter = useCallback(
        async (data: FilterCreateRequest): Promise<Filter | null> => {
            try {
                const newFilter = await httpClient.post<Filter>(
                    "/analysis/custom-filters",
                    data,
                );

                // Update user filters list
                setUserFilters((prev) => [...prev, newFilter]);

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
        [],
    );

    // Delete a custom filter
    const deleteCustomFilter = useCallback(
        async (id: string): Promise<boolean> => {
            try {
                await httpClient.delete(`/analysis/custom-filters/${id}`);

                // Update user filters list
                setUserFilters((prev) => prev.filter((filter) => filter.id !== id));

                // Remove from selected filters if it was selected
                setSelectedFilters((prev) =>
                    prev.filter((filterId) => filterId !== id),
                );

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
        [],
    );

    // Toggle filter selection (add/remove from selected)
    const toggleFilterSelection = useCallback((id: string) => {
        setSelectedFilters((prev) =>
            prev.includes(id)
                ? prev.filter((filterId) => filterId !== id)
                : [...prev, id],
        );
    }, []);

    // Set selected filters directly
    const setSelectedFiltersAction = useCallback((filterIds: string[]) => {
        setSelectedFilters(filterIds);
    }, []);

    // Clear all selected filters
    const clearSelectedFilters = useCallback(() => {
        setSelectedFilters([]);
    }, []);

    // Get filter by ID
    const getFilterById = useCallback(
        (id: string): Filter | undefined => {
            return [...systemFilters, ...userFilters].find(
                (filter) => filter.id === id,
            );
        },
        [systemFilters, userFilters],
    );

    // Context value
    const value: FilterContextType = {
        systemFilters,
        userFilters,
        isSystemFiltersLoading,
        isUserFiltersLoading,
        selectedFilters,
        fetchSystemFilters,
        fetchUserFilters,
        createCustomFilter,
        deleteCustomFilter,
        toggleFilterSelection,
        setSelectedFilters: setSelectedFiltersAction,
        clearSelectedFilters,
        getFilterById,
    };

    return (
        <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error("useFilters must be used within a FilterProvider");
    }
    return context;
};
