// src/contexts/AnalysisTasksContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { analysisService } from "@/services/analysisService";
import { toast } from "@/components/ui/use-toast";
import { AnalysisTask, AnalysisTaskBasic } from "@/types/analysis";

interface AnalysisTasksContextType {
    tasks: AnalysisTaskBasic[]; // Базовый список задач
    taskDetails: Record<string, AnalysisTask>; // Кеш детальной информации
    isLoading: boolean;
    selectedTask: AnalysisTask | null;
    // Methods for managing tasks
    fetchTasks: (
        limit?: number,
        offset?: number,
        status?: string,
        forceRefresh?: boolean,
    ) => Promise<void>;
    fetchTaskDetails: (taskId: string) => Promise<AnalysisTask | null>;
    refreshTask: (taskId: string) => Promise<void>;
    setSelectedTask: (task: AnalysisTask | null) => void;
    selectTaskById: (taskId: string) => Promise<void>;
    // Efficient method to find and load tasks for a channel set
    findTasksForChannelSet: (channelSetId: string) => Promise<AnalysisTask[]>;
    // Helper methods
    getTasksByChannelSet: (channelSetId: string) => AnalysisTask[];
    getLatestTaskForChannelSet: (channelSetId: string) => Promise<AnalysisTask | null>;
    getTasksByStatus: (status: string) => AnalysisTaskBasic[];
}

const AnalysisTasksContext = createContext<AnalysisTasksContextType | undefined>(
    undefined,
);

