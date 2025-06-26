import { createBadgeStyle, createCardStyle, createTextStyle, spacing, textColors, typography } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { AnalysisTask, AnalysisTaskBasic } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";

export interface TaskCardProps {
    task: AnalysisTaskBasic;
    details: AnalysisTask;
    onTaskPress: () => void;
}

// Получение иконки статуса
function getStatusIcon(status: string) {
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
}

// Получение текста статуса
function getStatusText(status: string) {
    switch (status) {
        case "completed": return "Завершен";
        case "failed": return "Ошибка";
        case "processing": return "Выполняется";
        default: return "Ожидание";
    }
}

// Получение варианта статуса
function getStatusVariant(status: string): "success" | "error" | "primary" | "warning" {
    switch (status) {
        case "completed": return "success";
        case "failed": return "error";
        case "processing": return "primary";
        default: return "warning";
    }
}

// Форматирование даты
function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Только что";
    if (diffHours < 24) return `${diffHours}ч назад`;
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

/// Компонент карточки задачи
export default function TaskCard({ task, details, onTaskPress }: TaskCardProps) {

    const successRate = details?.summary
        ? Math.round((details.summary.approved_channels / details.summary.total_channels) * 100)
        : null;

    return (
        <button
            className={cn(
                createCardStyle(),
                `p-${spacing.md}`,
                "transition-all duration-200 active:scale-[0.98]",
                "hover:border-blue-500/30 hover:bg-slate-800/70",
                "cursor-pointer"
            )}
            onClick={onTaskPress}
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
