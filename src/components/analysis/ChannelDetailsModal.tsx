import { animations, createCardStyle, createTextStyle, spacing, textColors, typography } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { ChannelResult } from "@/types/analysis";
import { AlertCircle, CheckCircle, ExternalLink, XCircle } from "lucide-react";

export interface ChannelDetailsModalProps {
    isOpen: boolean;
    selectedChannel: ChannelResult | null;
    onClose: () => void;
}

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
                <div className={cn("sticky top-0", createCardStyle(), `p-${spacing.md}`, "border-b border-slate-700/50")}>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className={cn(typography.h3, textColors.primary)}>Детали канала</h2>
                        <button
                            onClick={onClose}
                            className={cn(textColors.muted, "hover:" + textColors.primary, "p-1")}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={cn(
                        "flex items-center px-3 py-1 rounded-full text-sm border inline-flex",
                        statusConfig.bg, statusConfig.border, statusConfig.color
                    )}>
                        <StatusIcon size={14} className="mr-1" />
                        {statusConfig.text}
                    </div>
                </div>

                {/* Содержимое */}
                <div className={cn(`p-${spacing.md}`, `space-y-${spacing.md}`)}>
                    {/* Информация о канале */}
                    <div>
                        <h3 className={cn(typography.weight.medium, textColors.primary, "mb-2")}>@{selectedChannel.channel_username}</h3>
                        {selectedChannel.description && (
                            <p className={cn(createTextStyle("small", "muted"), "leading-relaxed")}>
                                {selectedChannel.description}
                            </p>
                        )}
                    </div>

                    {/* Результаты фильтров */}
                    <div>
                        <h4 className={cn(typography.weight.medium, textColors.accent, "mb-3")}>Результаты фильтрации</h4>
                        <div className={`space-y-${spacing.sm}`}>
                            {selectedChannel.filter_results.map((filter, index) => (
                                <div key={index} className={cn("bg-slate-900/50 rounded-lg", `p-${spacing.sm}`)}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={cn(typography.weight.medium, textColors.primary, createTextStyle("small", "primary"))}>{filter.filter_name}</span>
                                        <div className={cn("flex items-center", `space-x-${spacing.sm}`)}>
                                            <span className={cn(typography.weight.bold, getScoreColor(filter.score))}>
                                                {filter.score.toFixed(1)}
                                            </span>
                                            {filter.passed ? (
                                                <CheckCircle size={16} className={textColors.success} />
                                            ) : (
                                                <XCircle size={16} className={textColors.error} />
                                            )}
                                        </div>
                                    </div>
                                    <p className={cn(createTextStyle("tiny", "muted"), "mb-2")}>{filter.explanation}</p>

                                    {/* Проблемные посты */}
                                    {filter.problematic_posts.length > 0 && (
                                        <div className="mt-2">
                                            <div className={cn(createTextStyle("tiny", "error"), typography.weight.medium, "mb-1")}>Проблемные посты:</div>
                                            {filter.problematic_posts.map((post, postIndex) => (
                                                <div key={postIndex} className={cn("bg-red-500/10 border border-red-500/20 rounded", `p-${spacing.sm}`, "mb-1")}>
                                                    <div className={cn(createTextStyle("tiny", "error"), "mb-1")}>{post.issue}</div>
                                                    <a
                                                        href={post.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={cn(createTextStyle("tiny", "accent"), "hover:text-blue-300 flex items-center")}
                                                    >
                                                        Открыть пост
                                                        <ExternalLink size={10} className="ml-1" />
                                                    </a>
                                                </div>
                                            ))}
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
