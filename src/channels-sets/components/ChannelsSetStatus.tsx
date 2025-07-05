import { CheckCircle, Clock, Plus, AlertTriangle, Loader2, XCircle, Square, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { createTextStyle, textColors } from "@/lib/design-system";
import { SmartSetBuildStatus } from "@/channels-sets/types";

// Максимальное количество каналов в наборе
const MAX_CHANNELS_PER_SET = 20;

export interface ChannelSetStatusProps {
    channelCount: number;
    allParsed: boolean;
    buildStatus?: SmartSetBuildStatus;
    className?: string;
}

export default function ChannelSetStatus({
    channelCount,
    allParsed,
    buildStatus,
    className,
}: ChannelSetStatusProps) {
    // Определяем статус набора
    const getStatus = () => {
        // Приоритет для статуса умного набора
        if (buildStatus) {
            switch (buildStatus) {
                case "building":
                    return {
                        type: "smart-building" as const,
                        label: "Построение",
                        icon: Loader2,
                        color: textColors.accent,
                        animate: true,
                    };
                case "completed":
                    // Если построение завершено, показываем обычный статус
                    break;
                case "failed":
                    return {
                        type: "smart-failed" as const,
                        label: "Ошибка построения",
                        icon: XCircle,
                        color: textColors.error,
                    };
                case "cancelled":
                    return {
                        type: "smart-cancelled" as const,
                        label: "Построение отменено",
                        icon: Square,
                        color: textColors.warning,
                    };
                case "pending":
                    return {
                        type: "smart-pending" as const,
                        label: "Ожидание построения",
                        icon: Clock,
                        color: textColors.muted,
                    };
            }
        }

        // Обычная логика для обычных наборов или завершенных умных наборов
        if (channelCount === 0) {
            return {
                type: "empty" as const,
                label: "Пустой набор",
                icon: Plus,
                color: textColors.muted,
            };
        }

        if (channelCount >= MAX_CHANNELS_PER_SET) {
            return {
                type: "full" as const,
                label: `Набор заполнен (${channelCount}/${MAX_CHANNELS_PER_SET})`,
                icon: AlertTriangle,
                color: textColors.warning,
            };
        }

        if (!allParsed) {
            return {
                type: "processing" as const,
                label: "Обработка данных",
                icon: Clock,
                color: textColors.warning,
            };
        }

        return {
            type: "ready" as const,
            label: `Готов к анализу (${channelCount}/${MAX_CHANNELS_PER_SET})`,
            icon: CheckCircle,
            color: textColors.success,
        };
    };

    const status = getStatus();
    const IconComponent = status.icon;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <IconComponent
                size={12}
                className={cn(
                    status.color,
                    status.animate && "animate-spin"
                )}
            />
            <span className={cn(createTextStyle("tiny", "muted"))}>
                {status.label}
            </span>
        </div>
    );
}
