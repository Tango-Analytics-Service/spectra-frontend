import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    Loader2,
    Zap,
    Users,
    Target,
    TrendingUp,
    Play,
    Square,
    RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/ui/components/button";
import { Progress } from "@/ui/components/progress";
import { Badge } from "@/ui/components/badge";
import {
    createCardStyle,
    createButtonStyle,
    createBadgeStyle,
    createTextStyle,
    typography,
    spacing,
    textColors,
    animations,
} from "@/lib/design-system";
import { ChannelsSet, SmartSetBuildStatus } from "@/channels-sets/types";
import { useCancelSmartSetBuild, useRefreshSmartSetStatus } from "../api/hooks/channels-sets";

// Get status configuration
const getStatusConfig = (status: SmartSetBuildStatus) => {
    switch (status) {
        case "building":
            return {
                icon: Loader2,
                text: "Построение",
                color: textColors.accent,
                bgColor: "bg-blue-500/10",
                borderColor: "border-blue-500/20",
                animate: true,
            };
        case "completed":
            return {
                icon: CheckCircle,
                text: "Завершено",
                color: textColors.success,
                bgColor: "bg-green-500/10",
                borderColor: "border-green-500/20",
                animate: false,
            };
        case "failed":
            return {
                icon: XCircle,
                text: "Ошибка",
                color: textColors.error,
                bgColor: "bg-red-500/10",
                borderColor: "border-red-500/20",
                animate: false,
            };
        case "cancelled":
            return {
                icon: Square,
                text: "Отменено",
                color: textColors.warning,
                bgColor: "bg-amber-500/10",
                borderColor: "border-amber-500/20",
                animate: false,
            };
        default:
            return {
                icon: Play,
                text: "Готов к запуску",
                color: textColors.muted,
                bgColor: "bg-slate-500/10",
                borderColor: "border-slate-500/20",
                animate: false,
            };
    }
};

interface SmartSetBuildProgressProps {
    channelSet: ChannelsSet;
    onRefresh?: () => void;
    className?: string;
}

