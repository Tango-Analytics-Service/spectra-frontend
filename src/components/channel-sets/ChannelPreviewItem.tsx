import { spacing } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

export interface ChannelPreviewItemProps {
    channel: {
        id: string;
        original: string;
        username: string;
        isValid: boolean;
        isDuplicate?: boolean;
        isFormatValid?: boolean;
    };
}

/// Компонент для предпросмотра отдельного канала
export default function ChannelPreviewItem({ channel }: ChannelPreviewItemProps) {
    const getStatusIcon = () => {
        if (channel.isValid) {
            return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
        } else if (channel.isDuplicate) {
            return (
                <AlertCircle size={16} className="text-yellow-400 flex-shrink-0" />
            );
        } else {
            return <AlertCircle size={16} className="text-red-400 flex-shrink-0" />;
        }
    };

    const getStatusColor = () => {
        if (channel.isValid) {
            return "bg-green-500/10 border border-green-500/20";
        } else if (channel.isDuplicate) {
            return "bg-yellow-500/10 border border-yellow-500/20";
        } else {
            return "bg-red-500/10 border border-red-500/20";
        }
    };

    const getTextColor = () => {
        if (channel.isValid) {
            return "text-green-100";
        } else if (channel.isDuplicate) {
            return "text-yellow-100";
        } else {
            return "text-red-100";
        }
    };

    const getErrorMessage = () => {
        if (channel.isDuplicate) {
            return "Канал уже есть в наборе";
        } else if (!channel.isFormatValid) {
            return "Неверный формат (5-32 символа, только буквы, цифры и _)";
        }
        return null;
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between",
                `p-${spacing.sm}`,
                "rounded-md transition-colors",
                getStatusColor(),
            )}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {getStatusIcon()}

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className={cn("font-medium truncate", getTextColor())}>
                            @{channel.username}
                        </span>
                        <a
                            href={`https://t.me/${channel.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink size={12} />
                        </a>
                    </div>

                    {getErrorMessage() && (
                        <div
                            className="text-xs mt-0.5"
                            style={{ color: channel.isDuplicate ? "#fbbf24" : "#f87171" }}
                        >
                            {getErrorMessage()}
                        </div>
                    )}

                    {channel.original !== channel.username && (
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                            Из: {channel.original}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
