import { BarChart3, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { createCardStyle, createTextStyle, spacing, textColors, typography } from "@/lib/design-system";
import { ChannelResult } from "@/types/analysis";

export interface MobileActionSheetProps {
    isOpen: boolean;
    selectedChannel: ChannelResult;
    onClose: () => void;
}

function getChannelActions(channel: ChannelResult | null) {
    if (!channel) return [];

    return [
        {
            icon: BarChart3,
            title: "Детальная аналитика",
            subtitle: "Посмотреть подробную статистику",
            onPress: () => {
                console.log("View analytics for", channel!.channel_id);
            },
            color: "bg-blue-500/20",
            iconColor: textColors.accent,
            disabled: false,
        },
        {
            icon: Download,
            title: "Экспорт данных канала",
            subtitle: "Скачать данные о канале",
            onPress: () => {
                console.log("Export channel data", channel!.channel_id);
            },
            color: "bg-purple-500/20",
            iconColor: "text-purple-400",
            disabled: false,
        }
    ];
}

export default function MobileActionSheet({ isOpen, selectedChannel, onClose }: MobileActionSheetProps) {
    if (!isOpen) {
        return (<></>);
    }

    const actions = getChannelActions(selectedChannel);

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
                    <h3 className={cn(typography.weight.semibold, textColors.primary)}>Действия</h3>
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
}
