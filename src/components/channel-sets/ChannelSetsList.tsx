import { motion } from "framer-motion";
import {
    Users,
    Calendar,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Loader2,
    Globe,
    Lock,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    components,
    gradients,
    typography,
    spacing,
    animations,
    createCardStyle,
    createBadgeStyle,
} from "@/lib/design-system";

export interface ChannelSetsListProps {
    channelSets: {
        id: string,
        name: string,
        description: string,
        is_predefined: boolean,
        is_public: boolean,
        updated_at: string,
        all_parsed: boolean,
        channel_count: number,
    }[],
    isLoading: boolean,
    selectedSetId: string,
    onSelectSet: (id: string) => void,
    onViewDetails: (id: string) => void,
    viewMode: string,
}

// Компонент только для отображения списка наборов каналов
export default function ChannelSetsList({
    channelSets,
    isLoading,
    selectedSetId,
    onSelectSet,
    onViewDetails,
    viewMode = "grid",
}: ChannelSetsListProps) {
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
    if (channelSets.length === 0) {
        return (
            <div
                className={cn(
                    createCardStyle(),
                    "flex flex-col items-center justify-center text-center",
                    `p-${spacing.xl}`,
                    animations.fadeIn,
                )}
            >
                <Users size={48} className="text-blue-400/50 mb-4" />
                <h3 className={cn(typography.h3, "mb-2")}>
                    У вас пока нет наборов каналов
                </h3>
                <p className={cn(typography.small, "text-gray-400 mb-4")}>
                    Нажмите &apos;Создать новый набор&apos;, чтобы начать
                </p>
            </div>
        );
    }

    // Render grid view
    if (viewMode === "grid") {
        return (
            <div
                className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                    `gap-${spacing.md}`,
                    animations.fadeIn,
                )}
            >
                {channelSets.map((set, index) => (
                    <motion.div
                        key={set.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cn(
                            createCardStyle(),
                            components.card.hover,
                            "overflow-hidden cursor-pointer",
                            selectedSetId === set.id
                                ? "border-blue-500/50"
                                : "border-slate-700/50",
                        )}
                        onClick={() => onSelectSet(set.id)}
                    >
                        <div className={`p-${spacing.md}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className={cn(typography.h4, "text-white mr-2")}>
                                            {set.name}
                                        </h3>
                                        {set.is_predefined && (
                                            <Star size={14} className="text-yellow-400" />
                                        )}
                                        {set.is_public ? (
                                            <Globe size={14} className="ml-1 text-blue-400" />
                                        ) : (
                                            <Lock size={14} className="ml-1 text-gray-400" />
                                        )}
                                    </div>
                                    <p
                                        className={cn(
                                            typography.small,
                                            "text-blue-300/70 mt-0.5 line-clamp-1",
                                        )}
                                    >
                                        {set.description}
                                    </p>
                                </div>

                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                                    <Users size={16} />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mt-3">
                                <div className="flex items-center text-blue-300/70">
                                    <Calendar size={12} className="mr-1" />
                                    <span>Обновлен: {formatDate(set.updated_at)}</span>
                                </div>

                                <div className="flex items-center">
                                    {set.all_parsed ? (
                                        <span
                                            className={cn(
                                                createBadgeStyle("success"),
                                                "flex items-center gap-1 text-[10px]",
                                            )}
                                        >
                                            <CheckCircle size={10} />
                                            <span>Готов</span>
                                        </span>
                                    ) : (
                                        <span
                                            className={cn(
                                                createBadgeStyle("warning"),
                                                "flex items-center gap-1 text-[10px]",
                                            )}
                                        >
                                            <AlertCircle size={10} />
                                            <span>Обработка</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center">
                                    <span className="text-sm text-blue-300/70">Каналов:</span>
                                    <span className="ml-1 font-semibold text-white">
                                        {set.channel_count}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        components.button.secondary,
                                        "px-2.5 py-1 text-xs rounded-lg flex items-center",
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewDetails(set.id);
                                    }}
                                >
                                    <span>Подробнее</span>
                                    <ArrowRight size={14} className="ml-1" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // Render list view
    return (
        <div className={cn(`space-y-${spacing.sm}`, animations.fadeIn)}>
            {channelSets.map((set, index) => (
                <motion.div
                    key={set.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                        "p-3 rounded-lg flex items-center cursor-pointer transition-all duration-200",
                        selectedSetId === set.id
                            ? "bg-gradient-to-r from-blue-600/10 to-blue-500/5 border border-blue-500/30"
                            : cn(createCardStyle(), "border-slate-700/50"),
                        "hover:border-blue-500/30",
                    )}
                    onClick={() => onSelectSet(set.id)}
                >
                    <div
                        className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white font-semibold shadow-lg shadow-blue-500/20",
                            gradients.primary,
                        )}
                    >
                        {set.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                            <div
                                className={cn(
                                    typography.weight.medium,
                                    "text-white truncate max-w-[80%]",
                                )}
                            >
                                {set.name}
                            </div>
                            {set.is_predefined && (
                                <Star size={12} className="ml-2 text-yellow-400" />
                            )}
                            {set.is_public ? (
                                <div
                                    className={cn(
                                        createBadgeStyle("primary"),
                                        "ml-2 flex items-center gap-1 text-[10px]",
                                    )}
                                >
                                    <Globe size={8} />
                                    <span>Публичный</span>
                                </div>
                            ) : null}
                        </div>
                        <div
                            className={cn("flex items-center text-gray-400", typography.tiny)}
                        >
                            <span className="truncate mr-2 max-w-[60%]">
                                {set.description}
                            </span>
                            <Users size={12} className="mr-1" />
                            <span>{set.channel_count}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className={cn(typography.tiny, "text-blue-300 whitespace-nowrap")}
                        >
                            {formatDate(set.updated_at)}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, x: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(components.button.secondary, "p-1.5 rounded-lg")}
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(set.id);
                            }}
                        >
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
