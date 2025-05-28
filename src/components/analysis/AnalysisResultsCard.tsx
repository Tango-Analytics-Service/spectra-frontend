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
  ExternalLink,
  RefreshCw,
  Clock,
  Filter,
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
    <Card
      className={cn(createCardStyle(), "overflow-hidden", animations.fadeIn)}
    >
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
            {started_at && <div>Начат: {formatDate(started_at)}</div>}
            {completed_at && <div>Завершен: {formatDate(completed_at)}</div>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Summary stats */}
        <div className={cn(`p-${spacing.md}`, "border-b border-slate-700/50")}>
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

// Stat card component
const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div
    className={cn(
      "bg-slate-900/30 rounded-md",
      `p-${spacing.sm}`,
      "flex items-center",
    )}
  >
    <div
      className={cn(
        "bg-slate-800/70 rounded-full",
        `p-${spacing.sm} mr-${spacing.sm}`,
      )}
    >
      {icon}
    </div>
    <div>
      <div className={cn(typography.h2, typography.weight.semibold)}>{value}</div>
      <div className={cn(createTextStyle("small", "secondary"))}>{label}</div>
    </div>
  </div>
);

// Channel result item component
const ChannelResultItem: React.FC<{ channel: ChannelResult }> = ({
  channel,
}) => {
  // Get overall status color
  const getStatusVariant = (
    status: string,
  ): "success" | "error" | "warning" => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
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
        <AccordionTrigger
          className={cn(
            `py-${spacing.sm} px-${spacing.md}`,
            "hover:no-underline hover:bg-slate-800/30",
          )}
        >
          <div className="flex flex-1 items-center">
            <div className={`mr-${spacing.sm}`}>
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1",
                  createBadgeStyle(getStatusVariant(channel.overall_status)),
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
              <div className={cn(typography.body, typography.weight.medium)}>
                @{channel.channel_id}
              </div>
              {channel.description && (
                <div
                  className={cn(
                    createTextStyle("small", "muted"),
                   "truncate max-w-[400px]",
                  )}
                >
                  {channel.description}
                </div>
              )}
            </div>

            <div className={cn("ml-4 flex items-center", `mr-${spacing.md}`)}>
              <div className={typography.small}>
                <span className={cn(textColors.secondary)}>Соответствие: </span>
                <span
                  className={cn(
                    passRate >= 70
                      ? cn(textColors.success)
                      : passRate >= 40
                        ? cn(textColors.warning)
                        : cn(textColors.error)
                  )}
                >
                  {passRate}%
                </span>
              </div>
              <div className={cn("ml-3", createTextStyle("tiny", "muted"))}>
                {passedFilters}/{totalFilters} фильтров
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent
          className={cn(`px-${spacing.md} pb-${spacing.md}`, "pt-0")}
        >
          <div
            className={cn(
              "bg-slate-900/30", cn(radius.md),
              `p-${spacing.sm} mt-${spacing.sm}`,
            )}
          >
            <h4
              className={cn(
                typography.weight.medium,
                createTextStyle("small", "secondary"),
                `mb-${spacing.sm}`,
              )}
            >
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
              <div className={`mt-${spacing.md}`}>
                <h4
                  className={cn(
                    typography.weight.medium,
                    createTextStyle("small", "secondary"),
                    `mb-${spacing.sm}`,
                  )}
                >
                  Проблемные посты
                </h4>
                <div className={`space-y-${spacing.sm}`}>
                  {channel.filter_results
                    .filter((f) => f.problematic_posts.length > 0)
                    .map((filter) => (
                      <div
                        key={`posts-${filter.filter_id}`}
                        className={cn(
                          "bg-slate-800/50 rounded-md",
                          `p-${spacing.sm}`,
                        )}
                      >
                        <h5
                          className={cn(
                            typography.small,
                            typography.weight.medium,
                            `mb-${spacing.sm}`,
                          )}
                        >
                          {filter.filter_name}
                        </h5>
                        <div className="space-y-1">
                          {filter.problematic_posts.map((post) => (
                            <div
                              key={post.post_id}
                              className={cn(
                                "flex items-start",
                                typography.tiny,
                              )}
                            >
                              <XCircle
                                size={12}
                                className={cn(
                                  textColors.error,
                                  `mr-${spacing.sm}`,
                                  "mt-0.5 flex-shrink-0",
                                )}
                              />
                              <div className="flex-1">
                                <div
                                  className={cn(
                                    textColors.error,
                                    `mb-${spacing.xs}`,
                                  )}
                                >
                                  {post.issue}
                                </div>
                                <a
                                  href={post.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(textColors.accent, "flex items-center hover:underline")}
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
      <TableCell className={cn(typography.small, "text-gray-300")}>
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
  const getScoreVariant = (): "success" | "primary" | "warning" | "error" => {
    if (score >= 8) return "success";
    if (score >= 6) return "primary";
    if (score >= 4) return "warning";
    return "error";
  };

  return (
    <div
      className={cn(
        "inline-block px-2 py-0.5 rounded-full font-medium",
        typography.tiny,
        createBadgeStyle(getScoreVariant()),
      )}
    >
      {score.toFixed(1)}
    </div>
  );
};

export default AnalysisResultsCard;
