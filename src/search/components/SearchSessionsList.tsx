import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { typography, spacing, animations } from "@/lib/design-system";
import { SearchSession } from "../types";
import SearchSessionCard from "./SearchSessionCard";

interface SearchSessionsListProps {
    sessions: SearchSession[];
    isLoading: boolean;
    onSessionSelect: (session: SearchSession) => void;
}

export default function SearchSessionsList({ sessions, isLoading, onSessionSelect }: SearchSessionsListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center text-center",
                    `p-${spacing.xl}`,
                    animations.fadeIn,
                )}
            >
                <Zap size={48} className="text-yellow-400/50 mb-4" />
                <h3 className={cn(typography.h3, "mb-2")}>
                    У вас пока нет запросов
                </h3>
                <p className={cn(typography.small, "text-gray-400 mb-4")}>
                    Нажмите «Создать запрос», чтобы начать
                </p>
            </div>
        );
    }

    return (
        <div className={cn(`space-y-${spacing.md}`, animations.fadeIn, "h-full overflow-y-auto")}>
            {sessions.map((session, index) => (
                <motion.div
                    key={session.search_session_id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <SearchSessionCard session={session} onSelect={onSessionSelect} />
                </motion.div>
            ))}
        </div>
    );
}