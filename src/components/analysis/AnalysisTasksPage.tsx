// src/components/analysis/AnalysisTasksPage.tsx
import React, { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Filter, 
  Calendar,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAnalysisTasks } from "@/contexts/AnalysisTasksContext";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { AnalysisTask, AnalysisTaskBasic, AnalysisResultsForCard } from "@/types/analysis";
import AnalysisResultsCard from "./AnalysisResultsCard";
import { LoadingCard } from "@/components/ui/loading";
import {
  createCardStyle,
  createButtonStyle,
  createBadgeStyle,
  createTextStyle,
  typography,
  spacing,
  animations,
  textColors,
  components,
} from "@/lib/design-system";

const AnalysisTasksPage: React.FC = () => {
  const { channelSets } = useChannelSets();
  const {
    tasks,
    taskDetails,
    isLoading,
    selectedTask,
    setSelectedTask,
    fetchTasks,
    refreshTask,
    selectTaskById,
  } = useAnalysisTasks();
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle refresh
  const handleRefresh = () => {
    fetchTasks(50, 0, undefined, true);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false;
    }

    // Search filter (by channel set name or task ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      // Проверяем ID задачи
      if (task.id.toLowerCase().includes(query)) {
        return true;
      }

      // Проверяем название канала из деталей, если они есть
      const details = taskDetails[task.id];
      if (details?.channel_set_id) {
        const channelSet = channelSets.find(set => set.id === details.channel_set_id);
        if (channelSet?.name.toLowerCase().includes(query)) {
          return true;
        }
      }

      return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const taskDate = new Date(task.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          if (taskDate.toDateString() !== now.toDateString()) return false;
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (taskDate < weekAgo) return false;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (taskDate < monthAgo) return false;
          break;
      }
    }

    return true;
  });

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className={textColors.success} />;
      case "failed":
        return <XCircle size={16} className={textColors.error} />;
      case "processing":
        return <RefreshCw size={16} className={cn(textColors.accent, "animate-spin")} />;
      default:
        return <Clock size={16} className={textColors.warning} />;
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Завершен";
      case "failed": return "Ошибка";
      case "processing": return "Выполняется";
      default: return "Ожидание";
    }
  };

  // Get status variant
  const getStatusVariant = (status: string): "success" | "error" | "primary" | "warning" => {
    switch (status) {
      case "completed": return "success";
      case "failed": return "error";
      case "processing": return "primary";
      default: return "warning";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("container mx-auto", animations.fadeIn)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={typography.h1}>Задачи анализа</h1>
          <p className={cn(createTextStyle("small", "secondary"), "mt-1")}>
            Отслеживайте статус и результаты анализа каналов
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          className={createButtonStyle("secondary")}
        >
          {isLoading ? (
            <RefreshCw size={16} className="mr-2 animate-spin" />
          ) : (
            <RefreshCw size={16} className="mr-2" />
          )}
          Обновить
        </Button>
      </div>

      {/* Filters */}
      <Card className={cn(createCardStyle(), "mb-6")}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Поиск по ID задачи или названию набора..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(components.input.base, "pl-9")}
              />
            </div>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className={createCardStyle()}>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидание</SelectItem>
                <SelectItem value="processing">Выполняется</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
                <SelectItem value="failed">Ошибка</SelectItem>
              </SelectContent>
            </Select>

            {/* Date filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent className={createCardStyle()}>
                <SelectItem value="all">Все время</SelectItem>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="week">За неделю</SelectItem>
                <SelectItem value="month">За месяц</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks list */}
        <div className="lg:col-span-1">
          <Card className={createCardStyle()}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
                Задачи ({filteredTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="p-6 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className={createTextStyle("small", "muted")}>
                      {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                        ? "Нет задач, соответствующих фильтрам"
                        : "У вас пока нет задач анализа"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredTasks.map((task) => {
                      const details = taskDetails[task.id];
                      const channelSet = details?.channel_set_id 
                        ? channelSets.find(set => set.id === details.channel_set_id)
                        : null;
                      const isSelected = selectedTask?.id === task.id;
                      
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2",
                            isSelected
                              ? "bg-blue-500/20 border border-blue-500/30"
                              : "hover:bg-slate-800/50"
                          )}
                          onClick={() => selectTaskById(task.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant="outline"
                              className={createBadgeStyle(getStatusVariant(task.status))}
                            >
                              {getStatusIcon(task.status)}
                              <span className="ml-1">{getStatusText(task.status)}</span>
                            </Badge>
                            {task.status === "processing" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  refreshTask(task.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <RefreshCw size={12} />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className={cn(typography.small, "font-medium")}>
                              {channelSet?.name || "Загрузка..."}
                            </div>
                            <div className={createTextStyle("tiny", "muted")}>
                              ID: {task.id.slice(0, 8)}...
                            </div>
                            <div className={createTextStyle("tiny", "muted")}>
                              {formatDate(task.created_at)}
                            </div>
                            {task.progress > 0 && task.status === "processing" && (
                              <div className={createTextStyle("tiny", "muted")}>
                                Прогресс: {Math.round(task.progress)}%
                              </div>
                            )}
                          </div>
                          
                          {isSelected && (
                            <div className="mt-2 flex items-center text-blue-400">
                              <ArrowRight size={12} className="mr-1" />
                              <span className="text-xs">Показаны детали</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Task details */}
        <div className="lg:col-span-2">
          {selectedTask ? (
            selectedTask.status === "completed" && selectedTask.results ? (
              <AnalysisResultsCard
                results={selectedTask}
                onRefresh={selectedTask.status !== "completed" ? () => refreshTask(selectedTask.id) : undefined}
                isRefreshing={false}
              />
            ) : (
              <Card className={createCardStyle()}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    {selectedTask.status === "processing" ? (
                      <>
                        <RefreshCw className={cn(textColors.accent, "h-12 w-12 animate-spin mb-4")} />
                        <h3 className={cn(typography.h3, "mb-2")}>Анализ выполняется</h3>
                        <p className={cn(createTextStyle("small", "secondary"), "mb-4 text-center")}>
                          Задача выполняется. Результаты будут доступны после завершения анализа.
                        </p>
                        <Button
                          onClick={() => refreshTask(selectedTask.id)}
                          className={createButtonStyle("secondary")}
                        >
                          <RefreshCw size={16} className="mr-2" />
                          Проверить статус
                        </Button>
                      </>
                    ) : selectedTask.status === "failed" ? (
                      <>
                        <XCircle className={cn(textColors.error, "h-12 w-12 mb-4")} />
                        <h3 className={cn(typography.h3, "mb-2")}>Ошибка выполнения</h3>
                        <p className={cn(createTextStyle("small", "secondary"), "mb-4 text-center")}>
                          {selectedTask.error || "Произошла ошибка при выполнении анализа"}
                        </p>
                      </>
                    ) : (
                      <>
                        <Clock className={cn(textColors.warning, "h-12 w-12 mb-4")} />
                        <h3 className={cn(typography.h3, "mb-2")}>Задача в очереди</h3>
                        <p className={cn(createTextStyle("small", "secondary"), "mb-4 text-center")}>
                          Задача ожидает выполнения. Результаты появятся после завершения анализа.
                        </p>
                      </>
                    )}
                    
                    {/* Task details */}
                    <div className="mt-6 w-full max-w-md">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={textColors.muted}>ID задачи:</span>
                          <span className={textColors.primary}>{selectedTask.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={textColors.muted}>Создана:</span>
                          <span className={textColors.primary}>{formatDate(selectedTask.created_at)}</span>
                        </div>
                        {selectedTask.completed_at && (
                          <div className="flex justify-between">
                            <span className={textColors.muted}>Завершена:</span>
                            <span className={textColors.primary}>{formatDate(selectedTask.completed_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className={createCardStyle()}>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className={cn(typography.h3, "mb-2")}>Выберите задачу</h3>
                  <p className={createTextStyle("small", "muted")}>
                    Выберите задачу из списка слева для просмотра деталей и результатов
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTasksPage;