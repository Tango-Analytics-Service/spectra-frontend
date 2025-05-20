// src/components/analysis/StartAnalysisDialog.tsx
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
import { Input } from "@/components/ui/input";
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
      <DialogContent className="bg-slate-800 border border-blue-500/20 text-white sm:max-w-[750px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Запуск анализа</DialogTitle>
          <DialogDescription className="text-blue-300">
            Выберите фильтры и настройте параметры для анализа каналов
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs for selections */}
          <div className="flex border-b border-slate-700 mb-4">
            <Button
              variant="ghost"
              className={`pb-2 px-4 rounded-none ${
                showFiltersList
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400"
              }`}
              onClick={() => setShowFiltersList(true)}
            >
              <FilterIcon size={16} className="mr-2" />
              Выбор фильтров
            </Button>
            <Button
              variant="ghost"
              className={`pb-2 px-4 rounded-none ${
                !showFiltersList
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400"
              }`}
              onClick={() => setShowFiltersList(false)}
            >
              <Info size={16} className="mr-2" />
              Параметры анализа
            </Button>
          </div>

          {/* Selected filters count */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm text-blue-300 mr-2">
                  Выбрано фильтров:
                </span>
                <span className="font-semibold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-sm">
                  {selectedFilters.length}
                </span>
              </div>
              <div className="text-sm text-blue-300">
                Каналов для анализа:{" "}
                <span className="font-semibold">{channelCount}</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <ScrollArea className="flex-1 pr-4">
            {showFiltersList ? (
              /* Filters selection */
              <FiltersList
                onSelectFilter={toggleFilterSelection}
                selectedFilters={selectedFilters}
                height="h-[400px]"
              />
            ) : (
              /* Analysis options */
              <div className="space-y-6 pb-4">
                <Alert className="bg-slate-900/50 border border-blue-500/20">
                  <Info className="h-4 w-4" />
                  <AlertTitle>О параметрах анализа</AlertTitle>
                  <AlertDescription>
                    Настройте параметры анализа каналов в соответствии с вашими
                    потребностями. Более подробный анализ занимает больше
                    времени и кредитов.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label htmlFor="processing-mode">Режим обработки</Label>
                  <Select
                    value={processingMode}
                    onValueChange={(value) =>
                      setProcessingMode(value as ProcessingMode)
                    }
                  >
                    <SelectTrigger
                      id="processing-mode"
                      className="bg-slate-900/70 border-blue-500/20"
                    >
                      <SelectValue placeholder="Выберите режим обработки" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-blue-500/20">
                      <SelectItem value={ProcessingMode.BATCH}>
                        Пакетный (асинхронно, дешевле)
                      </SelectItem>
                      <SelectItem value={ProcessingMode.DIRECT}>
                        Прямой (синхронно, быстрее)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-blue-300">
                    Пакетный режим выполняет анализ асинхронно и стоит дешевле.
                    Прямой режим выполняет анализ сразу и стоит дороже, но
                    результаты будут доступны быстрее.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="max-posts">
                      Количество постов для анализа
                    </Label>
                    <span className="text-sm text-blue-300">{maxPosts}</span>
                  </div>
                  <Slider
                    id="max-posts"
                    min={5}
                    max={50}
                    step={5}
                    value={[maxPosts]}
                    onValueChange={(value) => setMaxPosts(value[0])}
                    className="py-2"
                  />
                  <p className="text-xs text-blue-300">
                    Количество последних постов, которые будут проанализированы
                    в каждом канале. Больше постов = более точный анализ, но
                    дольше и дороже.
                  </p>
                </div>

                <Separator className="bg-slate-700/50" />

                <div className="space-y-4">
                  <Label>Дополнительные опции</Label>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="detailed"
                      checked={detailed}
                      onCheckedChange={(checked) =>
                        setDetailed(checked as boolean)
                      }
                    />
                    <div className="space-y-1 flex-1">
                      <Label
                        htmlFor="detailed"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Детальные объяснения
                      </Label>
                      <p className="text-xs text-slate-400">
                        Включает подробные объяснения оценок для каждого фильтра
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={16} className="text-blue-400" />
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

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="examples"
                      checked={includeExamples}
                      onCheckedChange={(checked) =>
                        setIncludeExamples(checked as boolean)
                      }
                    />
                    <div className="space-y-1 flex-1">
                      <Label
                        htmlFor="examples"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Примеры проблемных постов
                      </Label>
                      <p className="text-xs text-slate-400">
                        Включает примеры постов, не соответствующих фильтрам
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={16} className="text-blue-400" />
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

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-blue-500/20 text-blue-300"
            disabled={isStarting}
          >
            Отмена
          </Button>
          <Button
            onClick={handleStartAnalysis}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            disabled={isStarting || selectedFilters.length === 0}
          >
            {isStarting ? (
              <>
                <LoaderCircle size={16} className="mr-2 animate-spin" />
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
