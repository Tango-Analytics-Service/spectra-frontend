import { useEffect, useState } from "react";
import { RefreshCw, Search, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import Card from "@/ui/components/card/Card";
import CardContent from "@/ui/components/card/CardContent";
import { Skeleton } from "@/ui/components/skeleton";
import StatsCard from "@/ui/components/stats-card";
import { AnalysisTask, AnalysisTaskBasic } from "@/analysis/types";
import { createCardStyle, createButtonStyle, createTextStyle, typography, spacing, animations, textColors, gradients, components } from "@/lib/design-system";
import TaskCard from "@/analysis/components/TaskCard";
import MobileActionSheet from "@/analysis/components/MobileActionSheet";
import { ChannelsSet } from "@/channels-sets/types";
import TaskDetailsModal from "@/analysis/components/TaskDetailsModal";
import { useAnalysisTasksStore } from "@/analysis/stores/useAnalysisTasksStore";
import { useChannelsSetsStore } from "@/channels-sets/stores/useChannelsSetsStore";

function filterDate(taskDate: Date, dateFilter: string) {
    if (dateFilter === "all") {
        return true;
    }
    const now = new Date();
    switch (dateFilter) {
        case "today":
            if (taskDate.toDateString() !== now.toDateString()) return false;
        case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (taskDate < weekAgo) return false;
        case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (taskDate < monthAgo) return false;
    }
}

/// Search filter (по ID задачи или названию набора каналов)
function filterQuery(task: AnalysisTaskBasic, details: AnalysisTask, searchQuery: string | undefined, channelSets: ChannelsSet[]) {
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        // Проверяем ID задачи
        if (task.id.toLowerCase().includes(query)) {
            return true;
        }
        // Проверяем название канала из деталей, если они есть
        if (details?.channel_set_id) {
            const channelSet = channelSets.find(set => set.id === details.channel_set_id);
            if (channelSet?.name.toLowerCase().includes(query)) {
                return true;
            }
        }
        return false;
    }
    return true;
}

// Действия для ActionSheet
function getTaskActions(task: AnalysisTaskBasic | null, onPress: () => void) {
    if (!task) return [];
    const actions = [
        {
            icon: RefreshCw,
            title: "Обновить статус",
            subtitle: "Проверить текущий статус задачи",
            onPress,
            color: "bg-blue-500/20",
            iconColor: textColors.accent,
            disabled: false,
        }
    ];
    return actions;
};

