// src/components/channel-sets/ChannelSetCard.tsx
import React from "react";
import {
  ArrowRight,
  Plus,
  Users,
  Zap,
  Brain,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  createCardStyle,
  createButtonStyle,
  createBadgeStyle,
  createTextStyle,
  typography,
  spacing,
  textColors,
  animations,
} from "@/lib/design-system";
import { ChannelSet, SmartSetBuildStatus } from "@/types/channel-sets";
import ChannelSetStatus from "./ChannelSetStatus";

interface ChannelSetCardProps {
  channelSet: ChannelSet;
  onAnalyze: (setId: string) => void;
  onViewDetails: (setId: string) => void;
  onAddChannels: (setId: string) => void;
  className?: string;
}

const ChannelSetCard: React.FC<ChannelSetCardProps> = ({
  channelSet,
  onAnalyze,
  onViewDetails,
  onAddChannels,
  className,
}) => {
  // Get smart set build status configuration
  const getBuildStatusConfig = (status?: SmartSetBuildStatus) => {
    if (!status) return null;

    switch (status) {
      case "building":
        return {
          icon: Loader2,
          text: "Строится",
          color: textColors.accent,
          variant: "primary" as const,
          animate: true,
        };
      case "completed":
        return {
          icon: CheckCircle,
          text: "Готов",
          color: textColors.success,
          variant: "success" as const,
          animate: false,
        };
      case "failed":
        return {
          icon: XCircle,
          text: "Ошибка",
          color: textColors.error,
          variant: "error" as const,
          animate: false,
        };
      case "cancelled":
        return {
          icon: XCircle,
          text: "Отменен",
          color: textColors.warning,
          variant: "warning" as const,
          animate: false,
        };
      default:
        return null;
    }
  };

  const buildStatusConfig = getBuildStatusConfig(channelSet.build_status);

  // Calculate progress for building smart sets
  const progressPercentage =
    channelSet.build_progress && channelSet.build_status === "building"
      ? Math.round(
          (channelSet.build_progress.channels_accepted /
            channelSet.build_progress.target_count) *
            100,
        )
      : undefined;

  return (
    <div
      className={cn(
        createCardStyle(),
        `p-${spacing.md}`,
        animations.fadeIn,
        // Add special styling for smart sets
        channelSet.type === "smart" && "ring-1 ring-blue-500/20",
        className,
      )}
    >
      <div className="relative z-10">
        {/* Header with type badge */}
        <div
          className={cn("flex items-start justify-between", `mb-${spacing.sm}`)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(typography.h4, textColors.primary)}>
                {channelSet.name}
              </h3>

              {/* Type badge */}
              <Badge
                variant="outline"
                className={cn(
                  createBadgeStyle(
                    channelSet.type === "smart" ? "primary" : "outline",
                  ),
                  "flex items-center gap-1",
                )}
              >
                {channelSet.type === "smart" ? (
                  <>
                    <Brain size={10} />
                    <span>Умный</span>
                  </>
                ) : (
                  <>
                    <Users size={10} />
                    <span>Ручной</span>
                  </>
                )}
              </Badge>
            </div>

            {/* Build status for smart sets */}
            {buildStatusConfig && (
              <div className="flex items-center gap-1 mb-2">
                <buildStatusConfig.icon
                  size={12}
                  className={cn(
                    buildStatusConfig.color,
                    buildStatusConfig.animate && "animate-spin",
                  )}
                />
                <span className={cn(createTextStyle("tiny", "muted"))}>
                  {buildStatusConfig.text}
                </span>
              </div>
            )}

            {/* Basic info */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Users size={12} className={textColors.muted} />
                <span className={createTextStyle("tiny", "muted")}>
                  {channelSet.channel_count} каналов
                </span>
              </div>
            </div>
          </div>

          <ChannelSetStatus
            channelCount={channelSet.channel_count}
            allParsed={channelSet.all_parsed}
            channelSetType={channelSet.type}
            buildStatus={channelSet.build_status}
          />
        </div>

        {/* Progress bar for building smart sets */}
        {progressPercentage !== undefined && (
          <div className={cn(`mb-${spacing.sm}`, `space-y-${spacing.xs}`)}>
            <div className="flex justify-between items-center">
              <span className={createTextStyle("tiny", "accent")}>
                Прогресс построения
              </span>
              <span
                className={cn(
                  createTextStyle("tiny", "accent"),
                  typography.weight.medium,
                )}
              >
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        )}

        {/* Description */}
        {channelSet.description && (
          <p
            className={cn(
              createTextStyle("small", "muted"),
              `mb-${spacing.md}`,
              "line-clamp-2",
            )}
          >
            {channelSet.description}
          </p>
        )}

        {/* Smart set criteria summary */}
        {channelSet.type === "smart" && channelSet.build_criteria && (
          <div
            className={cn(
              "bg-blue-500/5 border border-blue-500/20 rounded-lg",
              `p-${spacing.sm} mb-${spacing.md}`,
            )}
          >
            <div className={createTextStyle("tiny", "accent")}>
              {channelSet.build_criteria.filter_ids.length} фильтров, цель:{" "}
              {channelSet.build_criteria.target_count}, порог:{" "}
              {Math.round(channelSet.build_criteria.acceptance_threshold * 100)}
              %
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onViewDetails(channelSet.id)}
            className={cn(createButtonStyle("secondary"), "flex-1")}
          >
            <ArrowRight size={16} className={`mr-${spacing.sm}`} />
            Детали
          </Button>

          {/* Add channels button only for manual sets */}
          {channelSet.type === "manual" &&
            channelSet.permissions.can_manage_channels && (
              <Button
                onClick={() => onAddChannels(channelSet.id)}
                variant="ghost"
                size="sm"
                className={createButtonStyle("ghost")}
              >
                <Plus size={16} />
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChannelSetCard;
