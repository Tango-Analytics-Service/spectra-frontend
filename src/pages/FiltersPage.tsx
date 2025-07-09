import { useState, useEffect } from "react";
import { Button } from "@/ui/components/button";
import { Plus, Filter as FilterIcon, Settings } from "lucide-react";
import FiltersList from "@/filters/components/FiltersList";
import CreateFilterDialog from "@/filters/components/CreateFilterDialog";
import StatsCard from "@/ui/components/stats-card";
import { cn } from "@/lib/cn";
import { createButtonStyle, createCardStyle, typography, spacing, gradients, animations, textColors, createTextStyle } from "@/lib/design-system";
import { useFiltersStore } from "@/filters/stores/useFiltersStore";

export default function FiltersPage() {
    const systemFilters = useFiltersStore(state => state.systemFilters);
    const userFilters = useFiltersStore(state => state.userFilters);
    const systemFiltersLoadStatus = useFiltersStore(state => state.systemFiltersLoadStatus);
    const userFilterLoadStatus = useFiltersStore(state => state.userFiltersLoadStatus);
    const fetchSystemFilters = useFiltersStore(state => state.fetchSystemFilters);
    const fetchUserFilters = useFiltersStore(state => state.fetchUserFilters);

    const [showCreateDialog, setShowCreateDialog] = useState(false);

    fetchUserFilters();
    fetchSystemFilters();

    // Подсчет статистики
    const totalFilters = systemFilters.length + userFilters.filter((f) => f.is_custom).length;
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
                            "grid grid-cols-3",
                            `gap-${spacing.md}`,
                            animations.slideIn,
                        )}
                    >
                        <StatsCard
                            title="Всего"
                            value={systemFiltersLoadStatus !== "success" || userFilterLoadStatus !== "success" ? "—" : totalFilters}
                            icon={<FilterIcon size={15} className={textColors.accent} />}
                            loading={systemFiltersLoadStatus === "pending" || userFilterLoadStatus === "pending"}
                        />
                        <StatsCard
                            title="Системные"
                            value={systemFiltersLoadStatus !== "success" ? "—" : systemFiltersCount}
                            icon={<Settings size={15} className="text-purple-400" />}
                            loading={systemFiltersLoadStatus === "pending"}
                        />
                        <StatsCard
                            title="Мои фильтры"
                            value={userFilterLoadStatus !== "success" ? "—" : customFiltersCount}
                            icon={<Plus size={15} className="text-green-400" />}
                            loading={userFilterLoadStatus === "pending"}
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
}
