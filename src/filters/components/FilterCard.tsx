import React from "react";
import { CheckCircle2, Tag, Info, ChevronDown, Settings, Trash2, } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/ui/components/button";
import { createCardStyle, createBadgeStyle, createButtonStyle, typography, spacing, animations, textColors, createTextStyle } from "@/lib/design-system";
import { Filter } from "../types";
import { useDeleteCustomFilter } from "../api/hooks";

export interface FilterCardProps {
    filter: Filter;
    selected?: boolean;
    expanded?: boolean;
    onSelect?: (id: string) => void;
    onToggleExpand?: (id: string) => void;
    onViewDetails?: (filter: Filter) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onDuplicate?: (id: string) => void;
    showActions?: boolean;
    className?: string;
}

// Иконки для категорий
function getCategoryIcon(category?: string) {
    const iconProps = { size: 20 };

    switch (category) {
        case "Содержание":
            return <Tag {...iconProps} className={textColors.primary} />;
        case "Качество":
            return <CheckCircle2 {...iconProps} className={textColors.success} />;
        case "Безопасность":
            return <Info {...iconProps} className={textColors.error} />;
        case "Вовлеченность":
            return <Settings {...iconProps} className={textColors.warning} />;
        default:
            return <Tag {...iconProps} className={textColors.muted} />;
    }
};

export default function FilterCard({
    filter,
    selected = false,
    expanded = false,
    onSelect,
    onToggleExpand,
    onViewDetails,
    showActions = true,
    className,
}: FilterCardProps) {
    const deleteFilter = useDeleteCustomFilter();

    const handleCardClick = () => {
        if (onSelect) {
            onSelect(filter.id);
        }
    };

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleExpand) {
            onToggleExpand(filter.id);
        }
    };

    const handleMenuAction = (action: () => void) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation();
            action();
        };
    };

    const handleDeleteFilter = () => {
        deleteFilter.mutate(filter.id);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={cn(
                createCardStyle(),
                "transition-all duration-200 cursor-pointer",
                // ИСПРАВЛЕНИЕ: Добавляем overflow-hidden на основной контейнер
                "overflow-hidden",
                selected
                    ? "ring-2 ring-blue-500/50 bg-blue-500/5 border-blue-500/50"
                    : "border-slate-700/50 hover:border-blue-500/30",
                "hover:shadow-lg hover:shadow-blue-500/5",
                animations.scaleIn,
                className,
            )}
            onClick={handleCardClick}
            onKeyDown={handleCardClick}
        >
            {/* Основной контент карточки */}
            <div className={`p-${spacing.md}`}>
                {/* Заголовок */}
                <div className={cn(
                    "flex items-start justify-between mb-3",
                    "overflow-hidden"
                )}>
                    <div className={cn(
                        "flex items-center gap-3 flex-1",
                        "w-0 overflow-hidden"
                    )}>
                        {/* Иконка категории */}
                        <div className="flex-shrink-0">
                            {getCategoryIcon(filter.category)}
                        </div>

                        {/* Информация о фильтре */}
                        <div className={cn(
                            "flex-1",
                            "w-0 overflow-hidden"
                        )}>
                            <h3 className={cn(
                                typography.h4,
                                textColors.primary,
                                "truncate w-full block"
                            )}>
                                {filter.name}
                            </h3>
                            <p
                                className={cn(
                                    createTextStyle("small", "muted"),
                                    "truncate w-full block"
                                )}
                            >
                                {filter.criteria}
                            </p>
                        </div>
                    </div>

                    {/* Состояние выбора */}
                    {selected && (
                        <div className="flex-shrink-0 ml-2">
                            <CheckCircle2 size={18} className={textColors.accent} />
                        </div>
                    )}
                </div>

                {/* Метаинформация */}
                <div className={cn(
                    "flex items-center gap-2 flex-wrap mb-3",
                    "overflow-hidden"
                )}>
                    {filter.is_custom && (
                        <div className={cn(createBadgeStyle("success"), "text-xs")}>
                            Мой
                        </div>
                    )}
                </div>

                {/* Expandable секция */}
                {expanded && (
                    <div
                        className={cn(
                            "mt-3 pt-3 border-t border-blue-500/20",
                            animations.fadeIn,
                            "overflow-hidden"
                        )}
                    >
                        <div className={cn(`space-y-${spacing.sm}`)}>
                            {/* Полное описание */}
                            <div className="overflow-hidden">
                                <h4
                                    className={cn(
                                        typography.small,
                                        textColors.secondary,
                                        "font-medium mb-1",
                                    )}
                                >
                                    Критерии:
                                </h4>
                                <p className={cn(
                                    createTextStyle("small", "primary"),
                                    "break-words overflow-wrap-anywhere"
                                )}>
                                    {filter.criteria}
                                </p>
                            </div>

                            {/* Дата создания */}
                            <div className="overflow-hidden">
                                <span className={cn(
                                    createTextStyle("tiny", "muted"),
                                    "truncate block"
                                )}>
                                    Создан: {new Date(filter.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Кнопка удаления */}
                            {filter.is_custom && (
                                < Button
                                    variant="outline"
                                    size="sm"
                                    className={createButtonStyle("danger")}
                                    onClick={handleDeleteFilter}
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Удалить
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Действия */}
            <div
                className={cn(
                    "flex items-center justify-between align-content-center",
                    `p-${spacing.sm}`,
                    "border-t border-slate-700/30",
                    "overflow-hidden"
                )}
            >
                {/* Кнопка разворачивания */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExpandClick}
                    className={cn(
                        createButtonStyle("ghost"),
                        "flex-1 justify-center",
                        "overflow-hidden"
                    )}
                >
                    <span className="truncate">
                        {expanded ? "Свернуть" : "Подробнее"}
                    </span>
                    <ChevronDown
                        className={cn(
                            `ml-${spacing.sm} h-4 w-4 transition-transform flex-shrink-0`,
                            expanded && "rotate-180",
                        )}
                    />
                </Button>

                {/* Меню действий */}
                {showActions && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Кнопка детального просмотра */}
                        {onViewDetails && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMenuAction(() => onViewDetails(filter))}
                                className={cn(createButtonStyle("ghost"), "h-8 w-8 p-0")}
                            >
                                <Info size={14} />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}