export default function AnalysisTasksPage() {
    const channelsSets = useChannelsSetsStore(state => state.channelsSets);

    const tasks = useAnalysisTasksStore(state => state.tasks);
    const taskDetails = useAnalysisTasksStore(state => state.tasksDetails);
    const isLoaded = useAnalysisTasksStore(state => state.isLoaded);
    const selectedTask = useAnalysisTasksStore(state => state.selectedTask);
    const fetchTasks = useAnalysisTasksStore(state => state.fetchTasks);
    const refreshTask = useAnalysisTasksStore(state => state.refreshTask);
    const selectTaskById = useAnalysisTasksStore(state => state.selectTaskById);

    // UI состояния
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const selectedTaskForActions = null;

    // Фильтры
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const dateFilter = "all";

    // Загрузка задач при монтировании
    useEffect(() => {
        if (!isLoaded) {
            fetchTasks();
        }
    }, [fetchTasks, isLoaded]);

    // Обработчик обновления
    const handleRefresh = () => {
        fetchTasks(50, 0, undefined, true);
    };

    // Фильтрация задач
    const filteredTasks = tasks.filter(task => {
        // Status filter
        if (statusFilter !== "all" && task.status !== statusFilter) {
            return false;
        }
        return filterQuery(task, taskDetails[task.id], searchQuery, channelsSets)
            && filterDate(new Date(task.created_at), dateFilter);
    });

    return (
        <div
            className={cn(
                "flex flex-col w-full min-h-screen",
                gradients.background,
                "text-white"
            )}
        >
            <main
                className={cn(
                    "flex-1 overflow-hidden flex flex-col",
                    `px-${spacing.md} sm:px-${spacing.lg}`,
                    `pb-${spacing.md} sm:pb-${spacing.lg}`
                )}
            >
                {/* Header */}
                <div className={`mt-${spacing.sm} sm:mt-${spacing.md} mb-${spacing.lg}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className={typography.h1}>Задачи анализа</h1>
                            <p className={cn(createTextStyle("small", "secondary"), "mt-1")}>
                                Отслеживайте статус и результаты анализа каналов
                            </p>
                        </div>
                        <Button
                            onClick={handleRefresh}
                            disabled={!isLoaded}
                            className={createButtonStyle("secondary")}
                        >
                            {!isLoaded ? (
                                <RefreshCw size={16} className="mr-2 animate-spin" />
                            ) : (
                                <RefreshCw size={16} className="mr-2" />
                            )}
                            Обновить
                        </Button>
                    </div>

                    {/* Быстрая статистика */}
                    <div className={cn("grid grid-cols-3", `gap-${spacing.md}`, animations.slideIn)}>
                        <StatsCard
                            title="Всего"
                            value={!isLoaded ? "—" : tasks.length}
                            icon={<BarChart3 size={15} className={textColors.accent} />}
                            loading={!isLoaded}
                        />
                        <StatsCard
                            title="Завершено"
                            value={!isLoaded ? "—" : tasks.filter(t => t.status === "completed").length}
                            icon={<CheckCircle size={15} className={textColors.success} />}
                            loading={!isLoaded}
                        />
                        <StatsCard
                            title="В процессе"
                            value={!isLoaded ? "—" : tasks.filter(t => t.status === "processing").length}
                            icon={<RefreshCw size={15} className={textColors.accent} />}
                            loading={!isLoaded}
                        />
                    </div>
                </div>

                {/* Фильтры */}
                <Card className={cn(createCardStyle(), `mb-${spacing.lg}`)}>
                    <CardContent className={`p-${spacing.md}`}>
                        <div className={cn("flex flex-col", `gap-${spacing.md}`)}>
                            {/* Поиск */}
                            <div className="relative">
                                <Search
                                    size={16}
                                    className={cn("absolute left-3 top-1/2 transform -translate-y-1/2", textColors.muted)}
                                />
                                <Input
                                    placeholder="Поиск по ID задачи или названию набора..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={cn(components.input.base, "pl-9")}
                                />
                            </div>

                            {/* Фильтры статуса - горизонтальная прокрутка */}
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {[
                                    { value: "all", label: "Все" },
                                    { value: "completed", label: "Завершены" },
                                    { value: "processing", label: "В процессе" },
                                    { value: "failed", label: "Ошибки" }
                                ].map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setStatusFilter(filter.value)}
                                        className={cn(
                                            `px-${spacing.sm} py-1`,
                                            "rounded-full text-sm whitespace-nowrap transition-all",
                                            statusFilter === filter.value
                                                ? "bg-blue-500 text-white"
                                                : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50"
                                        )}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Список задач */}
                <div className={cn("flex-1", animations.fadeIn)}>
                    {!isLoaded ? (
                        <div className={`space-y-${spacing.sm}`}>
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className={cn(createCardStyle(), "text-center", `py-${spacing.xl}`)}>
                            <AlertCircle className={cn("mx-auto h-12 w-12 mb-4", textColors.muted)} />
                            <p className={createTextStyle("small", "muted")}>
                                {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                                    ? "Нет задач, соответствующих фильтрам"
                                    : "У вас пока нет задач анализа"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className={`space-y-${spacing.sm}`}>
                            {filteredTasks.map((task) => (
                                <TaskCard key={task.id} task={task} details={taskDetails[task.id]} onTaskPress={() => {
                                    selectTaskById(task.id);
                                    setShowTaskDetails(true);
                                }} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Модальное окно с деталями */}
            <TaskDetailsModal
                selectedTask={selectedTask}
                isOpen={showTaskDetails}
                onClose={() => setShowTaskDetails(false)}
                refresh={() => refreshTask(selectedTask.id)}
            />

            {/* ActionSheet для действий с задачей */}
            <MobileActionSheet
                isOpen={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                actions={getTaskActions(selectedTaskForActions, () => refreshTask(selectedTaskForActions.id))}
            />
        </div>
    );
};
