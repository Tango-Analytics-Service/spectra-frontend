import { useNavigate } from "react-router-dom";
import { ChannelsSet } from "@/channels-sets/types";
import { ArrowRight, Loader2, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/ui/components/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { createCardStyle, createTextStyle, createBadgeStyle, typography, spacing, animations, textColors } from "@/lib/design-system";

interface SmartSetsListProps {
    smartSets: ChannelsSet[];
    isLoading: boolean;
}

export default function SmartSetsList({ smartSets, isLoading }: SmartSetsListProps) {
    const navigate = useNavigate();

    // Format date to DD.MM.YYYY
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    // Render empty state
    if (smartSets.length === 0) {
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
                    У вас пока нет умных запросов
                </h3>
                <p className={cn(typography.small, "text-gray-400 mb-4")}>
                    Нажмите «Создать запрос», чтобы начать
                </p>
            </div>
        );
    }

    return (
        <div className={cn(`space-y-${spacing.sm}`, animations.fadeIn)}>
            {smartSets.map((set, index) => (
                <motion.div
                    key={set.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                        createCardStyle(),
                        "border-yellow-500/30 hover:border-yellow-500/50 transition-all",
                        "p-4",
                    )}
                >
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                            <Zap size={18} className="text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                                <h3 className={cn(typography.h4, "text-white mr-2")}>
                                    {set.name}
                                </h3>
                                {set.build_status && (
                                    <>
                                        {set.build_status === "building" && (
                                            <span
                                                className={cn(
                                                    createBadgeStyle("primary"),
                                                    "flex items-center gap-1 text-xs",
                                                )}
                                            >
                                                <Loader2 size={12} className="animate-spin" />
                                                <span>Построение</span>
                                            </span>
                                        )}
                                        {set.build_status === "completed" && set.all_parsed && (
                                            <span
                                                className={cn(
                                                    createBadgeStyle("success"),
                                                    "flex items-center gap-1 text-xs",
                                                )}
                                            >
                                                <CheckCircle size={12} />
                                                <span>Готов</span>
                                            </span>
                                        )}
                                        {set.build_status === "failed" && (
                                            <span
                                                className={cn(
                                                    createBadgeStyle("error"),
                                                    "flex items-center gap-1 text-xs",
                                                )}
                                            >
                                                <AlertCircle size={12} />
                                                <span>Ошибка</span>
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <p className={cn(createTextStyle("small", "muted"), "mt-1 mb-3")}>
                                {set.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className={createTextStyle("small", "secondary")}>
                                        {set.channel_count} каналов
                                    </span>
                                    <span className={createTextStyle("small", "muted")}>
                                        Обновлен: {formatDate(set.updated_at || set.created_at)}
                                    </span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigate(`/channel-sets/${set.id}`)}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                                >
                                    Подробнее
                                    <ArrowRight size={16} className="ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}