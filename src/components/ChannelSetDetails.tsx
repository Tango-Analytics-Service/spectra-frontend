import React from "react";
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
    <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <div className="text-xs sm:text-sm text-blue-300">
            Выбранный набор
          </div>
          <div className="flex space-x-1">
            {set.is_public && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 hover:bg-white/10 hover:text-blue-300"
                onClick={() => onShare(set.id)}
              >
                <Share2 size={14} />
                <span className="sr-only">Поделиться</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 hover:bg-white/10 hover:text-gray-300"
              onClick={() => onEdit(set.id)}
            >
              <Settings size={14} />
              <span className="sr-only">Настройки</span>
            </Button>
          </div>
        </div>

        <div className="text-base sm:text-lg font-medium mb-1">{set.name}</div>
        <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
          {set.description}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mt-2">
          <div className="flex items-center text-blue-300">
            <Calendar size={10} className="mr-1" />
            <span>Обновлен: {formatDate(set.updated_at)}</span>
          </div>

          <div className="flex items-center">
            {set.all_parsed ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-green-500/10 text-green-400 border-green-500/20 text-[10px] sm:text-xs py-0 h-5 sm:h-6"
              >
                <CheckCircle size={10} />
                <span>Готов к анализу</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] sm:text-xs py-0 h-5 sm:h-6"
              >
                <AlertCircle size={10} />
                <span>Обработка данных</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex justify-end">
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-xs sm:text-sm py-1 h-8 sm:h-9"
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
