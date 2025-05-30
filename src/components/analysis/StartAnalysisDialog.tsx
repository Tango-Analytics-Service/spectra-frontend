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
        setDetailed(false);
        setIncludeExamples(false);
        setProcessingMode(ProcessingMode.BATCH);
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
            {showFiltersList ? (
              /* Filters selection */
              <FiltersList
                onSelectFilter={toggleFilterSelection}
                selectedFilters={selectedFilters}
                height="h-[400px]"
              />
            ) : (
              /* Analysis options */
              <div className={cn(`space-y-${spacing.lg} pb-${spacing.md}`)}>
                <Alert className={cn(createCardStyle(), "bg-slate-900/50")}>
                  <Info className="h-4 w-4" />
                  <AlertTitle>О параметрах анализа</AlertTitle>
                  <AlertDescription>
                    Настройте параметры анализа каналов в соответствии с вашими
                    потребностями. Более подробный анализ занимает больше
                    времени и кредитов.
                  </AlertDescription>
                </Alert>

                <div className={`space-y-${spacing.sm}`}>
                  <Label htmlFor="processing-mode" className={createTextStyle("small", "secondary")}>
                    Режим обработки
                  </Label>
                  <Select
                    value={processingMode}
                    onValueChange={(value) =>
                      setProcessingMode(value as ProcessingMode)
                    }
                  >
                    <SelectTrigger
                      id="processing-mode"
                      className={components.input.base}
                    >
                      <SelectValue placeholder="Выберите режим обработки" />
                    </SelectTrigger>
                    <SelectContent
                      className={cn(createCardStyle(), "bg-slate-800")}
                    >
                      <SelectItem value={ProcessingMode.BATCH}>
                        Пакетный (асинхронно, дешевле)
                      </SelectItem>
                      <SelectItem value={ProcessingMode.DIRECT}>
                        Прямой (синхронно, быстрее)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className={createTextStyle("tiny", "secondary")}>
                    Пакетный режим выполняет анализ асинхронно и стоит дешевле.
                    Прямой режим выполняет анализ сразу и стоит дороже, но
                    результаты будут доступны быстрее.
                  </p>
                </div>

                <div className={`space-y-${spacing.sm}`}>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="max-posts" className={createTextStyle("small", "secondary")}>
                      Количество постов для анализа
                    </Label>
                    <span className={createTextStyle("small", "secondary")}>
                      {maxPosts}
                    </span>
                  </div>
                  <Slider
                    id="max-posts"
                    min={5}
                    max={50}
                    step={5}
                    value={[maxPosts]}
                    onValueChange={(value) => setMaxPosts(value[0])}
                    className={`py-${spacing.sm}`}
                  />
                  <p className={createTextStyle("tiny", "secondary")}>
                    Количество последних постов, которые будут проанализированы
                    в каждом канале. Больше постов = более точный анализ, но
                    дольше и дороже.
                  </p>
                </div>

                <Separator className="bg-slate-700/50" />

                <div className={`space-y-${spacing.md}`}>
                  <Label className={createTextStyle("small", "secondary")}>Дополнительные опции</Label>

                  <div className={cn("flex items-start", `space-x-${spacing.sm}`)}>
                    <Checkbox
                      id="detailed"
                      checked={detailed}
                      onCheckedChange={(checked) =>
                        setDetailed(checked as boolean)
                      }
                    />
                    <div className={cn("space-y-1 flex-1")}>
                      <Label
                        htmlFor="detailed"
                        className={cn(
                          typography.small,
                          typography.weight.medium,
                          "leading-none cursor-pointer",
                        )}
                      >
                        Детальные объяснения
                      </Label>
                      <p className={createTextStyle("tiny", "muted")}>
                        Включает подробные объяснения оценок для каждого фильтра
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={16} className={textColors.accent} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px]">
                          Система предоставит более детальные объяснения по
                          каждому фильтру. Это может занять больше времени и
                          кредитов.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className={cn("flex items-start", `space-x-${spacing.sm}`)}>
                    <Checkbox
                      id="examples"
                      checked={includeExamples}
                      onCheckedChange={(checked) =>
                        setIncludeExamples(checked as boolean)
                      }
                    />
                    <div className={cn("space-y-1 flex-1")}>
                      <Label
                        htmlFor="examples"
                        className={cn(
                          typography.small,
                          typography.weight.medium,
                          "leading-none cursor-pointer",
                        )}
                      >
                        Примеры проблемных постов
                      </Label>
                      <p className={createTextStyle("tiny", "muted")}>
                        Включает примеры постов, не соответствующих фильтрам
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={16} className={textColors.accent} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px]">
                          Система будет приводить конкретные примеры постов, не
                          соответствующих выбранным фильтрам.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}
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