// src/components/analysis/StartAnalysisDialog.tsx - версия со скроллом
import { useState, useEffect } from "react";
import { Dialog } from "@/ui/components/dialog";
import DialogContent from "@/ui/components/dialog/DialogContent";
import DialogDescription from "@/ui/components/dialog/DialogDescription";
import DialogFooter from "@/ui/components/dialog/DialogFooter";
import DialogHeader from "@/ui/components/dialog/DialogHeader";
import DialogTitle from "@/ui/components/dialog/DialogTitle";
import { Button } from "@/ui/components/button";
import { AnalysisOptions, ProcessingMode } from "@/analysis/types";
import { LoaderCircle, } from "lucide-react";
import FiltersList from "@/filters/components/FiltersList";
import { toast } from "@/ui/components/use-toast";
import { cn } from "@/lib/cn";
import { createCardStyle, createButtonStyle, createTextStyle, typography, spacing, textColors } from "@/lib/design-system";
import { useFiltersStore } from "@/filters/stores/useFiltersStore";

export interface StartAnalysisDialogProps {
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
                {/* Header */}
                <DialogTitle className={"p-6 pb-0 flex-shrink-0"}>
                    Запуск анализа
                </DialogTitle>

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
                            />
                        </div>
                    )}

                    {/* Footer */}
                    <div className={`flex flex-col-reverse pt-4 pb-6 flex-shrink-0 gap-${spacing.sm}`}>
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
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
};
