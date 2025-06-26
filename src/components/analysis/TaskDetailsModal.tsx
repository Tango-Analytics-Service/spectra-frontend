import { cn } from "@/lib/utils";
import { animations, createButtonStyle, createCardStyle, createTextStyle, spacing, textColors, typography } from "@/lib/design-system";
import AnalysisResultsCard from "./AnalysisResultsCard";
import { Clock, RefreshCw, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { AnalysisTask } from "@/types/analysis";

export interface TaskDetailsModalProps {
    selectedTask: AnalysisTask | undefined
    isOpen: boolean;
    onClose: () => void;
    refresh: (id: string) => void;
}

/// Модальное окно с деталями задачи
export default function TaskDetailsModal({ selectedTask, isOpen, onClose, refresh }: TaskDetailsModalProps) {
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
                            onRefresh={selectedTask.status !== "completed" ? () => refresh(selectedTask.id) : undefined}
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
                                            onClick={() => refresh(selectedTask.id)}
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
