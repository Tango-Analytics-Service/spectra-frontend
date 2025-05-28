// src/components/analysis/WebAnalysisPage.tsx
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  typography,
  animations,
} from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Filter,
  Play,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analysisService } from "@/services/analysisService";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import StartAnalysisDialog from "./StartAnalysisDialog";
import AnalysisResultsCard from "./AnalysisResultsCard";
import { LoadingSpinner } from "@/components/ui/loading";

const WebAnalysisPage: React.FC = () => {
  const { channelSets, isLoading: isChannelSetsLoading } = useChannelSets();
  const [selectedSetId, setSelectedSetId] = useState("");
  const [selectedSet, setSelectedSet] = useState(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [latestTask, setLatestTask] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);

  useEffect(() => {
    if (channelSets.length > 0 && !selectedSetId) {
      setSelectedSetId(channelSets[0].id);
      setSelectedSet(channelSets[0]);
    }
  }, [channelSets, selectedSetId]);

  useEffect(() => {
    if (selectedSetId) {
      const set = channelSets.find((set) => set.id === selectedSetId);
      if (set) {
        setSelectedSet(set);
        loadLatestTask(selectedSetId);
      }
    }
  }, [selectedSetId, channelSets]);

  const loadLatestTask = async (setId) => {
    setIsLoading(true);
    try {
      // Get all tasks for the user
      const tasksResponse = await analysisService.getUserTasks(10, 0);

      // Find the latest task for this channel set
      const channelSetTasks = tasksResponse.tasks
        .filter((task) => task.channel_set_id === setId)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

      if (channelSetTasks.length > 0) {
        const task = channelSetTasks[0];
        setLatestTask(task);

        // If the task is completed, load the results
        if (task.status === "completed" && task.results) {
          setAnalysisResults(task.results);
        }
      } else {
        setLatestTask(null);
        setAnalysisResults(null);
      }
    } catch (error) {
      console.error("Error loading latest analysis task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAnalysis = async (filterIds, options) => {
    try {
      const response = await analysisService.analyzeChannels(
        [], // This would be the channels from the selected set
        filterIds,
        options,
      );

      if (response && response.success) {
        // Load the new task
        const task = await analysisService.getUserTask(response.task_id);
        setLatestTask(task);
        setShowAnalysisDialog(false);
      }
    } catch (error) {
      console.error("Error starting analysis:", error);
    }
  };

  const handleRefreshTask = async () => {
    if (!latestTask) return;

    try {
      const updatedTask = await analysisService.getUserTask(latestTask.id);
      setLatestTask(updatedTask);

      if (updatedTask.status === "completed" && updatedTask.results) {
        setAnalysisResults(updatedTask.results);
      }
    } catch (error) {
      console.error("Error refreshing task:", error);
    }
  };

  return (
    <div className={cn("container mx-auto", animations.fadeIn)}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={typography.h1}>Анализ каналов</h1>
          <p className={cn(typography.small, "text-gray-300 mt-1")}>
            Проанализируйте каналы с помощью фильтров и получите детальные
            отчеты
          </p>
        </div>
        <Button
          className="bg-[#4395d3] hover:bg-[#3a80b9] text-white"
          onClick={() => setShowAnalysisDialog(true)}
        >
          <Play size={16} className="mr-2" />
          Запустить анализ
        </Button>
      </div>

      {/* Channel set selector */}
      <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium mb-1">
                Выберите набор для анализа
              </h3>
              <p className="text-sm text-gray-400">
                Выберите набор каналов, который хотите проанализировать
              </p>
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full p-2 bg-[#041331] border border-blue-900/30 rounded-md text-white"
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
                disabled={isChannelSetsLoading}
              >
                {isChannelSetsLoading ? (
                  <option>Загрузка...</option>
                ) : channelSets.length > 0 ? (
                  channelSets.map((set) => (
                    <option key={set.id} value={set.id}>
                      {set.name}
                    </option>
                  ))
                ) : (
                  <option>Нет доступных наборов</option>
                )}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-8 flex justify-center">
                <LoadingSpinner size="lg" />
              </CardContent>
            </Card>
          ) : latestTask && analysisResults ? (
            <AnalysisResultsCard
              results={analysisResults}
              onRefresh={
                latestTask.status !== "completed"
                  ? handleRefreshTask
                  : undefined
              }
            />
          ) : latestTask && latestTask.status !== "completed" ? (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <RefreshCw className="h-12 w-12 animate-spin text-[#4395d3] mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Анализ в процессе
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Мы анализируем каналы согласно выбранным фильтрам. Это может
                    занять некоторое время.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRefreshTask}
                    className="border-[#4395d3]/20 text-[#4395d3] hover:bg-[#4395d3]/10"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Проверить статус
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <BarChart className="h-12 w-12 text-[#4395d3]/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Нет данных анализа
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Запустите анализ, чтобы оценить каналы по выбранным фильтрам
                  </p>
                  <Button
                    onClick={() => setShowAnalysisDialog(true)}
                    className="bg-[#4395d3] hover:bg-[#3a80b9] text-white"
                  >
                    <Play size={16} className="mr-2" />
                    Запустить анализ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Display warning if channels are not all parsed */}
          {selectedSet && !selectedSet.all_parsed && (
            <Alert className="bg-amber-500/10 border-amber-500/20 mt-4">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertTitle className="text-amber-400">Внимание</AlertTitle>
              <AlertDescription>
                Не все каналы в наборе обработаны. Результаты анализа могут быть
                неполными.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20 sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5 text-[#4395d3]" />
                Выбранные фильтры
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestTask && latestTask.filter_ids ? (
                <div className="space-y-3">
                  {latestTask.filter_ids.map((filterId, index) => (
                    <div
                      key={filterId}
                      className="p-3 bg-[#041331] border border-blue-900/30 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-[#4395d3] mr-2"></div>
                        <span>Фильтр {index + 1}</span>
                      </div>
                      <span className="text-xs text-gray-400">{filterId}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <p>Нет выбранных фильтров</p>
                  <p className="text-sm mt-2">
                    Запустите анализ, чтобы выбрать фильтры
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-blue-900/30">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Статистика анализа
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#041331] border border-blue-900/30 rounded-md">
                    <div className="text-xs text-gray-400">Всего анализов</div>
                    <div className="text-lg font-medium">12</div>
                  </div>
                  <div className="p-3 bg-[#041331] border border-blue-900/30 rounded-md">
                    <div className="text-xs text-gray-400">За сегодня</div>
                    <div className="text-lg font-medium">3</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis dialog */}
      <StartAnalysisDialog
        open={showAnalysisDialog}
        onOpenChange={setShowAnalysisDialog}
        onStart={handleStartAnalysis}
        setId={selectedSetId}
        channelCount={selectedSet?.channel_count || 0}
      />
    </div>
  );
};

export default WebAnalysisPage;
