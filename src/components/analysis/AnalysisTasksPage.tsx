// src/components/analysis/AnalysisTasksPage.tsx - улучшенная мобильная версия
import React, { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Filter, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  ChevronRight,
  MoreVertical,
  Play,
  Download,
  Share
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
import { AnalysisTask, AnalysisTaskBasic } from "@/types/analysis";
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
  
  // UI состояния
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedTaskForActions, setSelectedTaskForActions] = useState(null);
  
  // Фильтры
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Загрузка задач при монтировании
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Обработчик обновления
  const handleRefresh = () => {
    fetchTasks(50, 0, undefined, true);
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false;
    }

    // Search filter (по ID задачи или названию набора каналов)
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

  // Получение иконки статуса
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

  // Получение текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Завершен";
      case "failed": return "Ошибка";
      case "processing": return "Выполняется";
      default: return "Ожидание";
    }
  };

  // Получение варианта статуса
  const getStatusVariant = (status: string): "success" | "error" | "primary" | "warning" => {
    switch (status) {
      case "completed": return "success";
      case "failed": return "error";
      case "processing": return "primary";
      default: return "warning";
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Только что";
    if (diffHours < 24) return `${diffHours}ч назад`;
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
  };

  // Компонент карточки задачи
  const TaskCard = ({ task }: { task: AnalysisTaskBasic }) => {
    const details = taskDetails[task.id];
    
    const successRate = details?.summary 
      ? Math.round((details.summary.approved_channels / details.summary.total_channels) * 100)
      : null;

    const handleTaskPress = () => {
      selectTaskById(task.id);
      setShowTaskDetails(true);
    };


    return (
      <div
        className={cn(
          "bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 mb-3",
          "transition-all duration-200 active:scale-[0.98]",
          "hover:border-blue-500/30 hover:bg-slate-800/70"
        )}
        onClick={handleTaskPress}
      >
        {/* Заголовок и действия */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={createBadgeStyle(getStatusVariant(task.status))}
            >
              {getStatusIcon(task.status)}
              <span className="ml-1">{getStatusText(task.status)}</span>
            </Badge>
            <span className="text-xs text-gray-400">{formatDate(task.created_at)}</span>
          </div>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-900/50 rounded-lg p-2">
            <div className="text-xs text-blue-300">Каналов</div>
            <div className="font-semibold text-white">{details.summary.total_channels || '-'}</div>
          </div>
          
          {task.status === "completed" && successRate !== null && (
            <div className="bg-slate-900/50 rounded-lg p-2">
              <div className="text-xs text-green-300">Успешность</div>
              <div className="font-semibold text-white">{successRate}%</div>
            </div>
          )}
          
          {task.status === "processing" && task.progress > 0 && (
            <div className="bg-slate-900/50 rounded-lg p-2">
              <div className="text-xs text-blue-300">Прогресс</div>
              <div className="font-semibold text-white">{task.progress}%</div>
            </div>
          )}
        </div>

        {/* Прогресс бар для выполняющихся задач */}
        {task.status === "processing" && task.progress > 0 && (
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        )}

        {/* ID задачи */}
        <div className="mt-2 text-xs text-gray-500">
          ID: {task.id.slice(0, 8)}...
        </div>
      </div>
    );
  };

  // Модальное окно с деталями задачи
  const TaskDetailsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen || !selectedTask) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
        <div 
          className={cn(
            "bg-slate-800 border border-blue-500/20 rounded-t-2xl sm:rounded-2xl",
            "w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col",
            "animate-in slide-in-from-bottom duration-300"
          )}
        >
          {/* Заголовок */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Детали задачи</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Содержимое */}
          <div className="flex-1 overflow-y-auto">
            {selectedTask.status === "completed" && selectedTask.results ? (
              <AnalysisResultsCard
                results={selectedTask}
                onRefresh={selectedTask.status !== "completed" ? () => refreshTask(selectedTask.id) : undefined}
                isRefreshing={false}
              />
            ) : (
              <div className="p-6">
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Действия для ActionSheet
  const getTaskActions = (task: AnalysisTaskBasic | null) => {
    if (!task) return [];

    const actions = [
      {
        icon: RefreshCw,
        title: "Обновить статус",
        subtitle: "Проверить текущий статус задачи",
        onPress: () => refreshTask(task.id),
        color: "bg-blue-500/20",
        iconColor: "text-blue-400"
      }
    ];

    return actions;
  };

  return (
    <div className={cn("container mx-auto", animations.fadeIn, "p-4")}>
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

      {/* Быстрая статистика */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-white">{tasks.length}</div>
          <div className="text-xs text-blue-300">Всего</div>
        </div>
        <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-green-400">
            {tasks.filter(t => t.status === "completed").length}
          </div>
          <div className="text-xs text-green-300">Завершено</div>
        </div>
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-blue-400">
            {tasks.filter(t => t.status === "processing").length}
          </div>
          <div className="text-xs text-blue-300">В процессе</div>
        </div>
      </div>

      {/* Фильтры */}
      <Card className={cn(createCardStyle(), "mb-6")}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Поиск */}
            <div className="relative">
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

            {/* Фильтры статуса - горизонтальная прокрутка */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { value: "all", label: "Все" },
                { value: "completed", label: "Завершены" },
                { value: "processing", label: "В процессе" },
                { value: "failed", label: "Ошибки" }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all",
                    statusFilter === filter.value
                      ? "bg-blue-500 text-white"
                      : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список задач */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className={createTextStyle("small", "muted")}>
            {searchQuery || statusFilter !== "all" || dateFilter !== "all"
              ? "Нет задач, соответствующих фильтрам"
              : "У вас пока нет задач анализа"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Модальное окно с деталями */}
      <TaskDetailsModal 
        isOpen={showTaskDetails}
        onClose={() => setShowTaskDetails(false)}
      />

      {/* ActionSheet для действий с задачей */}
      <MobileActionSheet 
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        actions={getTaskActions(selectedTaskForActions)}
      />
    </div>
  );
};

export default AnalysisTasksPage;