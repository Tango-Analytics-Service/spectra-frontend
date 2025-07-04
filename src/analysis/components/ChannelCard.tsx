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
                createCardStyle(),
                `p-${spacing.md}`,
                "transition-all duration-200 active:scale-[0.98]",
                statusConfig.border,
                "hover:bg-slate-800/70 hover:border-opacity-40",
                "cursor-pointer"
            )}
            onClick={onChannelClick}
        >
            {/* Заголовок и действия */}
            <div className={cn("flex items-center justify-between", `mb-${spacing.sm}`)}>
                <div className={cn("flex items-center", `space-x-${spacing.sm}`)}>
                    <div className={cn(
                        "flex items-center px-2 py-1 rounded-full text-xs border",
                        statusConfig.bg, statusConfig.border, statusConfig.color
                    )}>
                        <StatusIcon size={12} className="mr-1" />
                        {statusConfig.text}
                    </div>
                </div>
            </div>

            {/* Название канала */}
            <h3 className={cn(typography.weight.medium, textColors.primary, "mb-2")}>@{channel.channel_username}</h3>

            {/* Описание (обрезанное) */}
            {channel.description && (
                <p className={cn(createTextStyle("small", "muted"), "mb-3 leading-relaxed")}>
                    {truncateText(channel.description)}
                </p>
            )}

            {/* Статистика фильтров */}
            <div className="flex items-center justify-between">
                <div className={cn("flex items-center", `space-x-${spacing.sm}`)}>
                    <div className={createTextStyle("tiny", "muted")}>
                        Фильтры: <span className={cn(
                            typography.weight.medium,
                            passRate >= 70 ? textColors.success :
                                passRate >= 40 ? textColors.warning : textColors.error
                        )}>
                            {passedFilters}/{totalFilters}
                        </span>
                    </div>
                    <div className={createTextStyle("tiny", "muted")}>
                        {passRate}%
                    </div>
                </div>
                <Eye size={14} className={textColors.accent} />
            </div>
        </button>
    );
};
