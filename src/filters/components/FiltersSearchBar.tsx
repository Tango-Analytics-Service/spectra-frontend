// src/components/filters/FiltersSearchBar.tsx
import { Search, X } from "lucide-react";
import { Input } from "@/ui/components/input";
import { Button } from "@/ui/components/button";
import { cn } from "@/lib/cn";
import {
    spacing,
    animations,
    components,
} from "@/lib/design-system";
import QuickFilterChip from "./QuickFilterChip";

export type FilterType = "all" | "system" | "custom";

export interface FiltersSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    systemFiltersCount: number;
    customFiltersCount: number;
    totalFilters: number;
}

export default function FiltersSearchBar({
    searchQuery,
    onSearchChange,
    activeFilter,
    onFilterChange,
    systemFiltersCount,
    customFiltersCount,
    totalFilters,
}: FiltersSearchBarProps) {
    const handleClearSearch = () => {
        onSearchChange("");
    };

    return (
        <div
            className={cn(
                "flex flex-col",
                `gap-${spacing.sm}`,
                `pb-${spacing.sm}`,
                animations.slideIn,
            )}
        >
            {/* Search input */}
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                    placeholder="Поиск по названию, критериям, категории..."
                    className={cn(
                        components.input.base,
                        "pl-9",
                        searchQuery && "pr-9", // добавляем отступ для кнопки очистки
                    )}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-slate-700/50"
                    >
                        <X size={14} />
                    </Button>
                )}
            </div>

            {/* Quick filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                <div className="flex items-center gap-2 min-w-max">
                    <QuickFilterChip
                        label="Все"
                        count={totalFilters}
                        active={activeFilter === "all"}
                        onClick={() => onFilterChange("all")}
                    />
                    <QuickFilterChip
                        label="Системные"
                        count={systemFiltersCount}
                        active={activeFilter === "system"}
                        onClick={() => onFilterChange("system")}
                    />
                    <QuickFilterChip
                        label="Мои"
                        count={customFiltersCount}
                        active={activeFilter === "custom"}
                        onClick={() => onFilterChange("custom")}
                    />
                </div>
            </div>
        </div>
    );
};
