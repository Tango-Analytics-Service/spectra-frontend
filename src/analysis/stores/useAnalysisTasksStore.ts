import { toast } from "@/ui/components/use-toast";
import { analysisService } from "@/analysis/service";
import { AnalysisTask, AnalysisTaskBasic } from "@/analysis/types";
import { create } from "zustand";
import { LoadStatus } from "@/lib/types";

const AUTO_REFRESH_TIMEOUT = 60 * 1000;

export interface TaskDetailsRecord {
    loadStatus: LoadStatus;
    details: AnalysisTask | undefined;
}

export interface AnalysisTasksStore {
    tasks: AnalysisTaskBasic[]; // Базовый список задач
    tasksDetails: Record<string, TaskDetailsRecord>; // Кеш детальной информации
    loadStatus: LoadStatus;
    // Methods for managing tasks
    fetchTasks: (limit?: number, offset?: number, status?: string) => Promise<void>;
    fetchTaskDetails: (taskId: string) => Promise<AnalysisTask | null>;
    fetchTasksWithDetails: (limit?: number, offset?: number, status?: string) => Promise<void>;
    refreshTask: (taskId: string) => Promise<void>;
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
    loadStatus: "idle" as LoadStatus,
};

export const useAnalysisTasksStore = create<AnalysisTasksStore>((set, getState) => ({
    ...initialState,

    // Fetch all tasks
    fetchTasks: async (limit = 50, offset = 0, status?: string) => {
        set(state => ({ ...state, loadStatus: "pending" }));
        try {
            const response = await analysisService.getUserTasks(limit, offset, status);
            set(state => ({
                ...state,
                tasks: response.tasks,
                loadStatus: "success",
            }));
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить задачи анализа",
                variant: "destructive",
            });
            set(state => ({ ...state, loadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, loadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    // Fetch task details by ID
    fetchTaskDetails: async (taskId: string) => {
        set(state => ({
            ...state,
            tasksDetails: {
                ...state.tasksDetails,
                [taskId]: { loadStatus: "pending", details: state.tasksDetails[taskId]?.details },
            },
        }));
        try {
            const taskDetails = await analysisService.getUserTask(taskId);
            // Сохраняем детали в кеше
            set(state => ({
                ...state,
                tasksDetails: {
                    ...state.tasksDetails,
                    [taskId]: { loadStatus: "success", details: taskDetails },
                },
            }));
            return taskDetails;
        } catch (error) {
            console.error(`Error fetching task details ${taskId}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить детали задачи",
                variant: "destructive",
            });
            set(state => ({
                ...state,
                tasksDetails: {
                    ...state.tasksDetails,
                    [taskId]: { loadStatus: "error", details: undefined },
                },
            }));
            setTimeout(() => {
                set(state => ({
                    tasksDetails: {
                        ...state.tasksDetails,
                        [taskId]: { loadStatus: "idle", details: state.tasksDetails[taskId]?.details },
                    },
                }));
            }, AUTO_REFRESH_TIMEOUT);
            return null;
        }
    },

    fetchTasksWithDetails: async (limit = 50, offset = 0, status?: string) => {
        let state = getState();
        await state.fetchTasks(limit, offset, status);
        state = getState();
        const tasksWithoutDetailsList = state.tasks.filter(task => {
            const detailsRecord = state.tasksDetails[task.id];
            if (detailsRecord === undefined) {
                return true;
            }
            if (detailsRecord.loadStatus === "idle") {
                return true;
            }
            return false;
        });
        const tasksDetailsPromises = tasksWithoutDetailsList.map(task => state.fetchTaskDetails(task.id));
        // Fetch all tasks details at once
        await Promise.allSettled(tasksDetailsPromises);
    },

    // Refresh single task
    refreshTask: async (taskId: string) => {
        set(state => ({
            ...state,
            tasksDetails: {
                ...state.tasksDetails,
                [taskId]: { loadStatus: "pending", details: state.tasksDetails[taskId]?.details },
            },
        }));
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
                    [taskId]: { loadStatus: "success", details: updatedTaskDetails },
                },
            }));

            // Show success message if task completed
            if (updatedTaskDetails.status === "completed") {
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
            set(state => ({
                ...state,
                tasksDetails: {
                    ...state.tasksDetails,
                    [taskId]: { loadStatus: "error", details: undefined },
                },
            }));
            setTimeout(() => {
                set(state => ({
                    tasksDetails: {
                        ...state.tasksDetails,
                        [taskId]: { loadStatus: "idle", details: state.tasksDetails[taskId]?.details },
                    },
                }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    // Efficient method to find tasks for a specific channel set
    findTasksForChannelSet: async (channelSetId: string): Promise<AnalysisTask[]> => {
        const state = getState();
        // Сначала проверяем уже загруженные детали
        const existingRecords = Object.values(state.tasksDetails).filter(
            record => record.details.channel_set_id === channelSetId
        );

        // Если у нас есть детали для некоторых задач, возвращаем их
        if (existingRecords.length > 0) {
            return existingRecords.map(record => record.details);
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
            } else if (state.tasksDetails[task.id]?.details.channel_set_id === channelSetId) {
                channelSetTasks.push(state.tasksDetails[task.id]?.details);
            }
        }

        return channelSetTasks;
    },

    // Helper: Get tasks by channel set (только детальные)
    getTasksByChannelSet: (channelSetId: string): AnalysisTask[] => {
        const state = getState();
        return Object.values(state.tasksDetails)
            .filter(record => record.details.channel_set_id === channelSetId)
            .map(record => record.details);
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
