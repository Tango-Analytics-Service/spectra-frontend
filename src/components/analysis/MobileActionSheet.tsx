import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createCardStyle, createTextStyle, spacing, textColors, typography } from "@/lib/design-system";

export interface MobileActionSheetProps {
    isOpen: boolean;
    actions: {
        icon: React.ElementType;
        title: string;
        subtitle: string;
        onPress: () => void;
        color: string;
        iconColor: string;
        disabled: boolean;
    }[];
    onClose: () => void;
}

export default function MobileActionSheet({ isOpen, actions = [], onClose }: MobileActionSheetProps) {
    if (!isOpen) {
        return null;
    }

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
