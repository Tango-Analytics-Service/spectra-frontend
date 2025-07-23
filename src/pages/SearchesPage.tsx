import { useState, useEffect } from "react";
import { Button } from "@/ui/components/button";
import { Plus, Search, Zap } from "lucide-react";
import CreateRequestDialog from "@/channels-sets/components/CreateRequestDialog";
import StatsCard from "@/ui/components/stats-card";
import { cn } from "@/lib/cn";
import { createButtonStyle, createCardStyle, typography, spacing, gradients, animations, textColors, createTextStyle } from "@/lib/design-system";
import { useSearchStore } from "@/search/stores/useSearchStore";
import SearchSessionsList from "@/search/components/SearchSessionsList";
import { SearchSession } from "@/search/types";

export default function SearchesPage() {
    const sessions = useSearchStore(state => state.sessions);
    const loadStatus = useSearchStore(state => state.loadStatus);
    const fetchSessions = useSearchStore(state => state.fetchSessions);
    const refreshSession = useSearchStore(state => state.refreshSession);

    const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);
    const [selectedSession, setSelectedSession] = useState<SearchSession | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Auto-refresh for processing sessions
    useEffect(() => {
        const processingSessions = sessions.filter(s => s.status === "processing" || s.status === "pending");
        if (processingSessions.length === 0) return;

        const interval = setInterval(() => {
            processingSessions.forEach(session => {
                refreshSession(session.search_session_id);
            });
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [sessions, refreshSession]);

    const handleSessionSelect = (session: SearchSession) => {
        setSelectedSession(session);
        setIsDetailsOpen(true);
    };

    const smartSets = sessions; // Use sessions now

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
                                : smartSets.filter(set => set.status === "processing").length}
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
                        <SearchSessionsList 
                            sessions={sessions}
                            isLoading={loadStatus === "pending"}
                            onSessionSelect={handleSessionSelect}
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
