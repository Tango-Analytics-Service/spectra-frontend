// src/components/filters/FiltersPage.tsx
import React, { useState, useEffect } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter as FilterIcon, Settings } from "lucide-react";
import FiltersList from "./FiltersList";
import CreateFilterDialog from "./CreateFilterDialog";
import { cn } from "@/lib/utils";
import {
  components,
  gradients,
  typography,
  spacing,
  createCardStyle,
  createButtonStyle,
  colors,
  radius,
  shadows,
  animations,
  createBadgeStyle,
} from "@/lib/design-system";

const FiltersPage: React.FC = () => {
  const {
    fetchSystemFilters,
    fetchUserFilters,
    systemFilters,
    userFilters,
    isSystemFiltersLoading,
    isUserFiltersLoading,
  } = useFilters();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load filters on component mount
  useEffect(() => {
    fetchSystemFilters();
    fetchUserFilters();
  }, [fetchSystemFilters, fetchUserFilters]);

  const isLoading = isSystemFiltersLoading || isUserFiltersLoading;
  const totalFilters =
    systemFilters.length + userFilters.filter((f) => f.is_custom).length;

  return (
    <div
      className={cn(
        "container mx-auto max-w-5xl",
        `py-${spacing.lg} px-${spacing.md}`,
        animations.fadeIn,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between",
          `mb-${spacing.lg} gap-${spacing.md}`,
        )}
      >
        <div>
          <h1 className={typography.h1}>Фильтры для анализа</h1>
          <p className={cn(typography.small, "text-blue-300 mt-1")}>
            Управление системными и пользовательскими фильтрами для анализа
            каналов
          </p>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
          className={createButtonStyle("primary")}
        >
          <Plus size={16} className="mr-2" />
          Создать фильтр
        </Button>
      </div>

      {/* Stats cards */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-3",
          `gap-${spacing.md} mb-${spacing.lg}`,
          animations.slideIn,
        )}
      >
        <StatsCard
          title="Всего фильтров"
          value={totalFilters}
          icon={<FilterIcon size={20} className="text-blue-400" />}
          bgColor="bg-blue-500/10"
        />
        <StatsCard
          title="Системные фильтры"
          value={systemFilters.length}
          icon={<Settings size={20} className="text-purple-400" />}
          bgColor="bg-purple-500/10"
        />
        <StatsCard
          title="Мои фильтры"
          value={userFilters.filter((f) => f.is_custom).length}
          icon={<Plus size={20} className="text-green-400" />}
          bgColor="bg-green-500/10"
        />
      </div>

      {/* Filters list */}
      <div
        className={cn(createCardStyle(), `p-${spacing.lg}`, animations.fadeIn)}
      >
        <FiltersList height="h-[600px]" />
      </div>

      {/* Create Filter Dialog */}
      {showCreateDialog && (
        <CreateFilterDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      )}
    </div>
  );
};

// Stats card component
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
}) => (
  <div
    className={cn(
      createCardStyle(),
      `p-${spacing.md}`,
      "flex items-center",
      animations.scaleIn,
    )}
  >
    <div
      className={cn(
        bgColor,
        `rounded-${radius.full}`,
        `p-${spacing.sm} mr-${spacing.md}`,
      )}
    >
      {icon}
    </div>
    <div>
      <div className={cn(typography.h2, "font-semibold")}>{value}</div>
      <div className={cn(typography.small, "text-blue-300")}>{title}</div>
    </div>
  </div>
);

export default FiltersPage;
