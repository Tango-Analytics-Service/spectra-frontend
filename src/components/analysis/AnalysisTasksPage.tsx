// src/components/analysis/AnalysisTasksPage.tsx - улучшенная версия с design-system
import React, { useState, useEffect } from "react";
import {
    RefreshCw,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/ui/stats-card";
import { useAnalysisTasks } from "@/contexts/AnalysisTasksContext";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { AnalysisTaskBasic } from "@/types/analysis";
import AnalysisResultsCard from "./AnalysisResultsCard";
import {
    createCardStyle,
    createButtonStyle,
    createBadgeStyle,
    createTextStyle,
    typography,
    spacing,
    animations,
    textColors,
    gradients,
    components,
} from "@/lib/design-system";

// Компонент MobileActionSheet
const MobileActionSheet: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    actions: {
        icon: React.ElementType,
        iconColor: string,
        title: string,
        subtitle: string,
        color: string,
        onPress: () => void,
        disabled: boolean,
    }[],
}> = ({ isOpen, onClose, actions = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
            <div
                className={cn(
                    createCardStyle(),
                    "border-t rounded-t-2xl",
                    "w-full max-w-md animate-in slide-in-from-bottom duration-300"
                )}
            >
                {/* Индикатор */}
                <div className="flex justify-center pt-2 pb-1">
                    <div className="w-10 h-1 bg-gray-600 rounded-full" />
                </div>

                {/* Заголовок */}
                <div className={cn("flex items-center justify-between", `p-${spacing.md}`, "border-b border-slate-700/50")}>
                    <h3 className={cn(typography.h4, textColors.primary)}>Действия</h3>
                    <button
                        onClick={onClose}
                        className={cn(textColors.muted, "hover:" + textColors.primary, "p-1")}
                    >
                        ✕
                    </button>
                </div>

                {/* Действия */}
                <div className={cn(`p-${spacing.md}`, `space-y-${spacing.sm}`)}>
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                action.onPress();
                                onClose();
                            }}
                            disabled={action.disabled}
                            className={cn(
                                "w-full flex items-center justify-between",
                                `p-${spacing.sm}`,
                                "rounded-lg transition-all duration-200",
                                action.disabled
                                    ? "bg-slate-700/50 text-gray-500 cursor-not-allowed"
                                    : "bg-slate-700/50 text-white hover:bg-slate-600/50 active:scale-[0.98]"
                            )}
                        >
                            <div className={cn("flex items-center", `space-x-${spacing.sm}`)}>
                                <div className={cn(
                                    `p-${spacing.sm}`,
                                    "rounded-lg",
                                    action.disabled ? "bg-slate-600/50" : action.color || "bg-blue-500/20"
                                )}>
                                    <action.icon size={18} className={action.disabled ? "text-gray-500" : action.iconColor || textColors.accent} />
                                </div>
                                <div className="text-left">
                                    <div className={typography.weight.medium}>{action.title}</div>
                                    {action.subtitle && (
                                        <div className={createTextStyle("tiny", "muted")}>{action.subtitle}</div>
                                    )}
                                </div>
                            </div>
                            <ChevronRight size={16} className={textColors.muted} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AnalysisTasksPage: React.FC = () => {
    const { channelSets } = useChannelSets();
    const {
        tasks,
        taskDetails,
        isLoading,
        selectedTask,
        fetchTasks,
        refreshTask,
        selectTaskById,
    } = useAnalysisTasks();

    // UI состояния
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [selectedTaskForActions] = useState(null);

    // Фильтры
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter] = useState("all");

    // Загрузка задач при монтировании
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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

        // Search filter (по ID задачи или названию набора каналов)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();

            // Проверяем ID задачи
            if (task.id.toLowerCase().includes(query)) {
                return true;
            }

            // Проверяем название канала из деталей, если они есть
            const details = taskDetails[task.id];
            if (details?.channel_set_id) {
                const channelSet = channelSets.find(set => set.id === details.channel_set_id);
                if (channelSet?.name.toLowerCase().includes(query)) {
                    return true;
                }
            }

            return false;
        }

        // Date filter
        if (dateFilter !== "all") {
            const taskDate = new Date(task.created_at);
            const now = new Date();

            switch (dateFilter) {
                case "today":
                    if (taskDate.toDateString() !== now.toDateString()) return false;
                    break;
                case "week":
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (taskDate < weekAgo) return false;
                    break;
                case "month":
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    if (taskDate < monthAgo) return false;
                    break;
            }
        }

        return true;
    });

    // Получение иконки статуса
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle size={16} className={textColors.success} />;
            case "failed":
                return <XCircle size={16} className={textColors.error} />;
            case "processing":
                return <RefreshCw size={16} className={cn(textColors.accent, "animate-spin")} />;
            default:
                return <Clock size={16} className={textColors.warning} />;
        }
    };

    // Получение текста статуса
    const getStatusText = (status: string) => {
        switch (status) {
            case "completed": return "Завершен";
            case "failed": return "Ошибка";
            case "processing": return "Выполняется";
            default: return "Ожидание";
        }
    };

    // Получение варианта статуса
    const getStatusVariant = (status: string): "success" | "error" | "primary" | "warning" => {
        switch (status) {
            case "completed": return "success";
            case "failed": return "error";
            case "processing": return "primary";
            default: return "warning";
        }
    };

    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return "Только что";
        if (diffHours < 24) return `${diffHours}ч назад`;
        return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
    };

    // Компонент карточки задачи
    const TaskCard = ({ task }: { task: AnalysisTaskBasic }) => {
        const details = taskDetails[task.id];

        const successRate = details?.summary
            ? Math.round((details.summary.approved_channels / details.summary.total_channels) * 100)
            : null;

        const handleTaskPress = () => {
            selectTaskById(task.id);
            setShowTaskDetails(true);
        };

        return (
            <button
                className={cn(
                    createCardStyle(),
                    `p-${spacing.md}`,
                    "transition-all duration-200 active:scale-[0.98]",
                    "hover:border-blue-500/30 hover:bg-slate-800/70",
                    "cursor-pointer"
                )}
                onClick={handleTaskPress}
            >
                {/* Заголовок и действия */}
                <div className={cn("flex items-center justify-between", `mb-${spacing.sm}`)}>
                    <div className={cn("flex items-center", `space-x-${spacing.sm}`)}>
                        <Badge
                            variant="outline"
                            className={createBadgeStyle(getStatusVariant(task.status))}
                        >
                            {getStatusIcon(task.status)}
                            <span className="ml-1">{getStatusText(task.status)}</span>
                        </Badge>
                        <span className={createTextStyle("tiny", "muted")}>{formatDate(task.created_at)}</span>
                    </div>
                </div>

                {/* Основная информация */}
                <div className={cn("grid grid-cols-2", `gap-${spacing.sm} mb-${spacing.sm}`)}>
                    <div className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}>
                        <div className={createTextStyle("tiny", "accent")}>Каналов</div>
                        <div className={cn(typography.weight.semibold, textColors.primary)}>{details?.summary?.total_channels || "-"}</div>
                    </div>

                    {task.status === "completed" && successRate !== null && (
                        <div className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}>
                            <div className={createTextStyle("tiny", "success")}>Успешность</div>
                            <div className={cn(typography.weight.semibold, textColors.primary)}>{successRate}%</div>
                        </div>
                    )}

                    {task.status === "processing" && task.progress > 0 && (
                        <div className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}>
                            <div className={createTextStyle("tiny", "accent")}>Прогресс</div>
                            <div className={cn(typography.weight.semibold, textColors.primary)}>{task.progress}%</div>
                        </div>
                    )}
                </div>

                {/* Прогресс бар для выполняющихся задач */}
                {task.status === "processing" && task.progress > 0 && (
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                        />
                    </div>
                )}

                {/* ID задачи */}
                <div className={cn("mt-2", createTextStyle("tiny", "muted"))}>
                    ID: {task.id.slice(0, 8)}...
                </div>
            </button>
        );
    };

    // Модальное окно с деталями задачи
    const TaskDetailsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
        if (!isOpen || !selectedTask) return null;

        return (
            <div className="fixed inset-0 backdrop-blur-lg bg-black/50 z-50 flex items-center justify-center p-4 pb-20">
                <div
                    className={cn(
                        createCardStyle(),
                        "rounded-2xl",
                        "w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col",
                        animations.slideIn
                    )}
                >
                    {/* Заголовок */}
                    <div className={cn(`p-${spacing.md}`, "border-b border-slate-700/50")}>
                        <div className="flex items-center justify-between">
                            <h2 className={cn(typography.h3, textColors.primary)}>Детали задачи</h2>
                            <button
                                onClick={onClose}
                                className={cn(textColors.muted, "hover:" + textColors.primary, "p-1")}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Содержимое */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedTask.status === "completed" && selectedTask.results ? (
                            <AnalysisResultsCard
                                results={selectedTask}
                                onRefresh={selectedTask.status !== "completed" ? () => refreshTask(selectedTask.id) : undefined}
                                isRefreshing={false}
                            />
                        ) : (
                            <div className={`p-${spacing.lg}`}>
                                <div className={cn("flex flex-col items-center justify-center", `py-${spacing.xl}`)}>
                                    {selectedTask.status === "processing" ? (
                                        <>
                                            <RefreshCw className={cn(textColors.accent, "h-12 w-12 animate-spin mb-4")} />
                                            <h3 className={cn(typography.h3, "mb-2")}>Анализ выполняется</h3>
                                            <p className={cn(createTextStyle("small", "secondary"), "mb-4 text-center")}>
                                                Задача выполняется. Результаты будут доступны после завершения анализа.
                                            </p>
                                            <Button
                                                onClick={() => refreshTask(selectedTask.id)}
                                                className={createButtonStyle("secondary")}
                                            >
                                                <RefreshCw size={16} className="mr-2" />
                                                Проверить статус
                                            </Button>
                                        </>
                                    ) : selectedTask.status === "failed" ? (
                                        <>
                                            <XCircle className={cn(textColors.error, "h-12 w-12 mb-4")} />
                                            <h3 className={cn(typography.h3, "mb-2")}>Ошибка выполнения</h3>
                                            <p className={cn(createTextStyle("small", "secondary"), "mb-4 text-center")}>
                                                &quot;Произошла ошибка при выполнении анализа&quot;
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Clock className={cn(textColors.warning, "h-12 w-12 mb-4")} />
                                            <h3 className={cn(typography.h3, "mb-2")}>Задача в очереди</h3>
                                            <p className={cn(createTextStyle("small", "secondary"), "mb-4 text-center")}>
                                                Задача ожидает выполнения. Результаты появятся после завершения анализа.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Действия для ActionSheet
    const getTaskActions = (task: AnalysisTaskBasic | null) => {
        if (!task) return [];

        const actions = [
            {
                icon: RefreshCw,
                title: "Обновить статус",
                subtitle: "Проверить текущий статус задачи",
                onPress: () => refreshTask(task.id),
                color: "bg-blue-500/20",
                iconColor: textColors.accent,
                disabled: false,
            }
        ];

        return actions;
    };

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
                            disabled={isLoading}
                            className={createButtonStyle("secondary")}
                        >
                            {isLoading ? (
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
                            value={isLoading ? "—" : tasks.length}
                            icon={<BarChart3 size={15} className={textColors.accent} />}
                            loading={isLoading}
                        />
                        <StatsCard
                            title="Завершено"
                            value={isLoading ? "—" : tasks.filter(t => t.status === "completed").length}
                            icon={<CheckCircle size={15} className={textColors.success} />}
                            loading={isLoading}
                        />
                        <StatsCard
                            title="В процессе"
                            value={isLoading ? "—" : tasks.filter(t => t.status === "processing").length}
                            icon={<RefreshCw size={15} className={textColors.accent} />}
                            loading={isLoading}
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
                    {isLoading ? (
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
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Модальное окно с деталями */}
            <TaskDetailsModal
                isOpen={showTaskDetails}
                onClose={() => setShowTaskDetails(false)}
            />

            {/* ActionSheet для действий с задачей */}
            <MobileActionSheet
                isOpen={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                actions={getTaskActions(selectedTaskForActions)}
            />
        </div>
    );
};

export default AnalysisTasksPage;
