import { animations, createCardStyle, createTextStyle, spacing, textColors, typography } from "@/lib/design-system";
import { cn } from "@/lib/cn";
import { ChannelResult } from "@/analysis/types";
import { AlertCircle, CheckCircle, ExternalLink, XCircle, Star, Info, AlertTriangle, List, MessageSquare } from "lucide-react";

function getStatusConfig(status: string) {
    switch (status) {
        case "approved":
            return {
                icon: CheckCircle,
                text: "Подходит",
                color: textColors.success,
                bg: "bg-green-500/10",
                border: "border-green-500/20"
            };
        case "rejected":
            return {
                icon: XCircle,
                text: "Не подходит",
                color: textColors.error,
                bg: "bg-red-500/10",
                border: "border-red-500/20"
            };
        default:
            return {
                icon: AlertCircle,
                text: "Неизвестно",
                color: textColors.warning,
                bg: "bg-amber-500/10",
                border: "border-amber-500/20"
            };
    }
}

function getScoreColor(score: number) {
    if (score >= 8) return textColors.success;
    if (score >= 6) return textColors.accent;
    if (score >= 4) return textColors.warning;
    return textColors.error;
}

function getScoreBlockColor(score: number) {
    if (score >= 4.5) return "bg-green-500/10 border-green-500/30 text-green-400";
    if (score >= 3.0) return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    return "bg-red-500/10 border-red-500/30 text-red-400";
}

export interface ChannelDetailsModalProps {
    isOpen: boolean;
    selectedChannel: ChannelResult | null;
    onClose: () => void;
}

export default function ChannelDetailsModal({ isOpen, selectedChannel, onClose }: ChannelDetailsModalProps) {
    if (!isOpen || !selectedChannel) return null;

    const statusConfig = getStatusConfig(selectedChannel.overall_status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/50 z-50 flex items-center justify-center p-4 pb-20">
            <div className={cn(
                createCardStyle(),
                "rounded-2xl",
                "w-full max-w-md max-h-[80vh] overflow-y-auto",
                animations.slideIn
            )}>
                {/* Заголовок */}
                <div className={cn(
                    "sticky top-0 z-10",
                    createCardStyle(),
                    `p-${spacing.md}`,
                    "border-b border-slate-700/50",
                    "bg-slate-900"
                )}>
                    <div className="flex items-center justify-between mb-2" style={{ minHeight: 32 }}>
                        <h2 className={cn(typography.h3, textColors.primary)}>Детали канала</h2>
                        <button
                            onClick={onClose}
                            className={cn(
                                "flex items-center justify-center",
                                textColors.muted,
                                "hover:" + textColors.primary,
                                "p-1"
                            )}
                            aria-label="Закрыть"
                            style={{ height: 32, width: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <XCircle size={22} />
                        </button>
                    </div>
                </div>

                {/* Содержимое */}
                <div className={cn(`p-${spacing.md}`, `space-y-${spacing.md}`)}>
                    {/* Блок: Общая оценка и вердикт */}
                    <div className="flex items-center gap-4 h-full" style={{ minHeight: 90 }}>
                        <div className={cn(
                            "flex flex-col items-center justify-center rounded-xl border px-4 py-2 min-w-[90px]",
                            getScoreBlockColor(selectedChannel.filter_results[0].score)
                        )}>
                            <Star size={22} className="mb-1" />
                            <span className={cn(typography.h2, "font-bold")}>{selectedChannel.filter_results[0].score.toFixed(1)}</span>
                            <span className="text-xs opacity-70 mt-1 whitespace-nowrap">Оценка</span>
                        </div>
                        <div className={cn(
                            "flex-1 flex flex-col gap-2 justify-center"
                        )}>
                            <div className={cn(
                                "flex items-center px-3 py-2 rounded-lg border",
                                statusConfig.bg, statusConfig.border, statusConfig.color, "gap-2"
                            )}>
                                <StatusIcon size={18} />
                                <span className={cn(typography.weight.medium)}>{statusConfig.text}</span>
                            </div>
                            {/* Никнейм под вердиктом */}
                            <div
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700/20 bg-slate-800/50 mt-1"
                                style={{ minHeight: 36 }}
                            >
                                <Info size={18} className="text-slate-400" />
                                <a
                                    href={`https://t.me/${selectedChannel.channel_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        typography.weight.medium,
                                        textColors.primary,
                                        "underline hover:underline"
                                    )}
                                >
                                    @{selectedChannel.channel_username}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Блок: Результаты фильтрации */}
                    <div className="bg-slate-800/50 rounded-lg border border-slate-700/20">
                        <div className="flex items-center gap-2 mb-3 px-4 pt-4">
                            <List size={16} className={textColors.accent} />
                            <h4 className={cn(typography.weight.medium, textColors.accent)}>Результаты фильтрации</h4>
                        </div>
                        <div className={cn(`space-y-${spacing.sm}`, "px-4 pb-4")}>
                            {selectedChannel.filter_results.map((filter, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "rounded-lg border border-slate-700/20 bg-transparent w-full"
                                    )}
                                    style={{ minWidth: 0 }}
                                >
                                    {/* Оставить только анализ и проблемные посты */}
                                    <div className="mb-2">
                                        <div className={cn(createTextStyle("body", "muted"), "mt-1", "w-full")}>
                                            {filter.explanation}
                                        </div>
                                    </div>
                                    {/* Проблемные посты */}
                                    {filter.problematic_posts.length > 0 && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-1 mb-2">
                                                <AlertTriangle size={14} className={textColors.error} />
                                                <span className={cn(createTextStyle("body", "error"), typography.weight.medium)}>
                                                    Проблемные посты:
                                                </span>
                                            </div>
                                            <ul className="space-y-2">
                                                {filter.problematic_posts.map((post, postIndex) => (
                                                    <li key={postIndex}>
                                                        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded w-full px-4 py-3">
                                                            <span className="font-bold text-xs text-red-400 mt-0.5 min-w-[70px]">
                                                                Пост {post.post_id ?? postIndex + 1}:
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className={cn(createTextStyle("body", "error"), "mb-1 w-full")}>
                                                                    {post.issue}
                                                                </div>
                                                                <a
                                                                    href={post.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={cn(createTextStyle("tiny", "accent"), "hover:text-blue-300 flex items-center gap-1")}
                                                                >
                                                                    Открыть пост
                                                                    <ExternalLink size={10} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
