// src/components/filters/FilterCard.tsx
import React from "react";
import {
  CheckCircle2,
  XCircle,
  Tag,
  Info,
  Trash2,
  StarIcon,
} from "lucide-react";
import { Filter } from "@/contexts/FilterContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createCardStyle,
  createBadgeStyle,
  typography,
  spacing,
  animations,
  components,
} from "@/lib/design-system";

interface FilterCardProps {
  filter: Filter;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const FilterCard: React.FC<FilterCardProps> = ({
  filter,
  selected = false,
  onSelect,
  onDelete,
  showActions = true,
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(filter.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(filter.id);
    }
  };

  return (
    <Card
      className={cn(
        createCardStyle(),
        "transition-all duration-200 cursor-pointer",
        selected
          ? "border-blue-500/50 bg-blue-500/10"
          : "border-slate-700/50 hover:border-blue-500/30",
        animations.scaleIn,
      )}
      onClick={handleClick}
    >
      <CardContent className={`p-${spacing.md}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {/* Category Tag */}
            <div
              className={cn(
                createBadgeStyle(getCategoryVariant(filter.category)),
                "text-xs",
              )}
            >
              {filter.category || "Общий"}
            </div>

            {/* Custom filter badge */}
            {filter.is_custom && (
              <div className={cn(createBadgeStyle("primary"), "text-xs")}>
                Свой
              </div>
            )}
          </div>

          {/* Selected state indicator */}
          {selected && <CheckCircle2 size={18} className="text-blue-400" />}
        </div>

        <h3 className={cn(typography.h4, `mt-${spacing.sm} mb-1`)}>
          {filter.name}
        </h3>

        <p
          className={cn(
            typography.small,
            "text-gray-400 line-clamp-2",
            `mb-${spacing.sm}`,
          )}
        >
          {filter.criteria}
        </p>

        {showActions && (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {filter.threshold && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        typography.tiny,
                        "text-blue-300 flex items-center",
                      )}
                    >
                      <Info size={12} className="mr-1" />
                      <span>Порог: {filter.threshold}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Минимальный балл для прохождения (1-10)</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Delete button for custom filters */}
            {filter.is_custom && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(components.button.danger, "h-8 w-8 p-0")}
                onClick={handleDelete}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get badge variant based on category
const getCategoryVariant = (
  category?: string,
): "primary" | "success" | "warning" | "error" => {
  if (!category) return "primary";

  const categoryVariants: Record<
    string,
    "primary" | "success" | "warning" | "error"
  > = {
    Содержание: "success",
    Качество: "primary",
    Безопасность: "error",
    Вовлеченность: "warning",
    Рост: "primary",
  };

  return categoryVariants[category] || "primary";
};

export default FilterCard;
