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
        "transition-all duration-200 border hover:border-blue-500/30",
        selected
          ? "bg-blue-500/10 border-blue-500/50"
          : "bg-slate-800/40 border-slate-700/50",
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {/* Category Tag */}
            <div
              className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                getCategoryColor(filter.category),
              )}
            >
              {filter.category || "Общий"}
            </div>

            {/* Custom filter badge */}
            {filter.is_custom && (
              <div className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Свой
              </div>
            )}
          </div>

          {/* Selected state indicator */}
          {selected && <CheckCircle2 size={18} className="text-blue-400" />}
        </div>

        <h3 className="text-base font-medium mt-3 mb-1">{filter.name}</h3>

        <p className="text-sm text-gray-400 line-clamp-2">{filter.criteria}</p>

        {showActions && (
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center space-x-2">
              {filter.threshold && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-blue-300">
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
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
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

// Helper function to get color based on category
const getCategoryColor = (category?: string): string => {
  if (!category) return "bg-slate-500/20 text-slate-300";

  const categoryColors: Record<string, string> = {
    Содержание:
      "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
    Качество: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
    Безопасность: "bg-red-500/20 text-red-400 border border-red-500/20",
    Вовлеченность: "bg-amber-500/20 text-amber-400 border border-amber-500/20",
    Рост: "bg-purple-500/20 text-purple-400 border border-purple-500/20",
  };

  return (
    categoryColors[category] ||
    "bg-slate-500/20 text-slate-300 border border-slate-500/20"
  );
};

export default FilterCard;
