// src/components/channel-sets/ChannelSetStatus.tsx
import React from "react";
import { CheckCircle, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTextStyle, textColors } from "@/lib/design-system";

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
      label: "Готов к анализу",
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