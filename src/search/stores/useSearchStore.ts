import { create } from "zustand";
import { searchService } from "../service";
import { SearchSession, SearchRequest } from "../types";
import { toast } from "@/ui/components/use-toast";

interface SearchStoreState {
    sessions: SearchSession[];
    totalCount: number;
    loadStatus: "idle" | "pending" | "success" | "error";
    fetchSessions: () => Promise<void>;
    startSearch: (request: SearchRequest) => Promise<string | null>;
    refreshSession: (sessionId: string) => Promise<void>;
    getSession: (sessionId: string) => Promise<SearchSession | null>; // Add this line
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
    sessions: [],
    totalCount: 0,
    loadStatus: "idle",

    fetchSessions: async () => {
        set({ loadStatus: "pending" });
        try {
            const response = await searchService.getAllSearchSessions();
            set({ 
                sessions: response.searches, 
                totalCount: response.count,
                loadStatus: "success" 
            });
        } catch (error) {
            console.error("Failed to fetch search sessions:", error);
            set({ loadStatus: "error" });
        }
    },

    startSearch: async (request: SearchRequest) => {
        try {
            const response = await searchService.startSearch(request);
            if (response.success) {
                toast({
                    title: "Поиск запущен",
                    description: "Отслеживайте прогресс в разделе 'Мои запросы'",
                });
                // Refresh the list to include the new session
                await get().fetchSessions();
                return response.search_session_id;
            }
            return null;
        } catch (error) {
            console.error("Failed to start search:", error);
            
            // Try to parse the error message as JSON
            try {
                const errorData = JSON.parse(error.message);
                
                // Check if it's an insufficient credits error
                if (errorData?.error_code === "INSUFFICIENT_CREDITS") {
                    const requiredCredits = errorData?.details?.required_credits || 0;
                    const availableCredits = errorData?.details?.available_credits || 0;
                    const shortage = errorData?.details?.shortage || 0;
                    
                    toast({
                        title: "Недостаточно кредитов",
                        description: `Для этой операции требуется ${requiredCredits} кредитов. У вас доступно: ${availableCredits}. Не хватает: ${shortage} кредитов.`,
                        variant: "destructive"
                    });
                    return null;
                } else {
                    // Other API errors
                    toast({
                        title: "Ошибка",
                        description: errorData?.message || "Не удалось запустить поиск.",
                        variant: "destructive",
                    });
                    return null;
                }
            } catch (parseError) {
                // If parsing fails, check if error object has the data directly
                const errorData = error?.response?.data || error?.data || error;
                
                if (errorData?.error_code === "INSUFFICIENT_CREDITS") {
                    const requiredCredits = errorData?.details?.required_credits || 0;
                    const availableCredits = errorData?.details?.available_credits || 0;
                    const shortage = errorData?.details?.shortage || 0;
                    
                    toast({
                        title: "Недостаточно кредитов",
                        description: `Для этой операции требуется ${requiredCredits} кредитов. У вас доступно: ${availableCredits}. Не хватает: ${shortage} кредитов.`,
                        variant: "destructive"
                    });
                    return null;
                }
                
                // Generic fallback error
                toast({
                    title: "Ошибка",
                    description: "Не удалось запустить поиск.",
                    variant: "destructive",
                });
                return null;
            }
        }
    },

    refreshSession: async (sessionId: string) => {
        try {
            const updatedSession = await searchService.getSearchResults(sessionId);
            set(state => ({
                sessions: state.sessions.map(s => 
                    s.search_session_id === sessionId ? updatedSession : s
                ),
            }));
        } catch (error) {
            console.error(`Failed to refresh session ${sessionId}:`, error);
        }
    },

    // Add this new function to the store
    getSession: async (sessionId: string): Promise<SearchSession | null> => {
        try {
            const session = await searchService.getSearchResults(sessionId);
            return session;
        } catch (error) {
            console.error(`Failed to fetch session ${sessionId}:`, error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить данные по этому запросу.",
                variant: "destructive",
            });
            return null;
        }
    },
}));