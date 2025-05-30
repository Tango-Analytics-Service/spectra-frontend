// src/components/analysis/StartAnalysisDialog.tsx - улучшенная версия с design-system
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilters } from "@/contexts/FilterContext";
import { AnalysisOptions, ProcessingMode } from "@/types/analysis";
import { FilterIcon, LoaderCircle, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FiltersList from "../filters/FiltersList";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  createCardStyle,
  createButtonStyle,
  createTextStyle,
  typography,
  spacing,
  components,
  animations,
  textColors,
} from "@/lib/design-system";

interface StartAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (filterIds: string[], options?: AnalysisOptions) => Promise<void>;
  setId: string;
  channelCount: number;
}

const StartAnalysisDialog: React.FC<StartAnalysisDialogProps> = ({
  open,
  onOpenChange,
  onStart,
  setId,
  channelCount,
}) => {
  const { selectedFilters, toggleFilterSelection, clearSelectedFilters } =
    useFilters();
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
          "sm:max-w-[750px] max-h-[90vh] overflow-hidden flex flex-col",
        )}
      >
        <DialogHeader>
          <DialogTitle className={typography.h3}>Запуск анализа</DialogTitle>
          <DialogDescription className={textColors.secondary}>
            Выберите фильтры и настройте параметры для анализа каналов
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs for selections */}
          <div className={cn("flex border-b border-slate-700", `mb-${spacing.md}`)}>
            <Button
              variant="ghost"
              className={cn(
                `pb-${spacing.sm} px-${spacing.md}`,
                "rounded-none",
                showFiltersList
                  ? cn(textColors.accent, "border-b-2 border-blue-400")
                  : textColors.muted,
              )}
              onClick={() => setShowFiltersList(true)}
            >
              <FilterIcon size={16} className={`mr-${spacing.sm}`} />
              Выбор фильтров
            </Button>
            <Button
              variant="ghost"
              className={cn(
                `pb-${spacing.sm} px-${spacing.md}`,
                "rounded-none",
                !showFiltersList
                  ? cn(textColors.accent, "border-b-2 border-blue-400")
                  : textColors.muted,
              )}
              onClick={() => setShowFiltersList(false)}
            >
              <Info size={16} className={`mr-${spacing.sm}`} />
              Параметры анализа
            </Button>
          </div>

          {/* Selected filters count */}
          <div className={`mb-${spacing.md}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className={cn(typography.small, textColors.accent, `mr-${spacing.sm}`)}>
                  Выбрано фильтров:
                </span>
                <span className={cn(
                  typography.weight.semibold,
                  "bg-blue-500/20",
                  `px-${spacing.sm} py-${spacing.xs}`,
                  "rounded-full",
                  typography.small,
                  textColors.accent
                )}>
                  {selectedFilters.length}
                </span>
              </div>
              <div className={createTextStyle("small", "secondary")}>
                Каналов для анализа:{" "}
                <span className={typography.weight.semibold}>{channelCount}</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <ScrollArea className={cn("flex-1", `pr-${spacing.md}`)}>
            {showFiltersList && (
              /* Filters selection */
              <FiltersList
                onSelectFilter={toggleFilterSelection}
                selectedFilters={selectedFilters}
                height="h-[400px]"
              />
            ) }
          </ScrollArea>
        </div>

        <DialogFooter className={`pt-${spacing.md}`}>
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

export default StartAnalysisDialog;