export const AnalysisTasksProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // State
    const [tasks, setTasks] = useState<AnalysisTaskBasic[]>([]); // Базовый список
    const [taskDetails, setTaskDetails] = useState<Record<string, AnalysisTask>>({}); // Кеш деталей
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<AnalysisTask | null>(null);
    const [lastFetched, setLastFetched] = useState<number>(0);

    // Fetch task details by ID
    const fetchTaskDetails = useCallback(
        async (taskId: string): Promise<AnalysisTask | null> => {
            try {
                const taskDetails = await analysisService.getUserTask(taskId);

                // Сохраняем детали в кеше
                setTaskDetails(prev => ({
                    ...prev,
                    [taskId]: taskDetails
                }));

                // Если это выбранная задача, обновляем её
                if (selectedTask?.id === taskId) {
                    setSelectedTask(taskDetails);
                }

                return taskDetails;
            } catch (error) {
                console.error(`Error fetching task details ${taskId}:`, error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить детали задачи",
                    variant: "destructive",
                });
                return null;
            }
        },
        [selectedTask],
    );

    // Fetch all tasks
    const fetchTasks = useCallback(
        async (
            limit = 50,
            offset = 0,
            status?: string,
            forceRefresh = false,
        ) => {
            // Cache control - refetch if more than 1 minute has passed or force refresh
            const now = Date.now();
            if (!forceRefresh && tasks.length > 0 && now - lastFetched < 60000) {
                return;
            }

            setIsLoading(true);
            try {
                const response = await analysisService.getUserTasks(limit, offset, status);
                setTasks(response.tasks);
                setLastFetched(now);

                // Auto-select first completed task if none selected
                if (!selectedTask && response.tasks.length > 0) {
                    const completedTask = response.tasks.find(task => task.status === "completed");
                    if (completedTask) {
                        // Загружаем детали для автовыбранной задачи
                        const details = await fetchTaskDetails(completedTask.id);
                        if (details && details.results && details.results.length > 0) {
                            setSelectedTask(details);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить задачи анализа",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [tasks.length, lastFetched, selectedTask, fetchTaskDetails],
    );


    // Refresh single task
    const refreshTask = useCallback(
        async (taskId: string) => {
            try {
                const updatedTaskDetails = await analysisService.getUserTask(taskId);

                // Обновляем базовую информацию в списке задач
                setTasks(prev => prev.map(task =>
                    task.id === taskId ? {
                        id: updatedTaskDetails.id,
                        status: updatedTaskDetails.status,
                        progress: updatedTaskDetails.progress || 0,
                        created_at: updatedTaskDetails.created_at,
                        updated_at: updatedTaskDetails.updated_at,
                        completed_at: updatedTaskDetails.completed_at,
                        error: updatedTaskDetails.error,
                    } : task
                ));

                // Обновляем детали в кеше
                setTaskDetails(prev => ({
                    ...prev,
                    [taskId]: updatedTaskDetails
                }));

                // Update selected task if it matches
                if (selectedTask?.id === taskId) {
                    setSelectedTask(updatedTaskDetails);
                }

                // Show success message if task completed
                if (updatedTaskDetails.status === "completed" && selectedTask?.status !== "completed") {
                    toast({
                        title: "Задача завершена",
                        description: "Результаты анализа готовы",
                    });
                }
            } catch (error) {
                console.error(`Error refreshing task ${taskId}:`, error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось обновить задачу",
                    variant: "destructive",
                });
            }
        },
        [selectedTask],
    );

    // Efficient method to find tasks for a specific channel set
    const findTasksForChannelSet = useCallback(
        async (channelSetId: string): Promise<AnalysisTask[]> => {
            // Сначала проверяем уже загруженные детали
            const existingTasks = Object.values(taskDetails).filter(
                task => task.channel_set_id === channelSetId
            );

            // Если у нас есть детали для некоторых задач, возвращаем их
            if (existingTasks.length > 0) {
                return existingTasks;
            }

            // Если деталей нет, попробуем загрузить детали для последних нескольких задач
            // (так как API не позволяет фильтровать по channel_set_id)
            const recentTasks = tasks
                .filter(task => task.status === "completed" || task.status === "processing")
                .slice(0, 10); // берем только последние 10 задач

            const channelSetTasks: AnalysisTask[] = [];

            for (const task of recentTasks) {
                if (!taskDetails[task.id]) {
                    try {
                        const details = await fetchTaskDetails(task.id);
                        if (details) {
                            // Проверяем channel_set_id, если он есть
                            if (details.channel_set_id === channelSetId) {
                                channelSetTasks.push(details);
                            }
                            // Если channel_set_id отсутствует, можно попробовать другие способы связывания
                            // Например, по времени создания или другим критериям
                        }
                    } catch {
                        console.warn(`Failed to load details for task ${task.id}`);
                    }
                } else if (taskDetails[task.id].channel_set_id === channelSetId) {
                    channelSetTasks.push(taskDetails[task.id]);
                }
            }

            return channelSetTasks;
        },
        [tasks, taskDetails, fetchTaskDetails],
    );

    // Select task by ID
    const selectTaskById = useCallback(
        async (taskId: string) => {
            // Проверяем, есть ли детали в кеше
            const cachedDetails = taskDetails[taskId];
            if (cachedDetails) {
                setSelectedTask(cachedDetails);
                return;
            }

            // Если деталей нет, загружаем их
            const details = await fetchTaskDetails(taskId);
            if (details) {
                setSelectedTask(details);
            }
        },
        [taskDetails, fetchTaskDetails],
    );

    // Helper: Get tasks by channel set (только детальные)
    const getTasksByChannelSet = useCallback(
        (channelSetId: string): AnalysisTask[] => {
            return Object.values(taskDetails).filter(task => task.channel_set_id === channelSetId);
        },
        [taskDetails],
    );

    // Helper: Get latest task for channel set (с автозагрузкой)
    const getLatestTaskForChannelSet = useCallback(
        async (channelSetId: string): Promise<AnalysisTask | null> => {
            const channelSetTasks = await findTasksForChannelSet(channelSetId);
            if (channelSetTasks.length === 0) return null;

            return channelSetTasks.sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
        },
        [findTasksForChannelSet],
    );

    // Helper: Get tasks by status (базовые)
    const getTasksByStatus = useCallback(
        (status: string): AnalysisTaskBasic[] => {
            return tasks.filter(task => task.status === status);
        },
        [tasks],
    );

    // Context value
    const value: AnalysisTasksContextType = {
        tasks,
        taskDetails,
        isLoading,
        selectedTask,
        fetchTasks,
        fetchTaskDetails,
        refreshTask,
        setSelectedTask,
        selectTaskById,
        findTasksForChannelSet,
        getTasksByChannelSet,
        getLatestTaskForChannelSet,
        getTasksByStatus,
    };

    return (
        <AnalysisTasksContext.Provider value={value}>
            {children}
        </AnalysisTasksContext.Provider>
    );
};

export const useAnalysisTasks = () => {
    const context = useContext(AnalysisTasksContext);
    if (context === undefined) {
        throw new Error("useAnalysisTasks must be used within an AnalysisTasksProvider");
    }
    return context;
};
