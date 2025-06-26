// src/components/analysis/AnalysisResultsCard.tsx - улучшенная версия с design-system
import { useState } from "react";
import { AnalysisTask, ChannelResult } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, RefreshCw, Filter, } from "lucide-react";
import { cn } from "@/lib/utils";
import { createCardStyle, createButtonStyle, createTextStyle, typography, spacing, animations, textColors, } from "@/lib/design-system";
import ChannelCard from "./ChannelCard";
import ChannelDetailsModal from "./ChannelDetailsModal";
import MobileActionSheet from "./MobileActionSheet";
import StatusBadge from "./StatusBadge";

interface AnalysisResultsCardProps {
    results: AnalysisTask;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

function formatDate(dateString?: string) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AnalysisResultsCard({ results, onRefresh, isRefreshing = false }: AnalysisResultsCardProps) {
    const {
        summary,
        results: channelResults,
        status,
        created_at,
        completed_at,
    } = results;

    // UI состояния
    const [selectedChannel, setSelectedChannel] = useState<ChannelResult | null>(null);
    const [showChannelDetails, setShowChannelDetails] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [selectedChannelForActions] = useState<ChannelResult | null>(null);
    const [viewMode, setViewMode] = useState<"all" | "approved" | "rejected">("approved");

    if (!summary || !channelResults) {
        return (
            <Card className={cn(createCardStyle(), "overflow-hidden", animations.fadeIn)}>
                <CardContent className={`p-${spacing.lg}`}>
                    <div className={cn("flex flex-col items-center justify-center", `py-${spacing.xl}`)}>
                        <AlertCircle className={cn("h-12 w-12 mb-4", textColors.muted)} />
                        <h3 className={cn(typography.h3, "mb-2")}>Нет результатов</h3>
                        <p className={createTextStyle("small", "secondary")}>
                            Результаты анализа недоступны
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Вычисление процента одобрения
    const approvalRate = summary && summary.total_channels > 0
        ? Math.round((summary.approved_channels / summary.total_channels) * 100)
        : 0;

    // Фильтрация каналов по статусу
    const filteredChannels = channelResults?.filter(channel => {
        if (viewMode === "approved") return channel.overall_status === "approved";
        if (viewMode === "rejected") return channel.overall_status === "rejected";
        return true;
    }) || [];

    const onChannelClick = (channel: ChannelResult) => {
        setSelectedChannel(channel);
        setShowChannelDetails(true);
    };

    const viewFiters = [
        { value: "all", label: "Все", count: summary.total_channels },
        { value: "approved", label: "Подходящие", count: summary.approved_channels },
        { value: "rejected", label: "Отклоненные", count: summary.rejected_channels },
    ] satisfies { value: "all" | "approved" | "rejected", label: string, count: number }[];

    return (
        <Card className={cn(createCardStyle(), "overflow-hidden", animations.fadeIn)}>
            <CardHeader className={cn("bg-slate-800/70", `pb-${spacing.sm}`)}>
                <div className="flex justify-between items-center">
                    <CardTitle className={typography.h3}>Результаты анализа</CardTitle>
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isRefreshing || status === "completed"}
                            className={createButtonStyle("secondary")}
                        >
                            {isRefreshing ? (
                                <RefreshCw size={16} className="mr-1 animate-spin" />
                            ) : (
                                <RefreshCw size={16} className="mr-1" />
                            )}
                            Обновить
                        </Button>
                    )}
                </div>

                {/* Status badge */}
                <div className="flex items-center mt-1">
                    <StatusBadge status={status || "pending"} />
                    <div className={cn("ml-4", createTextStyle("small", "secondary"))}>
                        {created_at && <div>Начат: {formatDate(created_at)}</div>}
                        {completed_at && <div>Завершен: {formatDate(completed_at)}</div>}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {/* Статистика */}
                <div className={cn(`p-${spacing.md}`, "border-b border-slate-700/50")}>
                    <div className={cn("grid grid-cols-3", `gap-${spacing.sm} mb-${spacing.md}`)}>
                        <div className="text-center">
                            <div className={cn("text-2xl font-bold", textColors.primary)}>{summary.total_channels}</div>
                            <div className={createTextStyle("tiny", "accent")}>Всего</div>
                        </div>
                        <div className="text-center">
                            <div className={cn("text-2xl font-bold", textColors.success)}>{summary.approved_channels}</div>
                            <div className={createTextStyle("tiny", "success")}>Подходят</div>
                        </div>
                        <div className="text-center">
                            <div className={cn("text-2xl font-bold", textColors.error)}>{summary.rejected_channels}</div>
                            <div className={createTextStyle("tiny", "error")}>Отклонены</div>
                        </div>
                    </div>

                    <div className={`mt-${spacing.md}`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className={cn(typography.small, textColors.accent)}>
                                Процент соответствия критериям
                            </span>
                            <span className={cn(typography.small, typography.weight.medium)}>
                                {approvalRate}%
                            </span>
                        </div>
                        <Progress value={approvalRate} className="h-2" />
                    </div>
                </div>

                {/* Фильтры просмотра */}
                <div className={cn(`p-${spacing.md}`, "border-b border-slate-700/50")}>
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                        <div className="flex gap-2 min-w-max">
                            {viewFiters.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setViewMode(filter.value)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all flex items-center space-x-1 flex-shrink-0",
                                        viewMode === filter.value
                                            ? "bg-blue-500 text-white"
                                            : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
                                    )}
                                >
                                    <span>{filter.label}</span>
                                    <span className="text-xs opacity-75">({filter.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Список каналов */}
                <ScrollArea className="h-[400px]">
                    <div className={`p-${spacing.md}`}>
                        {filteredChannels.length === 0 ? (
                            <div className={cn("text-center", `py-${spacing.xl}`)}>
                                <Filter className={cn("mx-auto h-12 w-12 mb-3", textColors.muted)} />
                                <p className={createTextStyle("small", "muted")}>
                                    Нет каналов в выбранной категории
                                </p>
                            </div>
                        ) : (
                            <div className={`space-y-${spacing.sm}`}>
                                {filteredChannels.map((channel, index) => (
                                    <ChannelCard key={`${channel!.channel_id}-${index}`} channel={channel} onChannelClick={() => onChannelClick(channel)} />
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>

            {/* Модальное окно с деталями канала */}
            <ChannelDetailsModal
                isOpen={showChannelDetails}
                selectedChannel={selectedChannel}
                onClose={() => setShowChannelDetails(false)}
            />

            {/* ActionSheet для действий с каналом */}
            <MobileActionSheet
                isOpen={showActionSheet}
                selectedChannel={selectedChannelForActions}
                onClose={() => setShowActionSheet(false)}
            />
        </Card>
    );
};
