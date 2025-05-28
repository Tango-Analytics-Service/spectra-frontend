// src/components/filters/FilterCard.tsx
import React, { useState } from "react";
import {
  CheckCircle2,
  Tag,
  Info,
  Trash2,
  ChevronDown,
  MoreHorizontal,
  Settings,
  Copy,
} from "lucide-react";
import { Filter } from "@/contexts/FilterContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createCardStyle,
  createBadgeStyle,
  createButtonStyle,
  typography,
  spacing,
  animations,
  textColors,
  createTextStyle,
} from "@/lib/design-system";

interface FilterCardProps {
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
const getCategoryIcon = (category?: string) => {
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

// Получение варианта бейджа для категории
const getCategoryBadgeVariant = (
  category?: string,
): "primary" | "success" | "warning" | "error" => {
  switch (category) {
    case "Содержание":
      return "success";
    case "Качество":
      return "primary";
    case "Безопасность":
      return "error";
    case "Вовлеченность":
      return "warning";
    default:
      return "primary";
  }
};

const FilterCard: React.FC<FilterCardProps> = ({
  filter,
  selected = false,
  expanded = false,
  onSelect,
  onToggleExpand,
  onViewDetails,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div
      className={cn(
        createCardStyle(),
        "transition-all duration-200 cursor-pointer overflow-hidden",
        selected
          ? "ring-2 ring-blue-500/50 bg-blue-500/5 border-blue-500/50"
          : "border-slate-700/50 hover:border-blue-500/30",
        "hover:shadow-lg hover:shadow-blue-500/5",
        animations.scaleIn,
        className,
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Основной контент карточки */}
      <div className={`p-${spacing.md}`}>
        {/* Заголовок */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Иконка категории */}
            <div className="flex-shrink-0">
              {getCategoryIcon(filter.category)}
            </div>

            {/* Информация о фильтре */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(typography.h4, textColors.primary, "truncate")}>
                {filter.name}
              </h3>
              <p
                className={cn(
                  createTextStyle("small", "muted"),
                  "line-clamp-1",
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
        <div className="flex items-center gap-2 flex-wrap mb-3">
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
            )}
          >
            <div className={cn(`space-y-${spacing.sm}`)}>
              {/* Полное описание */}
              <div>
                <h4
                  className={cn(
                    typography.small,
                    textColors.secondary,
                    "font-medium mb-1",
                  )}
                >
                  Критерии:
                </h4>
                <p className={cn(createTextStyle("small", "primary"))}>
                  {filter.criteria}
                </p>
              </div>

              {/* Дата создания */}
              <div>
                <span className={cn(createTextStyle("tiny", "muted"))}>
                  Создан: {new Date(filter.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Действия */}
      <div
        className={cn(
          "flex items-center justify-between",
          `px-${spacing.md} pb-${spacing.md}`,
          "border-t border-slate-700/30",
        )}
      >
        {/* Кнопка разворачивания */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpandClick}
          className={cn(createButtonStyle("ghost"), "flex-1 justify-start")}
        >
          {expanded ? "Свернуть" : "Подробнее"}
          <ChevronDown
            className={cn(
              `ml-${spacing.sm} h-4 w-4 transition-transform`,
              expanded && "rotate-180",
            )}
          />
        </Button>

        {/* Меню действий */}
        {showActions && (
          <div className="flex items-center gap-1">
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
    </div>
  );
};

export default FilterCard;
