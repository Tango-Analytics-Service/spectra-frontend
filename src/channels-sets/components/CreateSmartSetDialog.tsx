// src/channels-sets/components/CreateSmartSetDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/dialog";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Textarea } from "@/ui/components/textarea";
import { Slider } from "@/ui/components/slider";
import { Checkbox } from "@/ui/components/checkbox";
import ScrollArea from "@/ui/components/scroll-area/ScrollArea";
import { LoaderCircle, Zap, Settings, Filter } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "@/ui/components/use-toast";
import { useFiltersStore } from "@/filters/stores/useFiltersStore";
import { useChannelsSetsStore } from "@/channels-sets/stores/useChannelsSetsStore";
import { SmartSetBuildCriteria } from "@/channels-sets/types";
import {
  createCardStyle,
  createButtonStyle,
  createTextStyle,
  typography,
  spacing,
  components,
  textColors,
} from "@/lib/design-system";

interface CreateSmartSetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateSmartSetDialog: React.FC<CreateSmartSetDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const createChannelsSet = useChannelsSetsStore(state => state.createChannelsSet);
  const userFilters = useFiltersStore(state => state.userFilters);
  const fetchUserFilters = useFiltersStore(state => state.fetchUserFilters);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Smart set criteria
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [targetCount, setTargetCount] = useState([50]);

  // Fixed values
  const acceptanceThreshold = 0.7; // Fixed at 70%
  const batchSize = 20; // Fixed at 20

  // Load filters when dialog opens
  React.useEffect(() => {
    if (open && userFilters.length === 0) {
      fetchUserFilters();
    }
  }, [open, userFilters.length, fetchUserFilters]);

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setName("");
        setDescription("");
        setSelectedFilters([]);
        setTargetCount([50]);
      }, 300);
    }
  }, [open]);

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const handleCreate = async () => {
    // Validation
    if (!name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название набора не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    if (selectedFilters.length === 0) {
      toast({
        title: "Ошибка",
        description: "Выберите хотя бы один фильтр",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const buildCriteria: SmartSetBuildCriteria = {
        filter_ids: selectedFilters,
        target_count: targetCount[0],
        acceptance_threshold: acceptanceThreshold,
        batch_size: batchSize,
      };

      const newSet = await createChannelsSet({
        name: name.trim(),
        description: description.trim(),
        is_public: false, // Fixed to false
        build_criteria: buildCriteria,
      });

      if (newSet) {
        onOpenChange(false);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          createCardStyle(),
          "sm:max-w-2xl max-h-[80vh] flex flex-col p-0",
        )}
      >
        {/* Header */}
        <DialogHeader className={`p-6 pb-0 flex-shrink-0`}>
          <DialogTitle className={cn(typography.h3, "flex items-center gap-2")}>
            <Zap size={20} className={textColors.accent} />
            Создать умный набор
          </DialogTitle>
          <DialogDescription className={textColors.secondary}>
            Умный набор автоматически находит каналы по заданным критериям
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 pt-4">
          <div className={`space-y-${spacing.lg}`}>
            {/* Basic Info */}
            <div className={`space-y-${spacing.md}`}>
              <h4 className={cn(typography.h4, textColors.primary)}>
                Основная информация
              </h4>

              <div className={`space-y-${spacing.sm}`}>
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Название умного набора"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={components.input.base}
                />
              </div>

              <div className={`space-y-${spacing.sm}`}>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание набора"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(components.input.base, "min-h-[60px]")}
                  rows={3}
                />
              </div>
            </div>

            {/* Filters Selection */}
            <div className={`space-y-${spacing.md}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={16} className={textColors.accent} />
                  <h4 className={cn(typography.h4, textColors.primary)}>
                    Фильтры для поиска
                  </h4>
                </div>
                {selectedFilters.length > 0 && (
                  <span
                    className={cn(
                      typography.small,
                      "bg-blue-500/20",
                      `px-${spacing.sm} py-${spacing.xs}`,
                      "rounded-full",
                      textColors.accent,
                    )}
                  >
                    Выбрано: {selectedFilters.length}
                  </span>
                )}
              </div>

              {/* Filters list with proper scroll */}
              <div className={cn(createCardStyle(), "bg-slate-900/30")}>
                <ScrollArea className="h-[300px]">
                  <div className={`p-${spacing.md} space-y-3`}>
                    {userFilters.length === 0 ? (
                      <div className="text-center py-8">
                        <div className={createTextStyle("small", "muted")}>
                          Загрузка фильтров...
                        </div>
                      </div>
                    ) : (
                      userFilters.map((filter) => (
                        <div
                          key={filter.id}
                          className={cn(
                            "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                            "hover:bg-slate-800/50",
                            selectedFilters.includes(filter.id) &&
                              "bg-blue-500/10 border border-blue-500/20",
                          )}
                        >
                          <Checkbox
                            id={`filter-${filter.id}`}
                            checked={selectedFilters.includes(filter.id)}
                            onCheckedChange={() =>
                              handleFilterToggle(filter.id)
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`filter-${filter.id}`}
                            className="flex-1 cursor-pointer space-y-1"
                          >
                            <div
                              className={cn(
                                typography.weight.medium,
                                textColors.primary,
                              )}
                            >
                              {filter.name}
                            </div>
                            <div className={createTextStyle("small", "muted")}>
                              {filter.description || filter.criteria}
                            </div>
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Build Criteria */}
            <div className={`space-y-${spacing.md}`}>
              <div className="flex items-center gap-2">
                <Settings size={16} className={textColors.accent} />
                <h4 className={cn(typography.h4, textColors.primary)}>
                  Критерии построения
                </h4>
              </div>

              <div className={`space-y-${spacing.md}`}>
                {/* Target Count */}
                <div className={`space-y-${spacing.sm}`}>
                  <Label>Целевое количество каналов: {targetCount[0]}</Label>
                  <Slider
                    value={targetCount}
                    onValueChange={setTargetCount}
                    max={1000}
                    min={10}
                    step={10}
                  />
                  <div className={createTextStyle("tiny", "muted")}>
                    От 10 до 1000 каналов
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div
              className={cn(
                createCardStyle(),
                "bg-blue-500/5 border-blue-500/20",
                `p-${spacing.md}`,
              )}
            >
              <div className={createTextStyle("small", "accent")}>
                <div className="font-medium mb-1">Как это работает:</div>
                <ul className="space-y-1 text-blue-300">
                  <li>• Система анализирует каналы по выбранным фильтрам</li>
                  <li>• Каналы с оценкой выше 70% добавляются в набор</li>
                  <li>
                    • Процесс продолжается пока не наберется целевое количество
                  </li>
                  <li>• Анализ ведется батчами по 20 каналов</li>
                  <li>• Вы получите уведомление о завершении построения</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className={`p-6 pt-4 flex-shrink-0 gap-${spacing.sm}`}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={createButtonStyle("secondary")}
            disabled={isCreating}
          >
            Отмена
          </Button>
          <Button
            onClick={handleCreate}
            className={createButtonStyle("primary")}
            disabled={
              isCreating || !name.trim() || selectedFilters.length === 0
            }
          >
            {isCreating ? (
              <>
                <LoaderCircle size={16} className="mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Zap size={16} className="mr-2" />
                Создать умный набор
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSmartSetDialog;