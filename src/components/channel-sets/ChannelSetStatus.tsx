// src/components/channel-sets/ChannelSetStatus.tsx
import React from "react";
import { CheckCircle, Clock, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTextStyle, textColors } from "@/lib/design-system";

// Максимальное количество каналов в наборе
const MAX_CHANNELS_PER_SET = 20;

interface ChannelSetStatusProps {
    channelCount: number;
    allParsed: boolean;
    className?: string;
}

const ChannelSetStatus: React.FC<ChannelSetStatusProps> = ({
    channelCount,
    allParsed,
    className,
}) => {
    // Определяем статус набора
    const getStatus = () => {
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
            <IconComponent size={12} className={status.color} />
            <span className={cn(createTextStyle("tiny", "muted"))}>
                {status.label}
            </span>
        </div>
    );
};

export default ChannelSetStatus;