export default function SmartSetBuildProgress({ channelSet, onRefresh, className }: SmartSetBuildProgressProps) {
    const cancelSmartSetBuild = useCancelSmartSetBuild(channelSet.id);
    const refreshSmartSetStatus = useRefreshSmartSetStatus(channelSet.id);

    const [isCancelling, setIsCancelling] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { build_status, build_progress } = channelSet;

    // Auto-refresh for building sets
    useEffect(() => {
        if (build_status === "building") {
            const interval = setInterval(() => {
                refreshSmartSetStatus.mutate();
            }, 5000); // Refresh every 5 seconds

            return () => clearInterval(interval);
        }
    }, [build_status, channelSet.id, refreshSmartSetStatus]);

    const handleCancel = async () => {
        if (build_status !== "building") return;
        setIsCancelling(true);
        cancelSmartSetBuild.mutate(undefined, {
            onSettled() {

                setIsCancelling(false);
            },
        });
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        refreshSmartSetStatus.mutate(undefined, {
            onSuccess() {
                onRefresh?.();
            },
            onSettled() {
                setIsRefreshing(false);
            },
        });
    };

    if (!build_status) {
        return null;
    }

    const statusConfig = getStatusConfig(build_status);
    const StatusIcon = statusConfig.icon;

    // Calculate progress percentage
    const progressPercentage = build_progress
        ? Math.round((build_progress.channels_accepted / build_progress.target_count) * 100)
        : 0;

    return (
        <div
            className={cn(
                createCardStyle(),
                statusConfig.bgColor,
                statusConfig.borderColor,
                `p-${spacing.md}`,
                className,
                animations.fadeIn,
            )}
        >
            {/* Header */}
            <div
                className={cn("flex items-center justify-between", `mb-${spacing.md}`)}
            >
                <div className="flex items-center gap-2">
                    <Zap size={16} className={textColors.accent} />
                    <h4 className={cn(typography.h4, textColors.primary)}>Умный набор</h4>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={cn(
                            createBadgeStyle("primary"),
                            "flex items-center gap-1",
                        )}
                    >
                        <StatusIcon
                            size={12}
                            className={cn(
                                statusConfig.color,
                                statusConfig.animate && "animate-spin",
                            )}
                        />
                        {statusConfig.text}
                    </Badge>

                    {/* Action buttons */}
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={createButtonStyle("ghost")}
                        >
                            <RefreshCw
                                size={14}
                                className={cn(isRefreshing && "animate-spin")}
                            />
                        </Button>

                        {build_status === "building" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className={cn(
                                    createButtonStyle("ghost"),
                                    "text-red-400 hover:text-red-300",
                                )}
                            >
                                <Square size={14} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress for building sets */}
            {build_status === "building" && build_progress && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`space-y-${spacing.md}`}
                >
                    {/* Progress bar */}
                    <div className={`space-y-${spacing.sm}`}>
                        <div className="flex justify-between items-center">
                            <span className={createTextStyle("small", "primary")}>
                                Прогресс построения
                            </span>
                            <span
                                className={cn(
                                    createTextStyle("small", "accent"),
                                    typography.weight.medium,
                                )}
                            >
                                {progressPercentage}%
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {/* Stats grid */}
                    <div
                        className={cn(
                            "grid grid-cols-2 md:grid-cols-4",
                            `gap-${spacing.sm}`,
                        )}
                    >
                        <div
                            className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}
                        >
                            <div className="flex items-center gap-1 mb-1">
                                <Users size={12} className={textColors.muted} />
                                <span className={createTextStyle("tiny", "muted")}>
                                    Найдено
                                </span>
                            </div>
                            <div
                                className={cn(typography.weight.semibold, textColors.primary)}
                            >
                                {build_progress.channels_accepted}
                            </div>
                        </div>

                        <div
                            className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}
                        >
                            <div className="flex items-center gap-1 mb-1">
                                <Target size={12} className={textColors.muted} />
                                <span className={createTextStyle("tiny", "muted")}>Цель</span>
                            </div>
                            <div
                                className={cn(typography.weight.semibold, textColors.primary)}
                            >
                                {build_progress.target_count}
                            </div>
                        </div>

                        <div
                            className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}
                        >
                            <div className="flex items-center gap-1 mb-1">
                                <TrendingUp size={12} className={textColors.muted} />
                                <span className={createTextStyle("tiny", "muted")}>Успех</span>
                            </div>
                            <div
                                className={cn(typography.weight.semibold, textColors.primary)}
                            >
                                {Math.round(build_progress.success_rate * 100)}%
                            </div>
                        </div>

                        <div
                            className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}
                        >
                            <div className="flex items-center gap-1 mb-1">
                                <Loader2 size={12} className={textColors.muted} />
                                <span className={createTextStyle("tiny", "muted")}>Батч</span>
                            </div>
                            <div
                                className={cn(typography.weight.semibold, textColors.primary)}
                            >
                                {build_progress.current_batch}
                            </div>
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className={createTextStyle("tiny", "muted")}>
                        Проанализировано каналов: {build_progress.channels_analyzed}
                    </div>
                </motion.div>
            )}

            {/* Completed state */}
            {build_status === "completed" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className={createTextStyle("small", "success")}>
                        Набор успешно построен! Найдено {channelSet.channel_count} каналов.
                    </div>
                </motion.div>
            )}

            {/* Failed state */}
            {build_status === "failed" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={createTextStyle("small", "error")}
                >
                    Произошла ошибка при построении набора. Попробуйте создать новый
                    набор.
                </motion.div>
            )}

            {/* Cancelled state */}
            {build_status === "cancelled" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={createTextStyle("small", "warning")}
                >
                    Построение набора было отменено.
                </motion.div>
            )}

            {/* Show criteria summary */}
            {channelSet.build_criteria && (
                <div className={cn("mt-4 pt-3 border-t border-slate-700/50")}>
                    <div className={createTextStyle("tiny", "muted")}>
                        <div className="mb-1">
                            <span className="font-medium">Критерии:</span>{" "}
                            {channelSet.build_criteria.filter_ids.length} фильтров, порог{" "}
                            {Math.round(channelSet.build_criteria.acceptance_threshold * 100)}
                            %
                        </div>
                        {channelSet.build_criteria.custom_prompt && (
                            <div className="italic">
                                &quot;{channelSet.build_criteria.custom_prompt}&quot;
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
