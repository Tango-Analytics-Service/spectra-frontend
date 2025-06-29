// src/components/channel-sets/ChannelSetStatus.tsx
import React from "react";
import {
  CheckCircle,
  Clock,
  Plus,
  AlertTriangle,
  Loader2,
  Brain,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createTextStyle, textColors } from "@/lib/design-system";
import { ChannelSetType, SmartSetBuildStatus } from "@/types/channel-sets";

// Максимальное количество каналов в наборе
const MAX_CHANNELS_PER_SET = 20;

interface ChannelSetStatusProps {
  channelCount: number;
  allParsed: boolean;
  channelSetType?: ChannelSetType;
  buildStatus?: SmartSetBuildStatus;
  className?: string;
}

const ChannelSetStatus: React.FC<ChannelSetStatusProps> = ({
  channelCount,
  allParsed,
  channelSetType = "manual",
  buildStatus,
  className,
}) => {
  // Определяем статус набора
  const getStatus = () => {
    // For smart sets, show build status first
    if (channelSetType === "smart" && buildStatus) {
      switch (buildStatus) {
        case "building":
          return {
            type: "building" as const,
            label: "Строится",
            icon: Loader2,
            color: textColors.accent,
            animate: true,
          };
        case "completed":
          return {
            type: "smart_ready" as const,
            label: `Умный набор готов (${channelCount}/${MAX_CHANNELS_PER_SET})`,
            icon: Brain,
            color: textColors.success,
          };
        case "failed":
          return {
            type: "smart_failed" as const,
            label: "Ошибка построения",
            icon: XCircle,
            color: textColors.error,
          };
        case "cancelled":
          return {
            type: "smart_cancelled" as const,
            label: "Построение отменено",
            icon: XCircle,
            color: textColors.warning,
          };
      }
    }

    // Standard statuses for manual sets or smart sets without build status
    if (channelCount === 0) {
      return {
        type: "empty" as const,
        label: channelSetType === "smart" ? "Умный набор" : "Пустой набор",
        icon: channelSetType === "smart" ? Brain : Plus,
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
        className={cn(status.color, status.animate && "animate-spin")}
      />
      <span className={cn(createTextStyle("tiny", "muted"))}>
        {status.label}
      </span>
    </div>
  );
};

export default ChannelSetStatus;
