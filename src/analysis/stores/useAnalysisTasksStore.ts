import { toast } from "@/ui/components/use-toast";
import { analysisService } from "@/analysis/service";
import { AnalysisTask, AnalysisTaskBasic } from "@/analysis/types";
import { create } from "zustand";

export interface AnalysisTasksStore {
    tasks: AnalysisTaskBasic[]; // Базовый список задач
    tasksDetails: Record<string, AnalysisTask>; // Кеш детальной информации
    isLoaded: boolean;
    selectedTask: AnalysisTask | null;
    lastFetched: number;
    // Methods for managing tasks
    fetchTasks: (limit?: number, offset?: number, status?: string, forceRefresh?: boolean) => Promise<void>;
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

const initialState = {
    tasks: [],
    tasksDetails: {},
    isLoaded: false,
    selectedTask: null,
    lastFetched: 0,
};

export const useAnalysisTasksStore = create<AnalysisTasksStore>((set, getState) => ({
    ...initialState,

    // Fetch task details by ID
    fetchTaskDetails: async (taskId: string) => {
        const state = getState();
        try {
            const taskDetails = await analysisService.getUserTask(taskId);

            // Сохраняем детали в кеше
            set(state => ({ ...state, [taskId]: taskDetails }));

            // Если это выбранная задача, обновляем её
            if (state.selectedTask?.id === taskId) {
                set(state => ({ ...state, selectedTask: taskDetails }));
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

    // Fetch all tasks
    fetchTasks: async (limit = 50, offset = 0, status?: string, forceRefresh = false) => {
        const state = getState();
        // Cache control - refetch if more than 1 minute has passed or force refresh
        const now = Date.now();
        if (!forceRefresh && state.tasks.length > 0 && now - state.lastFetched < 60000) {
            return;
        }
        try {
            const response = await analysisService.getUserTasks(limit, offset, status);
            set(state => ({
                ...state,
                lastFetched: now,
                tasks: response.tasks,
            }));

            // Auto-select first completed task if none selected
            if (!state.selectedTask && response.tasks.length > 0) {
                const completedTask = response.tasks.find(task => task.status === "completed");
                if (completedTask) {
                    // Загружаем детали для автовыбранной задачи
                    const details = await state.fetchTaskDetails(completedTask.id);
                    if (details && details.results && details.results.length > 0) {
                        set(state => ({ ...state, selectedTask: details }));
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
            set(state => ({ ...state, isLoaded: true }));
        }
    },


    // Refresh single task
    refreshTask: async (taskId: string) => {
        const state = getState();
        try {
            const updatedTaskDetails = await analysisService.getUserTask(taskId);

            set(state => ({
                ...state,
                // Обновляем базовую информацию в списке задач
                tasks: state.tasks.map(task =>
                    task.id === taskId ? {
                        id: updatedTaskDetails.id,
                        status: updatedTaskDetails.status,
                        progress: updatedTaskDetails.progress || 0,
                        created_at: updatedTaskDetails.created_at,
                        updated_at: updatedTaskDetails.updated_at,
                        completed_at: updatedTaskDetails.completed_at,
                        error: updatedTaskDetails.error,
                    } : task),
                // Обновляем детали в кеше
                tasksDetails: {
                    ...state.tasksDetails,
                    [taskId]: updatedTaskDetails,
                },
            }));

            // Update selected task if it matches
            if (state.selectedTask?.id === taskId) {
                set(state => ({ ...state, selectedTask: updatedTaskDetails }));
            }

            // Show success message if task completed
            if (updatedTaskDetails.status === "completed" && state.selectedTask?.status !== "completed") {
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

    setSelectedTask(task: AnalysisTask) {
        set(state => ({ ...state, selectedTask: task }));
    },

    // Efficient method to find tasks for a specific channel set
    findTasksForChannelSet: async (channelSetId: string): Promise<AnalysisTask[]> => {
        const state = getState();
        // Сначала проверяем уже загруженные детали
        const existingTasks = Object.values(state.tasksDetails).filter(
            task => task.channel_set_id === channelSetId
        );

        // Если у нас есть детали для некоторых задач, возвращаем их
        if (existingTasks.length > 0) {
            return existingTasks;
        }

        // Если деталей нет, попробуем загрузить детали для последних нескольких задач
        // (так как API не позволяет фильтровать по channel_set_id)
        const recentTasks = state.tasks
            .filter(task => task.status === "completed" || task.status === "processing")
            .slice(0, 10); // берем только последние 10 задач

        const channelSetTasks: AnalysisTask[] = [];

        for (const task of recentTasks) {
            if (!state.tasksDetails[task.id]) {
                try {
                    const details = await state.fetchTaskDetails(task.id);
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
            } else if (state.tasksDetails[task.id].channel_set_id === channelSetId) {
                channelSetTasks.push(state.tasksDetails[task.id]);
            }
        }

        return channelSetTasks;
    },

    // Select task by ID
    selectTaskById: async (taskId: string) => {
        const state = getState();
        // Проверяем, есть ли детали в кеше
        const cachedDetails = state.tasksDetails[taskId];
        if (cachedDetails) {
            set(state => ({ ...state, selsectedTask: cachedDetails }));
            return;
        }

        // Если деталей нет, загружаем их
        const details = await state.fetchTaskDetails(taskId);
        if (details) {
            state.setSelectedTask(details);
        }
    },

    // Helper: Get tasks by channel set (только детальные)
    getTasksByChannelSet: (channelSetId: string): AnalysisTask[] => {
        const state = getState();
        return Object.values(state.tasksDetails).filter(task => task.channel_set_id === channelSetId);
    },

    // Helper: Get latest task for channel set (с автозагрузкой)
    getLatestTaskForChannelSet: async (channelSetId: string) => {
        const state = getState();
        const channelSetTasks = await state.findTasksForChannelSet(channelSetId);
        if (channelSetTasks.length === 0) return null;

        return channelSetTasks.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
    },

    // Helper: Get tasks by status (базовые)
    getTasksByStatus: (status: string) => {
        const state = getState();
        return state.tasks.filter(task => task.status === status);
    },
}));
