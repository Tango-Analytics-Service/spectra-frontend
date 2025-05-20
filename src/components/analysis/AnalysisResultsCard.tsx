// src/components/analysis/AnalysisResultsCard.tsx
import React from "react";
import { AnalysisResults, ChannelResult, FilterResult } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Clock,
  Filter,
  BarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnalysisResultsCardProps {
  results: AnalysisResults;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({
  results,
  onRefresh,
  isRefreshing = false,
}) => {
  const {
    summary,
    results: channelResults,
    status,
    started_at,
    completed_at,
  } = results;

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

  // Calculate approval rate
  const approvalRate =
    summary.total_channels > 0
      ? Math.round((summary.approved_channels / summary.total_channels) * 100)
      : 0;

  return (
    <Card className="bg-slate-800/50 border border-blue-500/20 text-white overflow-hidden">
      <CardHeader className="bg-slate-800/70 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Результаты анализа
          </CardTitle>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing || status === "completed"}
              className="border-blue-500/20 text-blue-300"
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
          <div className="ml-4 text-xs text-blue-300">
            {started_at && <div>Начат: {formatDate(started_at)}</div>}
            {completed_at && <div>Завершен: {formatDate(completed_at)}</div>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Summary stats */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Всего проанализировано"
              value={summary.total_channels}
              icon={<Filter size={20} className="text-blue-400" />}
            />
            <StatCard
              label="Соответствуют критериям"
              value={summary.approved_channels}
              icon={<CheckCircle size={20} className="text-green-400" />}
            />
            <StatCard
              label="Не соответствуют критериям"
              value={summary.rejected_channels}
              icon={<XCircle size={20} className="text-red-400" />}
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-blue-300">
                Процент соответствия критериям
              </span>
              <span className="text-sm font-medium">{approvalRate}%</span>
            </div>
            <Progress value={approvalRate} className="h-2" />
          </div>
        </div>

        {/* Channel results */}
        <ScrollArea className="max-h-[400px]">
          {channelResults.map((channel) => (
            <ChannelResultItem key={channel.channel_id} channel={channel} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let icon;
  let text;
  let classes;

  switch (status) {
    case "completed":
      icon = <CheckCircle size={12} className="mr-1" />;
      text = "Завершен";
      classes = "bg-green-500/10 text-green-400 border-green-500/20";
      break;
    case "processing":
      icon = <RefreshCw size={12} className="mr-1 animate-spin" />;
      text = "Выполняется";
      classes = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      break;
    case "failed":
      icon = <XCircle size={12} className="mr-1" />;
      text = "Ошибка";
      classes = "bg-red-500/10 text-red-400 border-red-500/20";
      break;
    default:
      icon = <Clock size={12} className="mr-1" />;
      text = "Ожидание";
      classes = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  return (
    <Badge variant="outline" className={cn("flex items-center", classes)}>
      {icon}
      {text}
    </Badge>
  );
};

// Stat card component
const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="bg-slate-900/30 rounded-md p-3 flex items-center">
    <div className="bg-slate-800/70 rounded-full p-2 mr-3">{icon}</div>
    <div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-blue-300">{label}</div>
    </div>
  </div>
);

// Channel result item component
const ChannelResultItem: React.FC<{ channel: ChannelResult }> = ({
  channel,
}) => {
  // Get overall status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  // Get overall status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  // Calculate pass rate
  const passedFilters = channel.filter_results.filter(
    (filter) => filter.passed,
  ).length;
  const totalFilters = channel.filter_results.length;
  const passRate =
    totalFilters > 0 ? Math.round((passedFilters / totalFilters) * 100) : 0;

  return (
    <Accordion
      type="single"
      collapsible
      className="border-b border-slate-700/50"
    >
      <AccordionItem value={channel.channel_id} className="border-0">
        <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-slate-800/30">
          <div className="flex flex-1 items-center">
            <div className="mr-3">
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1",
                  getStatusColor(channel.overall_status),
                )}
              >
                {getStatusIcon(channel.overall_status)}
                <span className="capitalize">
                  {channel.overall_status === "approved"
                    ? "Подходит"
                    : "Не подходит"}
                </span>
              </Badge>
            </div>

            <div className="flex-1 text-left">
              <div className="font-medium">@{channel.channel_id}</div>
              {channel.description && (
                <div className="text-xs text-gray-400 truncate max-w-[400px]">
                  {channel.description}
                </div>
              )}
            </div>

            <div className="ml-4 flex items-center mr-4">
              <div className="text-sm">
                <span className="text-blue-300">Соответствие: </span>
                <span
                  className={cn(
                    passRate >= 70
                      ? "text-green-400"
                      : passRate >= 40
                        ? "text-amber-400"
                        : "text-red-400",
                  )}
                >
                  {passRate}%
                </span>
              </div>
              <div className="ml-3 text-xs text-gray-400">
                {passedFilters}/{totalFilters} фильтров
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 pt-0">
          <div className="bg-slate-900/30 rounded-md p-3 mt-2">
            <h4 className="font-medium text-sm text-blue-300 mb-3">
              Результаты фильтрации
            </h4>

            <Table>
              <TableHeader className="bg-slate-800/70">
                <TableRow>
                  <TableHead className="w-[250px]">Фильтр</TableHead>
                  <TableHead className="w-[100px] text-center">Балл</TableHead>
                  <TableHead>Комментарий</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Статус
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channel.filter_results.map((filter) => (
                  <FilterResultRow key={filter.filter_id} filter={filter} />
                ))}
              </TableBody>
            </Table>

            {/* Show problematic posts if any */}
            {channel.filter_results.some(
              (f) => f.problematic_posts.length > 0,
            ) && (
              <div className="mt-4">
                <h4 className="font-medium text-sm text-blue-300 mb-2">
                  Проблемные посты
                </h4>
                <div className="space-y-2">
                  {channel.filter_results
                    .filter((f) => f.problematic_posts.length > 0)
                    .map((filter) => (
                      <div
                        key={`posts-${filter.filter_id}`}
                        className="bg-slate-800/50 rounded-md p-3"
                      >
                        <h5 className="text-sm font-medium mb-2">
                          {filter.filter_name}
                        </h5>
                        <div className="space-y-1">
                          {filter.problematic_posts.map((post) => (
                            <div
                              key={post.post_id}
                              className="flex items-start text-xs"
                            >
                              <XCircle
                                size={12}
                                className="text-red-400 mr-2 mt-0.5 flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="text-red-300 mb-0.5">
                                  {post.issue}
                                </div>
                                <a
                                  href={post.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 flex items-center hover:underline"
                                >
                                  Открыть пост
                                  <ExternalLink size={10} className="ml-1" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// Filter result row component
const FilterResultRow: React.FC<{ filter: FilterResult }> = ({ filter }) => {
  return (
    <TableRow className="hover:bg-slate-800/30">
      <TableCell className="font-medium">{filter.filter_name}</TableCell>
      <TableCell className="text-center">
        <ScoreBadge score={filter.score} />
      </TableCell>
      <TableCell className="text-sm text-gray-300">
        {filter.explanation}
      </TableCell>
      <TableCell className="text-center">
        {filter.passed ? (
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle size={16} className="text-green-400 inline" />
            </TooltipTrigger>
            <TooltipContent>Фильтр пройден</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <XCircle size={16} className="text-red-400 inline" />
            </TooltipTrigger>
            <TooltipContent>Фильтр не пройден</TooltipContent>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

// Score badge component
const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 8) return "bg-green-500/20 text-green-400";
    if (score >= 6) return "bg-blue-500/20 text-blue-400";
    if (score >= 4) return "bg-amber-500/20 text-amber-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <div
      className={cn(
        "inline-block px-2 py-0.5 rounded-full font-medium text-xs",
        getScoreColor(),
      )}
    >
      {score.toFixed(1)}
    </div>
  );
};

export default AnalysisResultsCard;
