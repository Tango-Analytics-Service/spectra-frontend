// src/components/filters/FiltersEmptyState.tsx
import React from "react";
import { Filter, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    typography,
    spacing,
    animations,
    createCardStyle,
    createButtonStyle,
    textColors,
} from "@/lib/design-system";
import type { FilterType } from "./FiltersSearchBar";

type EmptyStateType = "no-filters" | "no-search-results" | "no-custom-filters";

interface FiltersEmptyStateProps {
  type: EmptyStateType;
  searchQuery?: string;
  activeFilter?: FilterType;
  onCreateFilter?: () => void;
  onClearSearch?: () => void;
}

const EmptyStateConfig = {
    "no-filters": {
        icon: Filter,
        title: "Нет фильтров",
        description: "Загрузите системные фильтры или создайте свой первый фильтр",
        actionLabel: "Создать фильтр",
        iconColor: "text-blue-400/50",
    },
    "no-search-results": {
        icon: Search,
        title: "Ничего не найдено",
        description: "Попробуйте изменить поисковый запрос или очистить фильтры",
        actionLabel: "Очистить поиск",
        iconColor: "text-gray-400/50",
    },
    "no-custom-filters": {
        icon: Plus,
        title: "Нет пользовательских фильтров",
        description: "Создайте свой первый фильтр для анализа каналов по нужным критериям",
        actionLabel: "Создать фильтр",
        iconColor: "text-green-400/50",
    },
} as const;

const FiltersEmptyState: React.FC<FiltersEmptyStateProps> = ({
    type,
    searchQuery,
    activeFilter,
    onCreateFilter,
    onClearSearch,
}) => {
    const config = EmptyStateConfig[type];
    const IconComponent = config.icon;

    const handleAction = () => {
        if (type === "no-search-results" && onClearSearch) {
            onClearSearch();
        } else if (onCreateFilter) {
            onCreateFilter();
        }
    };

    const getContextualDescription = () => {
        if (type === "no-search-results" && searchQuery) {
            return `По запросу "${searchQuery}" ничего не найдено. Попробуйте другие ключевые слова.`;
        }
        return config.description;
    };

    return (
        <div
            className={cn(
                createCardStyle(),
                "text-center",
                `py-${spacing["3xl"]} px-${spacing.lg}`,
                animations.fadeIn,
            )}
        >
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                {/* Icon */}
                <div
                    className={cn(
                        "flex items-center justify-center",
                        "w-16 h-16 mb-4",
                        "rounded-full",
                        "bg-slate-800/50",
                    )}
                >
                    <IconComponent size={32} className={config.iconColor} />
                </div>

                {/* Title */}
                <h3 className={cn(typography.h3, "mb-2")}>
                    {config.title}
                </h3>

                {/* Description */}
                <p
                    className={cn(
                        typography.small,
                        textColors.muted,
                        "mb-6 leading-relaxed",
                    )}
                >
                    {getContextualDescription()}
                </p>

                {/* Action button */}
                {((type === "no-search-results" && onClearSearch) ||
          (type !== "no-search-results" && onCreateFilter)) && (
                    <Button
                        onClick={handleAction}
                        className={createButtonStyle("primary")}
                    >
                        {type === "no-search-results" ? (
                            <Search size={16} className="mr-2" />
                        ) : (
                            <Plus size={16} className="mr-2" />
                        )}
                        {config.actionLabel}
                    </Button>
                )}

                {/* Additional context for search results */}
                {type === "no-search-results" && activeFilter !== "all" && (
                    <p className={cn(typography.tiny, textColors.muted, "mt-3")}>
            Поиск ведется среди{" "}
                        {activeFilter === "system" ? "системных" : "пользовательских"}{" "}
            фильтров
                    </p>
                )}
            </div>
        </div>
    );
};

export default FiltersEmptyState;