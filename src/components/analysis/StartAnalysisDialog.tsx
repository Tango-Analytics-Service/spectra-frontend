// src/components/analysis/StartAnalysisDialog.tsx - версия со скроллом
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import DialogContent from "@/components/ui/dialog/DialogContent";
import DialogDescription from "@/components/ui/dialog/DialogDescription";
import DialogFooter from "@/components/ui/dialog/DialogFooter";
import DialogHeader from "@/components/ui/dialog/DialogHeader";
import DialogTitle from "@/components/ui/dialog/DialogTitle";
import { Button } from "@/components/ui/button";
import { AnalysisOptions, ProcessingMode } from "@/types/analysis";
import { LoaderCircle, } from "lucide-react";
import FiltersList from "../filters/FiltersList";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
    createCardStyle,
    createButtonStyle,
    createTextStyle,
    typography,
    spacing,
    textColors,
} from "@/lib/design-system";
import { useFiltersStore } from "@/stores/useFiltersStore";

interface StartAnalysisDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStart: (filterIds: string[], options?: AnalysisOptions) => Promise<void>;
    setId: string;
    channelCount: number;
}

export default function StartAnalysisDialog({ open, onOpenChange, onStart, channelCount, }: StartAnalysisDialogProps) {
    const selectedFilters = useFiltersStore(state => state.selectedFilters);
    const toggleFilterSelection = useFiltersStore(state => state.toggleFilterSelection);
    const clearSelectedFilters = useFiltersStore(state => state.clearSelectedFilters);

    const [isStarting, setIsStarting] = useState(false);
    const [showFiltersList, setShowFiltersList] = useState(true);

    // Analysis options
    const [maxPosts, setMaxPosts] = useState(20);
    const [detailed, setDetailed] = useState(false);
    const [includeExamples, setIncludeExamples] = useState(false);
    const [processingMode, setProcessingMode] = useState<ProcessingMode>(
        ProcessingMode.BATCH,
    );

    // Clear selected filters when dialog closes
    useEffect(() => {
        if (!open) {
            // Small delay to avoid flash during closing animation
            setTimeout(() => {
                clearSelectedFilters();
                setShowFiltersList(true);
                // Reset options to defaults
                setMaxPosts(20);
                setDetailed(true);
                setIncludeExamples(true);
                setProcessingMode(ProcessingMode.DIRECT);
            }, 300);
        }
    }, [open, clearSelectedFilters]);

    const handleStartAnalysis = async () => {
        if (selectedFilters.length === 0) {
            toast({
                title: "Выберите фильтры",
                description: "Необходимо выбрать хотя бы один фильтр для анализа",
                variant: "destructive",
            });
            return;
        }

        setIsStarting(true);
        try {
            const options: AnalysisOptions = {
                max_posts: maxPosts,
                detailed,
                include_examples: includeExamples,
                processing_mode: processingMode,
            };

            await onStart(selectedFilters, options);
            onOpenChange(false);
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    createCardStyle(),
                    "sm:max-w-[750px] max-h-[80vh] flex flex-col p-0",
                )}
            >
                {/* Фиксированный заголовок */}
                <DialogHeader className={"p-6 pb-0 flex-shrink-0"}>
                    <DialogTitle className={typography.h3}>Запуск анализа</DialogTitle>
                    <DialogDescription className={textColors.secondary}>
                        Выберите фильтры и настройте параметры для анализа каналов
                    </DialogDescription>
                </DialogHeader>

                {/* Контент с правильным скроллом */}
                <div className="flex-1 overflow-auto px-6 pt-4">
                    {/* Selected filters count */}
                    <div className={`mb-${spacing.md}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span
                                    className={cn(
                                        typography.small,
                                        textColors.accent,
                                        `mr-${spacing.sm}`,
                                    )}
                                >
                                    Выбрано фильтров:
                                </span>
                                <span
                                    className={cn(
                                        typography.weight.semibold,
                                        "bg-blue-500/20",
                                        `px-${spacing.sm} py-${spacing.xs}`,
                                        "rounded-full",
                                        typography.small,
                                        textColors.accent,
                                    )}
                                >
                                    {selectedFilters.length}
                                </span>
                            </div>
                            <div className={createTextStyle("small", "secondary")}>
                                Каналов для анализа:{" "}
                                <span className={typography.weight.semibold}>
                                    {channelCount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filters content */}
                    {showFiltersList && (
                        <div className="space-y-4 pb-4">
                            <FiltersList
                                onSelectFilter={toggleFilterSelection}
                                selectedFilters={selectedFilters}
                                height="h-[400px]" // Фиксированная высота для внутреннего скролла
                            />
                        </div>
                    )}
                </div>

                {/* Фиксированный футер */}
                <DialogFooter className={`p-6 pt-4 flex-shrink-0 gap-${spacing.sm}`}>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className={createButtonStyle("secondary")}
                        disabled={isStarting}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleStartAnalysis}
                        className={createButtonStyle("primary")}
                        disabled={isStarting || selectedFilters.length === 0}
                    >
                        {isStarting ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className={`mr-${spacing.sm} animate-spin`}
                                />
                                Запуск анализа...
                            </>
                        ) : (
                            "Запустить анализ"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
