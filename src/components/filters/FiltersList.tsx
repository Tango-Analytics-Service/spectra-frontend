// src/components/filters/FiltersList.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FilterIcon, Plus, AlertCircle } from "lucide-react";
import FilterCard from "./FilterCard";
import CreateFilterDialog from "./CreateFilterDialog";
import { cn } from "@/lib/utils";
import {
    createButtonStyle,
    spacing,
    animations,
    components,
    createTextStyle,
} from "@/lib/design-system";
import { EmptyState, LoadingState } from "@/components/ui/dialog-components";

export interface FiltersListProps {
    onSelectFilter?: (id: string) => void;
    selectedFilters?: string[];
    showActions?: boolean;
    height?: string;
    multiSelect?: boolean;
}

// Типы фильтров для быстрого доступа
const FILTER_TYPES = [
    { id: "all", label: "Все", icon: FilterIcon },
    { id: "my", label: "Мои", icon: Plus },
    { id: "system", label: "Системные", icon: FilterIcon },
] as const;

// Категории для фильтрации
const CATEGORIES = [
    "Содержание",
    "Качество",
    "Безопасность",
    "Вовлеченность",
    "Рост",
    "Другое",
] as const;

export default function FiltersList({
    onSelectFilter,
    selectedFilters = [],
    showActions = true,
    height = "h-[600px]",
}: FiltersListProps) {
    const {
        systemFilters,
        userFilters,
        isSystemFiltersLoading,
        isUserFiltersLoading,
        fetchSystemFilters,
        fetchUserFilters,
        deleteCustomFilter,
    } = useFilters();

    // Локальное состояние
    const [searchQuery, setSearchQuery] = useState("");
    const [activeType, setActiveType] = useState<"all" | "my" | "system">("all");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    // Загрузка фильтров при монтировании
    useEffect(() => {
        fetchSystemFilters();
        fetchUserFilters();
    }, [fetchSystemFilters, fetchUserFilters]);

    // Комбинированный список фильтров
    const allFilters = useMemo(() => {
        const combined = [...systemFilters, ...userFilters];
        // Удаляем дубликаты по id
        return combined.filter(
            (filter, index, self) =>
                index === self.findIndex((f) => f.id === filter.id),
        );
    }, [systemFilters, userFilters]);

    // Фильтрация по типу
    const filteredByType = useMemo(() => {
        switch (activeType) {
            case "my":
                return allFilters.filter((filter) => filter.is_custom);
            case "system":
                return allFilters.filter((filter) => !filter.is_custom);
            default:
                return allFilters;
        }
    }, [allFilters, activeType]);

    // Фильтрация по категории
    const filteredByCategory = useMemo(() => {
        if (!activeCategory) return filteredByType;
        return filteredByType.filter(
            (filter) => filter.category === activeCategory,
        );
    }, [filteredByType, activeCategory]);

    // Фильтрация по поиску
    const filteredFilters = useMemo(() => {
        if (!searchQuery.trim()) return filteredByCategory;

        const query = searchQuery.toLowerCase();
        return filteredByCategory.filter(
            (filter) =>
                filter.name.toLowerCase().includes(query) ||
                filter.criteria.toLowerCase().includes(query) ||
                (filter.category && filter.category.toLowerCase().includes(query)),
        );
    }, [filteredByCategory, searchQuery]);

    // Обработчики
    const handleSelectFilter = (id: string) => {
        if (onSelectFilter) {
            onSelectFilter(id);
        }
    };

    const handleToggleExpand = (id: string) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedCards(newExpanded);
    };

    const handleDeleteFilter = async (id: string) => {
        await deleteCustomFilter(id);
        // Убираем из развернутых если был развернут
        const newExpanded = new Set(expandedCards);
        newExpanded.delete(id);
        setExpandedCards(newExpanded);
    };

    const handleEditFilter = (id: string) => {
        // TODO: Реализовать редактирование фильтра
        console.log("Edit filter:", id);
    };

    const handleDuplicateFilter = (id: string) => {
        // TODO: Реализовать дублирование фильтра
        console.log("Duplicate filter:", id);
    };

    // Состояние загрузки
    const isLoading = isSystemFiltersLoading || isUserFiltersLoading;

    return (
        <div className={cn("space-y-4", animations.fadeIn)}>
            {/* Поиск */}
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                    placeholder="Поиск фильтров..."
                    className={cn(components.input.base, "pl-9")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {/* Быстрые фильтры по типу */}
            <div className="flex items-center gap-2 overflow-x-auto">
                {FILTER_TYPES.map(({ id, label, icon: Icon }) => (
                    <Button
                        key={id}
                        variant={activeType === id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveType(id)}
                        className={cn(
                            "flex-shrink-0",
                            activeType === id
                                ? createButtonStyle("primary")
                                : createButtonStyle("secondary"),
                        )}
                    >
                        <Icon size={14} className={`mr-${spacing.sm}`} />
                        {label}
                    </Button>
                ))}
            </div>
            {/* Фильтры по категориям */}
            <div className="flex gap-2 overflow-x-auto items-center flex-wrap content-start">
                <Button
                    variant={!activeCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                        "flex-shrink-0",
                        !activeCategory
                            ? createButtonStyle("primary")
                            : createButtonStyle("secondary"),
                    )}
                >
                    Все категории
                </Button>

                {CATEGORIES.map((category) => (
                    <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            "flex-shrink-0",
                            activeCategory === category
                                ? createButtonStyle("primary")
                                : createButtonStyle("secondary"),
                        )}
                    >
                        {category}
                    </Button>
                ))}
            </div>
            {/* Счетчик результатов */}
            <div className={createTextStyle("small", "muted")}>
                Найдено фильтров: {filteredFilters.length}
            </div>
            {/* Список фильтров */}
            <ScrollArea className={cn(height, "w-full max-w-full overflow-hidden")}>
                {isLoading ? (
                    <LoadingState text="Загрузка фильтров..." />
                ) : filteredFilters.length === 0 ? (
                    <EmptyState
                        icon={<AlertCircle size={48} />}
                        title={
                            searchQuery || activeCategory
                                ? "Ничего не найдено"
                                : "Нет фильтров"
                        }
                        description={
                            searchQuery || activeCategory
                                ? "Попробуйте изменить параметры поиска"
                                : activeType === "my"
                                    ? "Создайте свой первый фильтр"
                                    : "Фильтры не загружены"
                        }
                        action={showActions && !searchQuery && !activeCategory && activeType === "my" ? (
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                className={createButtonStyle("primary")}
                            >
                                Создать фильтр
                            </Button>
                        ) : undefined}
                    />
                ) : (
                    <div className={cn(`space-y-${spacing.sm}`)}>
                        {filteredFilters.map((filter) => (
                            <FilterCard
                                key={filter.id}
                                filter={filter}
                                selected={selectedFilters.includes(filter.id)}
                                expanded={expandedCards.has(filter.id)}
                                onSelect={handleSelectFilter}
                                onToggleExpand={handleToggleExpand}
                                onEdit={filter.is_custom ? handleEditFilter : undefined}
                                onDelete={filter.is_custom ? handleDeleteFilter : undefined}
                                onDuplicate={handleDuplicateFilter}
                                showActions={showActions}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
            {/* Диалог создания фильтра */}
            <CreateFilterDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />
        </div>
    );
}
