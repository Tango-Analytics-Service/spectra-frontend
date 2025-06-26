// src/components/filters/FiltersSearchBar.tsx
import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    spacing,
    animations,
    components,
} from "@/lib/design-system";

export type FilterType = "all" | "system" | "custom";

interface QuickFilterChipProps {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}

const QuickFilterChip: React.FC<QuickFilterChipProps> = ({
    label,
    count,
    active,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-1 text-xs font-medium transition-all duration-200",
                `px-${spacing.sm} py-1`,
                "rounded-full border",
                "whitespace-nowrap touch-manipulation", // для лучшего тача на мобильных
                active
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-slate-800/50 text-gray-400 border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50",
            )}
        >
            {label}
            {count !== undefined && (
                <span
                    className={cn(
                        "text-xs",
                        active ? "text-blue-200" : "text-gray-500",
                    )}
                >
                    {count}
                </span>
            )}
        </button>
    );
};

interface FiltersSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    systemFiltersCount: number;
    customFiltersCount: number;
    totalFilters: number;
}

const FiltersSearchBar: React.FC<FiltersSearchBarProps> = ({
    searchQuery,
    onSearchChange,
    activeFilter,
    onFilterChange,
    systemFiltersCount,
    customFiltersCount,
    totalFilters,
}) => {
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

export default FiltersSearchBar;
