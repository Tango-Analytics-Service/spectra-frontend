// src/components/filters/FiltersHeader.tsx
import React from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    typography,
    spacing,
    animations,
    createButtonStyle,
    textColors,
} from "@/lib/design-system";

interface FiltersHeaderProps {
    totalFilters: number;
    systemFiltersCount: number;
    customFiltersCount: number;
    onCreateFilter: () => void;
    onBack?: () => void;
}

const FiltersHeader: React.FC<FiltersHeaderProps> = ({
    totalFilters,
    systemFiltersCount,
    customFiltersCount,
    onCreateFilter,
    onBack,
}) => {
    return (
        <div
            className={cn(
                "flex flex-col",
                `gap-${spacing.sm}`,
                `pb-${spacing.md}`,
                animations.fadeIn,
            )}
        >
            {/* Top row with title and create button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="h-8 w-8"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                    )}
                    <h1 className={typography.h1}>Фильтры</h1>
                </div>
        
                <Button
                    onClick={onCreateFilter}
                    className={cn(createButtonStyle("primary"), "h-9")}
                >
                    <Plus size={16} className="mr-1" />
                    <span className="hidden xs:inline">Создать</span>
                </Button>
            </div>

            {/* Compact stats */}
            <div className="flex items-center gap-1 flex-wrap">
                <span className={cn(typography.small, textColors.muted)}>
                    {totalFilters} всего
                </span>
                <span className={cn(typography.small, textColors.muted)}>•</span>
                <span className={cn(typography.small, textColors.accent)}>
                    {systemFiltersCount} системных
                </span>
                <span className={cn(typography.small, textColors.muted)}>•</span>
                <span className={cn(typography.small, textColors.secondary)}>
                    {customFiltersCount} моих
                </span>
            </div>
        </div>
    );
};

export default FiltersHeader;