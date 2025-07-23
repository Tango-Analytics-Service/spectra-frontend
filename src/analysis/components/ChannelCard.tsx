import { AlertCircle, CheckCircle, Eye, XCircle } from "lucide-react";
import { ChannelResult } from "@/analysis/types";
import { cn } from "@/lib/cn";
import { createCardStyle, createTextStyle, spacing, textColors, typography } from "@/lib/design-system";

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
};

function truncateText(text: string, maxLength = 80) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

export interface ChannelCardProps {
    channel: ChannelResult;
    onChannelClick: () => void;
}

export default function ChannelCard({ channel, onChannelClick }: ChannelCardProps) {
    const statusConfig = getStatusConfig(channel.overall_status);
    const StatusIcon = statusConfig.icon;
    const passedFilters = channel.filter_results.filter(f => f.passed).length;
    const totalFilters = channel.filter_results.length;
    const passRate = Math.round((passedFilters / totalFilters) * 100);

    return (
        <button
            className={cn(
                "w-full",
                createCardStyle(),
                `p-${spacing.md}`,
                "transition-all duration-200 active:scale-[0.98]",
                statusConfig.border,
                "hover:bg-slate-800/70 hover:border-opacity-40",
                "cursor-pointer"
            )}
            onClick={onChannelClick}
        >
            {/* Верхняя строка: никнейм и статус справа */}
            <div className="flex items-center justify-between mb-1">
                {/* Никнейм слева */}
                <h3
                    className={cn(
                        typography.weight.medium,
                        textColors.primary,
                        "text-left truncate"
                    )}
                    style={{ maxWidth: 180 }}
                >
                    @{channel.channel_username}
                </h3>
                {/* Статус справа */}
                <div className={cn(
                    "flex items-center px-2 py-1 rounded-full text-xs border whitespace-nowrap",
                    statusConfig.bg, statusConfig.border, statusConfig.color
                )}>
                    <StatusIcon size={12} className="mr-1" />
                    {statusConfig.text}
                </div>
            </div>

            {/* Описание и детали */}
            <div className="flex items-start justify-between">
                {/* Описание слева */}
                <div className="flex-1 min-w-0 text-left">
                    <p
                        className={cn(createTextStyle("small", "muted"), "leading-relaxed")}
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3, // ← увеличено до 3 строк
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                        }}
                    >
                        {truncateText(channel.filter_results[0].explanation, 120)} {/* ← увеличен лимит */}
                    </p>
                </div>
                {/* Детали справа, под статусом */}
                {/* <div className="flex flex-col items-end ml-3">
                    <div className="flex items-center gap-1 mt-1">
                        <Eye size={16} className={textColors.accent} />
                        <span className={cn("text-xs", textColors.accent)}>Детали</span>
                    </div>
                </div> */}
            </div>
        </button>
    );
};
