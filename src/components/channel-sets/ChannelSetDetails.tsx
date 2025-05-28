import {
  Share2,
  Settings,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  typography,
  spacing,
  createCardStyle,
  createBadgeStyle,
  createButtonStyle,
  sizes,
  createTextStyle,
  textColors,
} from "@/lib/design-system";

interface Channel {
  username: string;
  channel_id: number;
  is_parsed: boolean;
  added_at: string;
}

interface ChannelSet {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  is_predefined: boolean;
  created_at: string;
  updated_at: string;
  channel_count: number;
  channels: Channel[];
  all_parsed: boolean;
}

interface ChannelSetDetailsProps {
  selectedSet?: ChannelSet;
  onShare?: (setId: string) => void;
  onEdit?: (setId: string) => void;
  onAnalyze?: (setId: string) => void;
}

const ChannelSetDetails = ({
  selectedSet,
  onShare = () => {},
  onEdit = () => {},
  onAnalyze = () => {},
}: ChannelSetDetailsProps) => {
  // Default set for when no set is selected
  const defaultSet: ChannelSet = {
    id: "default",
    name: "Выберите набор",
    description: "Выберите набор каналов для просмотра деталей",
    is_public: false,
    is_predefined: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    channel_count: 0,
    channels: [],
    all_parsed: false,
  };

  const set = selectedSet || defaultSet;

  // Format date to DD.MM.YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className={createCardStyle()}>
      <CardContent className={`p-${spacing.sm} sm:p-${spacing.md}`}>
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <div className={cn(typography.small, "text-blue-300")}>
            Выбранный набор
          </div>
          <div className="flex space-x-1">
            {set.is_public && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  createButtonStyle("ghostIcon"),
                  sizes.button.xs,
                  "sm:" + sizes.button.sm,
                )}
                onClick={() => onShare(set.id)}
              >
                <Share2 size={14} />
                <span className="sr-only">Поделиться</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                createButtonStyle("ghost"),
                sizes.button.xs,
                "sm:" + sizes.button.sm,
              )}
              onClick={() => onEdit(set.id)}
            >
              <Settings size={14} />
              <span className="sr-only">Настройки</span>
            </Button>
          </div>
        </div>

        <div className={cn(typography.h4, "mb-1")}>{set.name}</div>
        <div className={cn(createTextStyle("small", "muted"), "mb-2 sm:mb-3")}>
          {set.description}
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-2 mt-2",
            typography.tiny,
          )}
        >
          <div className={(cn(textColors.secondary), "flex items-center")}>
            <Calendar size={10} className="mr-1" />
            <span>Обновлен: {formatDate(set.updated_at)}</span>
          </div>

          <div className="flex items-center">
            {set.all_parsed ? (
              <Badge
                variant="outline"
                className={cn(createBadgeStyle("success"))}
              >
                <CheckCircle size={10} />
                <span>Готов к анализу</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className={cn(createBadgeStyle("warning"))}
              >
                <AlertCircle size={10} />
                <span>Обработка данных</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex justify-end">
          <Button
            className={cn(
              createButtonStyle("primary"),
              "text-xs sm:text-sm py-1 h-8 sm:h-9",
            )}
            onClick={() => onAnalyze(set.id)}
          >
            Анализировать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelSetDetails;
