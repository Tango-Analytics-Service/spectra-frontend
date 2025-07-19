import { useState } from "react";
import { Button } from "@/ui/components/button";
import { Plus, Search, Zap } from "lucide-react";
import CreateRequestDialog from "@/channels-sets/components/CreateRequestDialog";
import StatsCard from "@/ui/components/stats-card";
import { cn } from "@/lib/cn";
import { createButtonStyle, createCardStyle, typography, spacing, gradients, animations, textColors, createTextStyle } from "@/lib/design-system";
import { useChannelsSetsStore } from "@/channels-sets/stores/useChannelsSetsStore";
import SmartSetsList from "@/filters/components/SmartSetsList"; // Новый компонент

export default function FiltersPage() {    
    const channelsSets = useChannelsSetsStore(state => state.channelsSets);
    const loadStatus = useChannelsSetsStore(state => state.loadStatus);
    const fetchChannelsSets = useChannelsSetsStore(state => state.fetchChannelsSets);

    const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);

    // Загружаем наборы каналов
    fetchChannelsSets();
    
    // Получаем только умные наборы (с build_criteria)
    const smartSets = channelsSets.filter(set => set.build_criteria);

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
                            <h1 className={typography.h1}>Мои запросы</h1>
                            <p className={cn(createTextStyle("small", "secondary"), "mt-1")}>
                                Управление запросами для поиска каналов
                            </p>
                        </div>

                        {/* Кнопка создания на мобильных */}
                        <div className="sm:hidden">
                            <Button
                                onClick={() => setShowCreateRequestDialog(true)}
                                className={cn(createButtonStyle("primary"), "h-10 w-10 p-0")}
                            >
                                <Plus size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Статистика */}
                    <div
                        className={cn(
                            "grid grid-cols-2",
                            `gap-${spacing.md}`,
                            animations.slideIn,
                        )}
                    >
                        <StatsCard
                            title="Всего запросов"
                            value={loadStatus !== "success" ? "—" : smartSets.length}
                            icon={<Search size={15} className={textColors.accent} />}
                            loading={loadStatus === "pending"}
                        />
                        <StatsCard
                            title="В работе"
                            value={loadStatus !== "success" 
                                ? "—" 
                                : smartSets.filter(set => set.build_status === "building").length}
                            icon={<Zap size={15} className="text-yellow-400" />}
                            loading={loadStatus === "pending"}
                        />
                    </div>
                </div>

                {/* Список запросов */}
                <div
                    className={cn(
                        createCardStyle(),
                        `p-${spacing.lg}`,
                        "flex-1 overflow-hidden flex flex-col",
                        animations.fadeIn,
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={typography.h3}>Мои запросы</h2>

                        {/* Кнопка создания на десктопе */}
                        <div className="hidden sm:flex">
                            <Button
                                onClick={() => setShowCreateRequestDialog(true)}
                                className={createButtonStyle("primary")}
                            >
                                <Zap size={16} className={`mr-${spacing.sm}`} />
                                Создать запрос
                            </Button>
                        </div>
                    </div>

                    {/* Здесь подключаем компонент SmartSetsList */}
                    <div className="flex-1 overflow-hidden">
                        <SmartSetsList 
                            smartSets={smartSets}
                            isLoading={loadStatus === "pending"}
                        />
                    </div>
                </div>
            </main>

            {/* Диалог создания запроса */}
            <CreateRequestDialog
                open={showCreateRequestDialog}
                onOpenChange={setShowCreateRequestDialog}
                initialQuery=""
            />
        </div>
    );
}
