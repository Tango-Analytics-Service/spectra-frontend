// src/components/analysis/AnalysisTab.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Filter, Play, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FilterProvider, useFilters } from "@/contexts/FilterContext";
import { analysisService } from "@/services/analysisService";
import {
  AnalysisOptions,
  AnalysisResults,
  AnalysisTask,
} from "@/types/analysis";
import { ChannelSet } from "@/types/channel-sets";
import StartAnalysisDialog from "./StartAnalysisDialog";
import AnalysisResultsCard from "./AnalysisResultsCard";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { toast } from "@/components/ui/use-toast";

interface AnalysisTabProps {
  channelSet: ChannelSet;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ channelSet }) => {
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latestTask, setLatestTask] = useState<AnalysisTask | null>(null);
  const [analysisResults, setAnalysisResults] =
    useState<AnalysisResults | null>(null);
  const { analyzeChannelSet } = useChannelSets();

  // Load latest analysis task for this channel set
  useEffect(() => {
    const loadLatestTask = async () => {
      setIsLoading(true);
      try {
        // Get all tasks for the user
        const tasksResponse = await analysisService.getUserTasks(10, 0);

        // Find the latest task for this channel set
        const channelSetTasks = tasksResponse.tasks
          .filter((task) => task.channel_set_id === channelSet.id)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );

        if (channelSetTasks.length > 0) {
          const task = channelSetTasks[0];
          setLatestTask(task);

          // If the task is completed, load the results
          if (task.status === "completed" && task.results) {
            setAnalysisResults(task.results);
          }
        }
      } catch (error) {
        console.error("Error loading latest analysis task:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (channelSet.id) {
      loadLatestTask();
    }
  }, [channelSet.id]);

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
        // Load the new task
        const task = await analysisService.getUserTask(response.task_id);
        setLatestTask(task);

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

    setIsRefreshing(true);
    try {
      const updatedTask = await analysisService.getUserTask(latestTask.id);
      setLatestTask(updatedTask);

      if (updatedTask.status === "completed" && updatedTask.results) {
        setAnalysisResults(updatedTask.results);
      }
    } catch (error) {
      console.error("Error refreshing task:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with action buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Анализ каналов</h3>
          <p className="text-sm text-blue-300">
            Проанализируйте каналы с помощью фильтров
          </p>
        </div>
        <Button
          onClick={() => setShowAnalysisDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          <Play size={16} className="mr-2" />
          Запустить анализ
        </Button>
      </div>

      {/* Content */}
      <div>
        {isLoading ? (
          // Loading state
          <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardContent className="p-8 flex justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
            </CardContent>
          </Card>
        ) : latestTask && analysisResults ? (
          // Analysis results
          <AnalysisResultsCard
            results={analysisResults}
            onRefresh={
              latestTask.status !== "completed" ? handleRefreshTask : undefined
            }
            isRefreshing={isRefreshing}
          />
        ) : latestTask && latestTask.status !== "completed" ? (
          // Task in progress
          <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-12 w-12 animate-spin text-blue-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Анализ в процессе</h3>
                <p className="text-sm text-blue-300 mb-4">
                  Мы анализируем каналы согласно выбранным фильтрам. Это может
                  занять некоторое время.
                </p>
                <Button
                  variant="outline"
                  onClick={handleRefreshTask}
                  disabled={isRefreshing}
                  className="border-blue-500/20 text-blue-300"
                >
                  {isRefreshing ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <RefreshCw size={16} className="mr-2" />
                  )}
                  Проверить статус
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // No analysis yet
          <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <BarChart className="h-12 w-12 text-blue-400/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Нет данных анализа</h3>
                <p className="text-sm text-blue-300 mb-4">
                  Запустите анализ, чтобы оценить каналы по выбранным фильтрам
                </p>
                <Button
                  onClick={() => setShowAnalysisDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
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
        <Alert className="bg-amber-500/10 border-amber-500/20">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-amber-400">Внимание</AlertTitle>
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
