// src/components/analysis/AnalysisTab.tsx (обновленный)
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Play, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  components,
  typography,
  createCardStyle,
  createButtonStyle,
  createAlertStyle,
  animations,
  textColors,
  createTextStyle
} from "@/lib/design-system";
import {
  AnalysisOptions,
  AnalysisTask,
  AnalysisResultsForCard,
} from "@/types/analysis";
import { ChannelSet } from "@/types/channel-sets";
import StartAnalysisDialog from "./StartAnalysisDialog";
import AnalysisResultsCard from "./AnalysisResultsCard";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { useAnalysisTasks } from "@/contexts/AnalysisTasksContext"; // НОВЫЙ ИМПОРТ
import { toast } from "@/components/ui/use-toast";

interface AnalysisTabProps {
  channelSet: ChannelSet;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ channelSet }) => {
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const { analyzeChannelSet } = useChannelSets();
  
  // Используем контекст задач
  const {
    findTasksForChannelSet,
    refreshTask,
    fetchTasks,
  } = useAnalysisTasks();

  // Состояние для задачи этого набора каналов
  const [latestTask, setLatestTask] = useState<AnalysisTask | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  
  // Формируем объект результатов для компонента AnalysisResultsCard
  const analysisResults: AnalysisResultsForCard | null = latestTask && latestTask.results ? {
    results: latestTask.results,
    summary: latestTask.summary!,
    task_id: latestTask.id,
    status: latestTask.status,
    started_at: latestTask.created_at,
    completed_at: latestTask.completed_at || undefined,
    // channel_set может быть добавлен отдельно, если нужно
  } : null;

  // Загружаем задачи для данного набора каналов
  useEffect(() => {
    const loadLatestTask = async () => {
      setIsLoadingTask(true);
      try {
        await fetchTasks();
        
        // Пытаемся найти задачи для конкретного набора каналов
        const tasks = await findTasksForChannelSet(channelSet.id);
        
        if (tasks.length > 0) {
          const latest = tasks.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          setLatestTask(latest);
        } else {
          // Fallback: Если не можем найти задачи для конкретного набора,
          // показываем последнюю завершенную задачу пользователя
          const allDetails = Object.values(taskDetails);
          const completedTasks = allDetails.filter(task => 
            task.status === "completed" && task.results && task.results.length > 0
          );
          
          if (completedTasks.length > 0) {
            const latest = completedTasks.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
            setLatestTask(latest);
          }
        }
      } catch (error) {
        console.error("Error loading latest task:", error);
      } finally {
        setIsLoadingTask(false);
      }
    };

    loadLatestTask();
  }, [fetchTasks, findTasksForChannelSet, channelSet.id, taskDetails]);

  // Start new analysis
  const handleStartAnalysis = async (
    filterIds: string[],
    options?: AnalysisOptions,
  ) => {
    try {
      const response = await analyzeChannelSet(
        channelSet.id,
        filterIds,
        options,
      );

      if (response && response.success) {
        // Обновляем список задач после создания новой
        await fetchTasks(50, 0, undefined, true);
        
        // Перезагружаем задачи для этого набора
        const tasks = await findTasksForChannelSet(channelSet.id);
        if (tasks.length > 0) {
          const latest = tasks.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          setLatestTask(latest);
        }

        toast({
          title: "Анализ запущен",
          description: "Результаты анализа будут доступны в скором времени",
        });
      }
    } catch (error) {
      console.error("Error starting analysis:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось запустить анализ",
        variant: "destructive",
      });
    }
  };

  // Refresh task status
  const handleRefreshTask = async () => {
    if (!latestTask) return;
    
    await refreshTask(latestTask.id);
    
    // Обновляем локальное состояние
    const tasks = await findTasksForChannelSet(channelSet.id);
    if (tasks.length > 0) {
      const updated = tasks.find(t => t.id === latestTask.id);
      if (updated) {
        setLatestTask(updated);
      }
    }
  };

  return (
    <div className={cn("space-y-4", animations.fadeIn)}>
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={typography.h3}>Анализ каналов</h3>
          <p className={cn(createTextStyle("small", "secondary"))}>
            Проанализируйте каналы с помощью фильтров
          </p>
        </div>
        <Button
          onClick={() => setShowAnalysisDialog(true)}
          className={createButtonStyle("primary")}
        >
          <Play size={16} className="mr-2" />
          Запустить анализ
        </Button>
      </div>

      {/* Content */}
      <div>
        {isLoadingTask ? (
          // Loading state
          <Card className={createCardStyle()}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className={cn(textColors.accent,"h-12 w-12 animate-spin mb-4")}/>
                <h3 className={cn(typography.h3, "mb-2")}>Загрузка...</h3>
                <p className={cn(typography.small, "text-blue-300")}>
                  Проверяем наличие задач анализа для этого набора
                </p>
              </div>
            </CardContent>
          </Card>
        ) : latestTask && latestTask.results ? (
          // Analysis results
          <AnalysisResultsCard
            results={analysisResults!}
            onRefresh={
              latestTask.status !== "completed" ? handleRefreshTask : undefined
            }
            isRefreshing={false}
          />
        ) : latestTask && latestTask.status !== "completed" ? (
          // Task in progress
          <Card className={createCardStyle()}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className={cn(textColors.accent,"h-12 w-12 animate-spin mb-4")}/>
                <h3 className={cn(typography.h3, "mb-2")}>Анализ в процессе</h3>
                <p className={cn(typography.small, "text-blue-300 mb-4")}>
                  Мы анализируем каналы согласно выбранным фильтрам. Это может
                  занять некоторое время.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRefreshTask}
                    className={components.button.secondary}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Проверить статус
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('/analysis/tasks', '_blank')}
                    className={components.button.secondary}
                  >
                    <BarChart size={16} className="mr-2" />
                    Все задачи
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // No analysis yet
          <Card className={createCardStyle()}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <BarChart className="h-12 w-12 text-blue-400/50 mb-4" />
                <h3 className={cn(typography.h3, "mb-2")}>
                  Нет данных анализа
                </h3>
                <p className={cn(createTextStyle("small", "secondary"), "mb-4")}>
                  Запустите анализ, чтобы оценить каналы по выбранным фильтрам
                </p>
                <Button
                  onClick={() => setShowAnalysisDialog(true)}
                  className={createButtonStyle("primary")}
                >
                  <Play size={16} className="mr-2" />
                  Запустить анализ
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Display warning if channels are not all parsed */}
      {!channelSet.all_parsed && (
        <Alert className={cn(createAlertStyle("warning"))}>
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <AlertTitle className={cn(textColors.warning)}>Внимание</AlertTitle>
          <AlertDescription>
            Не все каналы в наборе обработаны. Результаты анализа могут быть
            неполными.
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis dialog */}
      <StartAnalysisDialog
        open={showAnalysisDialog}
        onOpenChange={setShowAnalysisDialog}
        onStart={handleStartAnalysis}
        setId={channelSet.id}
        channelCount={channelSet.channel_count}
      />
    </div>
  );
};

export default AnalysisTab;