import { ArrowRight, Users, Zap, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/ui/components/button";
import { Badge } from "@/ui/components/badge";
import { Progress } from "@/ui/components/progress";
import { cn } from "@/lib/cn";
import { createCardStyle, createButtonStyle, createBadgeStyle, createTextStyle, typography, spacing, textColors, animations } from "@/lib/design-system";
import { ChannelsSet } from "@/channels-sets/types";
import ChannelsSetStatus from "./ChannelsSetStatus";

export interface ChannelSetCardProps {
    channelSet: ChannelsSet;
    onAnalyze: (setId: string) => void;
    onViewDetails: (setId: string) => void;
    onAddChannels: (setId: string) => void;
    className?: string;
}

export default function ChannelSetCard({ channelSet, onViewDetails, className }: ChannelSetCardProps) {
    // Определяем, является ли это умным набором
    const isSmartSet = !!channelSet.build_criteria;
    
    // Получаем прогресс для умного набора
    const getSmartSetProgress = () => {
        if (!isSmartSet || !channelSet.build_progress) return null;
        
        const { build_progress, build_status } = channelSet;
        const progressPercentage = Math.round(
            (build_progress.channels_accepted / build_progress.target_count) * 100
        );
        
        return {
            percentage: progressPercentage,
            status: build_status,
            current: build_progress.channels_accepted,
            target: build_progress.target_count,
        };
    };

    const smartProgress = getSmartSetProgress();

    // Определяем доступные действия в зависимости от статуса
    const actions = {
        primary: {
            label: "Детали",
            action: () => onViewDetails(channelSet.id),
            variant: "secondary" as const,
            icon: ArrowRight,
        },
        secondary: null,
    };

    return (
        <div
            className={cn(
                createCardStyle(),
                `p-${spacing.md}`,
                animations.fadeIn,
                className,
                // Особая подсветка для умных наборов
                isSmartSet && "border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-transparent",
            )}
        >
            <div className="relative z-10">
                {/* Заголовок и статус */}
                <div className={`mb-${spacing.sm}`}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className={cn(typography.h4, textColors.primary, "flex items-center gap-2")}>
                            {isSmartSet && <Zap size={16} className="text-yellow-400" />}
                            {channelSet.name}
                        </h3>
                        
                        {/* Бейдж типа набора */}
                        {isSmartSet && (
                            <Badge className={cn(
                                createBadgeStyle("warning"),
                                "text-xs border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                            )}>
                                Умный набор
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Users size={12} className={textColors.muted} />
                                <span className={createTextStyle("tiny", "muted")}>
                                    {channelSet.channel_count} каналов
                                </span>
                            </div>
                        </div>

                        <ChannelsSetStatus
                            channelCount={channelSet.channel_count}
                            allParsed={channelSet.all_parsed}
                            buildStatus={channelSet.build_status}
                        />
                    </div>
                </div>

                {/* Прогресс для умного набора */}
                {isSmartSet && smartProgress && channelSet.build_status === "building" && (
                    <div className={cn(`mb-${spacing.sm}`, "space-y-2")}>
                        <div className="flex justify-between items-center">
                            <span className={createTextStyle("tiny", "muted")}>
                                Построение: {smartProgress.current} / {smartProgress.target}
                            </span>
                            <span className={cn(createTextStyle("tiny", "accent"), typography.weight.medium)}>
                                {smartProgress.percentage}%
                            </span>
                        </div>
                        <Progress value={smartProgress.percentage} className="h-1.5" />
                    </div>
                )}

                {/* Статус умного набора */}
                {isSmartSet && channelSet.build_status && channelSet.build_status !== "building" && (
                    <div className={cn(`mb-${spacing.sm}`)}>
                        {channelSet.build_status === "completed" && (
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                                <CheckCircle size={14} />
                                <span>Построение завершено</span>
                            </div>
                        )}
                        {channelSet.build_status === "failed" && (
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <Clock size={14} />
                                <span>Ошибка построения</span>
                            </div>
                        )}
                        {channelSet.build_status === "cancelled" && (
                            <div className="flex items-center gap-2 text-amber-400 text-sm">
                                <Clock size={14} />
                                <span>Построение отменено</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Описание */}
                {channelSet.description && (
                    <p
                        className={cn(
                            createTextStyle("small", "muted"),
                            `mb-${spacing.md}`,
                            "line-clamp-2",
                        )}
                    >
                        {channelSet.description}
                    </p>
                )}

                {/* Критерии для умного набора */}
                {isSmartSet && channelSet.build_criteria && (
                    <div className={cn(
                        createCardStyle(),
                        "bg-slate-900/30 border-slate-700/30",
                        `p-${spacing.sm} mb-${spacing.md}`,
                    )}>
                        <div className={createTextStyle("tiny", "muted")}>
                            <div className="font-medium mb-1">Критерии построения:</div>
                            <div className="space-y-1">
                                <div>• Фильтров: {channelSet.build_criteria.filter_ids.length}</div>
                                <div>• Цель: {channelSet.build_criteria.target_count} каналов</div>
                                <div>• Порог: {Math.round(channelSet.build_criteria.acceptance_threshold * 100)}%</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Действия */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={actions.primary.action}
                        className={cn(createButtonStyle(actions.primary.variant), "flex-1")}
                    >
                        {actions.primary.icon && (
                            <actions.primary.icon size={16} className={`mr-${spacing.sm}`} />
                        )}
                        {actions.primary.label}
                    </Button>

                    {actions.secondary && (
                        <Button
                            onClick={actions.secondary.action}
                            variant="ghost"
                            size="sm"
                            className={createButtonStyle("ghost")}
                        >
                            {actions.secondary.icon && <actions.secondary.icon size={16} />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}