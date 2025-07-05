import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/ui/components/button";
import { cn } from "@/lib/cn";
import { createCardStyle, createButtonStyle, createTextStyle, typography, spacing, textColors, animations } from "@/lib/design-system";
import { ChannelsSet } from "@/channels-sets/types";
import ChannelsSetStatus from "./ChannelsSetStatus";

export interface ChannelSetCardProps {
    channelSet: ChannelsSet;
    onAnalyze: (setId: string) => void;
    onViewDetails: (setId: string) => void;
    onAddChannels: (setId: string) => void;
    className?: string;
}

export default function ChannelSetCard({ channelSet, onViewDetails, className }: ChannelSetCardProps) {
    // Определяем доступные действия в зависимости от статуса
    const actions = {
        primary: {
            label: "Детали",
            action: () => onViewDetails(channelSet.id),
            variant: "secondary" as const,
            icon: ArrowRight,
        },
        secondary: null,
    };

    return (
        <div
            className={cn(
                createCardStyle(),
                `p-${spacing.md}`,
                animations.fadeIn,
                className,
            )}
        >
            <div className="relative z-10">
                {/* Заголовок и статус */}
                <div className={`mb-${spacing.sm}`}>
                    <h3 className={cn(typography.h4, textColors.primary, "mb-1")}>
                        {channelSet.name}
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Users size={12} className={textColors.muted} />
                                <span className={createTextStyle("tiny", "muted")}>
                                    {channelSet.channel_count} каналов
                                </span>
                            </div>
                        </div>

                        <ChannelsSetStatus
                            channelCount={channelSet.channel_count}
                            allParsed={channelSet.all_parsed}
                        />
                    </div>
                </div>

                {/* Описание */}
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

                {/* Действия */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={actions.primary.action}
                        className={cn(createButtonStyle(actions.primary.variant), "flex-1")}
                    >
                        {actions.primary.icon && (
                            <actions.primary.icon size={16} className={`mr-${spacing.sm}`} />
                        )}
                        {actions.primary.label}
                    </Button>

                    {actions.secondary && (
                        <Button
                            onClick={actions.secondary.action}
                            variant="ghost"
                            size="sm"
                            className={createButtonStyle("ghost")}
                        >
                            {actions.secondary.icon && <actions.secondary.icon size={16} />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
