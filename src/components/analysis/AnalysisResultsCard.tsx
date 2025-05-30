// src/components/analysis/AnalysisResultsCard.tsx - улучшенная мобильная версия
import React, { useState } from "react";
import { AnalysisResults, AnalysisTask, ChannelResult, FilterResult } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  Filter,
  ChevronRight,
  Eye,
  MoreVertical,
  Download,
  Share,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createCardStyle,
  createButtonStyle,
  createBadgeStyle,
  createTextStyle,
  typography,
  spacing,
  animations,
  textColors,
  radius,
} from "@/lib/design-system";

interface AnalysisResultsCardProps {
  results: AnalysisTask;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

// Компонент MobileActionSheet
const MobileActionSheet = ({ isOpen, onClose, actions = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div 
        className={cn(
          "bg-slate-800 border-t border-blue-500/20 rounded-t-2xl",
          "w-full max-w-md animate-in slide-in-from-bottom duration-300"
        )}
      >
        {/* Индикатор */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-white">Действия</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Действия */}
        <div className="p-4 space-y-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onPress();
                onClose();
              }}
              disabled={action.disabled}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg",
                "transition-all duration-200",
                action.disabled 
                  ? "bg-slate-700/50 text-gray-500 cursor-not-allowed"
                  : "bg-slate-700/50 text-white hover:bg-slate-600/50 active:scale-[0.98]"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  action.disabled ? "bg-slate-600/50" : action.color || "bg-blue-500/20"
                )}>
                  <action.icon size={18} className={action.disabled ? "text-gray-500" : action.iconColor || "text-blue-400"} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  {action.subtitle && (
                    <div className="text-xs text-gray-400">{action.subtitle}</div>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({
  results,
  onRefresh,
  isRefreshing = false,
}) => {
  const {
    summary,
    results: channelResults,
    status,
    created_at,
    completed_at,
  } = results;

  // UI состояния
  const [selectedChannel, setSelectedChannel] = useState<ChannelResult | null>(null);
  const [showChannelDetails, setShowChannelDetails] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedChannelForActions, setSelectedChannelForActions] = useState<ChannelResult | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "approved" | "rejected">("approved");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Вычисление процента одобрения
  const approvalRate = summary && summary.total_channels > 0
    ? Math.round((summary.approved_channels / summary.total_channels) * 100)
    : 0;

  // Фильтрация каналов по статусу
  const filteredChannels = channelResults?.filter(channel => {
    if (viewMode === "approved") return channel.overall_status === "approved";
    if (viewMode === "rejected") return channel.overall_status === "rejected";
    return true;
  }) || [];

  // Утилиты для отображения
  const truncateText = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          text: "Подходит",
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/20"
        };
      case "rejected":
        return {
          icon: XCircle,
          text: "Не подходит", 
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20"
        };
      default:
        return {
          icon: AlertCircle,
          text: "Неизвестно",
          color: "text-amber-400", 
          bg: "bg-amber-500/10",
          border: "border-amber-500/20"
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-blue-400";
    if (score >= 4) return "text-amber-400";
    return "text-red-400";
  };

  // Status badge компонент
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let icon;
    let text;
    let variant: "success" | "primary" | "error" | "warning" = "warning";

    switch (status) {
      case "completed":
        icon = <CheckCircle size={12} className="mr-1" />;
        text = "Завершен";
        variant = "success";
        break;
      case "processing":
        icon = <RefreshCw size={12} className="mr-1 animate-spin" />;
        text = "Выполняется";
        variant = "primary";
        break;
      case "failed":
        icon = <XCircle size={12} className="mr-1" />;
        text = "Ошибка";
        variant = "error";
        break;
      default:
        icon = <Clock size={12} className="mr-1" />;
        text = "Ожидание";
        variant = "warning";
    }

    return (
      <Badge
        variant="outline"
        className={cn("flex items-center", createBadgeStyle(variant))}
      >
        {icon}
        {text}
      </Badge>
    );
  };

  // Компонент карточки канала
  const ChannelCard = ({ channel }: { channel: ChannelResult }) => {
    const statusConfig = getStatusConfig(channel.overall_status);
    const StatusIcon = statusConfig.icon;
    const passedFilters = channel.filter_results.filter(f => f.passed).length;
    const totalFilters = channel.filter_results.length;
    const passRate = Math.round((passedFilters / totalFilters) * 100);

    const handleChannelPress = () => {
      setSelectedChannel(channel);
      setShowChannelDetails(true);
    };

    const handleActionsPress = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedChannelForActions(channel);
      setShowActionSheet(true);
    };

    return (
      <div
        className={cn(
          "bg-slate-800/50 border rounded-xl p-4 mb-3",
          "transition-all duration-200 active:scale-[0.98]",
          statusConfig.border,
          "hover:bg-slate-800/70 hover:border-opacity-40"
        )}
        onClick={handleChannelPress}
      >
        {/* Заголовок и действия */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex items-center px-2 py-1 rounded-full text-xs border",
              statusConfig.bg, statusConfig.border, statusConfig.color
            )}>
              <StatusIcon size={12} className="mr-1" />
              {statusConfig.text}
            </div>
          </div>
          <button
            onClick={handleActionsPress}
            className="p-1 hover:bg-slate-700/50 rounded"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Название канала */}
        <h3 className="font-medium text-white mb-2">@{channel.channel_id}</h3>

        {/* Описание (обрезанное) */}
        {channel.description && (
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            {truncateText(channel.description)}
          </p>
        )}

        {/* Статистика фильтров */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-400">
              Фильтры: <span className={cn(
                "font-medium", 
                passRate >= 70 ? "text-green-400" : 
                passRate >= 40 ? "text-amber-400" : "text-red-400"
              )}>
                {passedFilters}/{totalFilters}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {passRate}%
            </div>
          </div>
          <Eye size={14} className="text-blue-400" />
        </div>
      </div>
    );
  };

  // Модальное окно с деталями канала
  const ChannelDetailsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen || !selectedChannel) return null;

    const statusConfig = getStatusConfig(selectedChannel.overall_status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
        <div className={cn(
          "bg-slate-800 border border-blue-500/20 rounded-t-2xl sm:rounded-2xl",
          "w-full max-w-md max-h-[85vh] overflow-y-auto",
          "animate-in slide-in-from-bottom duration-300"
        )}>
          {/* Заголовок */}
          <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700/50 rounded-t-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Детали канала</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className={cn(
              "flex items-center px-3 py-1 rounded-full text-sm border inline-flex",
              statusConfig.bg, statusConfig.border, statusConfig.color
            )}>
              <StatusIcon size={14} className="mr-1" />
              {statusConfig.text}
            </div>
          </div>

          {/* Содержимое */}
          <div className="p-4 space-y-4">
            {/* Информация о канале */}
            <div>
              <h3 className="font-medium text-white mb-2">@{selectedChannel.channel_id}</h3>
              {selectedChannel.description && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedChannel.description}
                </p>
              )}
            </div>

            {/* Результаты фильтров */}
            <div>
              <h4 className="font-medium text-blue-300 mb-3">Результаты фильтрации</h4>
              <div className="space-y-3">
                {selectedChannel.filter_results.map((filter, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">{filter.filter_name}</span>
                      <div className="flex items-center space-x-2">
                        <span className={cn("font-bold", getScoreColor(filter.score))}>
                          {filter.score.toFixed(1)}
                        </span>
                        {filter.passed ? (
                          <CheckCircle size={16} className="text-green-400" />
                        ) : (
                          <XCircle size={16} className="text-red-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{filter.explanation}</p>
                    
                    {/* Проблемные посты */}
                    {filter.problematic_posts.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-red-400 font-medium mb-1">Проблемные посты:</div>
                        {filter.problematic_posts.map((post, postIndex) => (
                          <div key={postIndex} className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-1">
                            <div className="text-xs text-red-400 mb-1">{post.issue}</div>
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                            >
                              Открыть пост
                              <ExternalLink size={10} className="ml-1" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Действия для каналов
  const getChannelActions = (channel: ChannelResult | null) => {
    if (!channel) return [];

    return [
      {
        icon: BarChart3,
        title: "Детальная аналитика",
        subtitle: "Посмотреть подробную статистику",
        onPress: () => {
          console.log("View analytics for", channel.channel_id);
        },
        color: "bg-blue-500/20",
        iconColor: "text-blue-400"
      },
      {
        icon: Download,
        title: "Экспорт данных канала",
        subtitle: "Скачать данные о канале",
        onPress: () => {
          console.log("Export channel data", channel.channel_id);
        },
        color: "bg-purple-500/20",
        iconColor: "text-purple-400"
      }
    ];
  };

  if (!summary || !channelResults) {
    return (
      <Card className={cn(createCardStyle(), "overflow-hidden", animations.fadeIn)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className={cn(typography.h3, "mb-2")}>Нет результатов</h3>
            <p className={cn(createTextStyle("small", "secondary"))}>
              Результаты анализа недоступны
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(createCardStyle(), "overflow-hidden", animations.fadeIn)}>
      <CardHeader className={cn("bg-slate-800/70", `pb-${spacing.sm}`)}>
        <div className="flex justify-between items-center">
          <CardTitle className={typography.h3}>Результаты анализа</CardTitle>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing || status === "completed"}
              className={createButtonStyle("secondary")}
            >
              {isRefreshing ? (
                <RefreshCw size={16} className="mr-1 animate-spin" />
              ) : (
                <RefreshCw size={16} className="mr-1" />
              )}
              Обновить
            </Button>
          )}
        </div>

        {/* Status badge */}
        <div className="flex items-center mt-1">
          <StatusBadge status={status || "pending"} />
          <div className={cn("ml-4", createTextStyle("small", "secondary"))}>
            {created_at && <div>Начат: {formatDate(created_at)}</div>}
            {completed_at && <div>Завершен: {formatDate(completed_at)}</div>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Статистика */}
        <div className={cn(`p-${spacing.md}`, "border-b border-slate-700/50")}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{summary.total_channels}</div>
              <div className="text-xs text-blue-300">Всего</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{summary.approved_channels}</div>
              <div className="text-xs text-green-300">Подходят</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{summary.rejected_channels}</div>
              <div className="text-xs text-red-300">Отклонены</div>
            </div>
          </div>

          <div className={`mt-${spacing.md}`}>
            <div className="flex justify-between items-center mb-1">
              <span className={cn(typography.small, "text-blue-300")}>
                Процент соответствия критериям
              </span>
              <span className={cn(typography.small, "font-medium")}>
                {approvalRate}%
              </span>
            </div>
            <Progress value={approvalRate} className="h-2" />
          </div>
        </div>

        {/* Фильтры просмотра */}
        <div className={cn(`p-${spacing.md}`, "border-b border-slate-700/50")}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { value: "all", label: "Все каналы", count: summary.total_channels },
              { value: "approved", label: "Подходящие", count: summary.approved_channels },
              { value: "rejected", label: "Отклоненные", count: summary.rejected_channels }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setViewMode(filter.value as any)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all flex items-center space-x-1",
                  viewMode === filter.value
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
                )}
              >
                <span>{filter.label}</span>
                <span className="text-xs opacity-75">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Список каналов */}
        <ScrollArea className="max-h-[400px]">
          <div className={`p-${spacing.md}`}>
            {filteredChannels.length === 0 ? (
              <div className="text-center py-8">
                <Filter className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-400 text-sm">
                  Нет каналов в выбранной категории
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredChannels.map((channel, index) => (
                  <ChannelCard key={`${channel.channel_id}-${index}`} channel={channel} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Модальное окно с деталями канала */}
      <ChannelDetailsModal 
        isOpen={showChannelDetails}
        onClose={() => setShowChannelDetails(false)}
      />

      {/* ActionSheet для действий с каналом */}
      <MobileActionSheet 
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        actions={getChannelActions(selectedChannelForActions)}
      />
    </Card>
  );
};

export default AnalysisResultsCard;