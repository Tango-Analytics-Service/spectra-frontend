// src/components/filters/FiltersPage.tsx
import React, { useState, useEffect } from "react";
import { useFilters } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { Plus, Filter as FilterIcon, Settings } from "lucide-react";
import FiltersList from "./FiltersList";
import CreateFilterDialog from "./CreateFilterDialog";
import { cn } from "@/lib/utils";
import {
  createButtonStyle,
  createCardStyle,
  typography,
  spacing,
  gradients,
  animations,
  textColors,
  createTextStyle,
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

  // Загрузка фильтров при монтировании
  useEffect(() => {
    fetchSystemFilters();
    fetchUserFilters();
  }, [fetchSystemFilters, fetchUserFilters]);

  // Подсчет статистики
  const isLoading = isSystemFiltersLoading || isUserFiltersLoading;
  const totalFilters =
    systemFilters.length + userFilters.filter((f) => f.is_custom).length;
  const systemFiltersCount = systemFilters.length;
  const customFiltersCount = userFilters.filter((f) => f.is_custom).length;

  return (
    <div
      className={cn(
        "flex flex-col w-full min-h-screen",
        gradients.background,
        "text-white",
      )}
    >
      <main
        className={cn(
          "flex-1 overflow-hidden flex flex-col",
          `px-${spacing.md} sm:px-${spacing.lg}`,
          `pb-${spacing.md} sm:pb-${spacing.lg}`,
        )}
      >
        {/* Заголовок */}
        <div
          className={`mt-${spacing.sm} sm:mt-${spacing.md} mb-${spacing.lg}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={typography.h1}>Фильтры</h1>
              <p className={cn(createTextStyle("small", "secondary"), "mt-1")}>
                Управление фильтрами для анализа каналов
              </p>
            </div>

            {/* Кнопка создания на мобильных */}
            <div className="sm:hidden">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className={cn(createButtonStyle("primary"), "h-10 w-10 p-0")}
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          {/* Статистика */}
          <div
            className={cn(
              "grid grid-cols-3 sm:grid-cols-3",
              `gap-${spacing.md}`,
              animations.slideIn,
            )}
          >
            <StatsCard
              title="Всего"
              value={isLoading ? "—" : totalFilters}
              icon={<FilterIcon size={15} className={textColors.accent} />}
              loading={isLoading}
            />
            <StatsCard
              title="Системные"
              value={isLoading ? "—" : systemFiltersCount}
              icon={<Settings size={15} className="text-purple-400" />}
              loading={isLoading}
            />
            <StatsCard
              title="Мои фильтры"
              value={isLoading ? "—" : customFiltersCount}
              icon={<Plus size={15} className="text-green-400" />}
              loading={isLoading}
            />
          </div>
        </div>

        {/* Список фильтров */}
        <div
          className={cn(
            createCardStyle(),
            `p-${spacing.lg}`,
            "flex-1 overflow-hidden flex flex-col",
            animations.fadeIn,
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={typography.h3}>Все фильтры</h2>

            {/* Кнопка создания на десктопе */}
            <div className="hidden sm:block">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className={createButtonStyle("primary")}
              >
                <Plus size={16} className={`mr-${spacing.sm}`} />
                Создать фильтр
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <FiltersList height="h-full" showActions={true} />
          </div>
        </div>
      </main>

      {/* Диалог создания фильтра */}
      <CreateFilterDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

// Компонент карточки статистики
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  loading = false,
}) => (
  <div
    className={cn(
      createCardStyle(),
      `p-${spacing.md}`,
      "flex items-start flex-wrap content-between justify-start",
      animations.scaleIn,
    )}
  >
    <div
      className={cn(
        createTextStyle("small", "secondary"),
        "truncate",
        `pb-${spacing.sm} pr-${spacing.sm}`,
      )}
    >
      {title}
    </div>
    <div
      className={cn(
        "bg-blue-500/10 rounded-full",
        `p-${spacing.sm} mr-${spacing.md}`,
        "flex items-center justify-center",
      )}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className={cn(typography.h2, "font-semibold truncate")}>
        {loading ? (
          <div className="animate-pulse bg-slate-700 h-6 w-8 rounded"></div>
        ) : (
          value
        )}
      </div>
    </div>
  </div>
);

export default FiltersPage;
