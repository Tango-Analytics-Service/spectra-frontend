// src/components/channel-sets/ChannelSetPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  LoaderCircle,
  Zap,
  Brain,
  Users as UsersIcon,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import ChannelSetCard from "./ChannelSetCard";
import CreateSmartSetDialog from "./CreateSmartSetDialog";
import AnalysisConfirmDialog from "./AnalysisConfirmDialog";
import AddChannelsDialog from "./AddChannelsDialog";
import { LoadingCard } from "@/components/ui/loading";
import {
  createButtonStyle,
  createCardStyle,
  createTextStyle,
  spacing,
  typography,
  gradients,
  components,
  textColors,
  animations,
} from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { ChannelSet, ChannelSetType } from "@/types/channel-sets";

const ChannelSetPage = () => {
  const navigate = useNavigate();
  const { channelSets, isLoading, fetchChannelSets, createChannelSet } =
    useChannelSets();

  // Состояния
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ChannelSetType>("all");
  const [filteredSets, setFilteredSets] = useState<ChannelSet[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateSmartModalOpen, setIsCreateSmartModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [selectedSetForAnalysis, setSelectedSetForAnalysis] =
    useState<ChannelSet>();
  const [addChannelsDialogOpen, setAddChannelsDialogOpen] = useState(false);
  const [selectedSetForChannels, setSelectedSetForChannels] =
    useState<ChannelSet | null>(null);

  // Форма создания набора
  const [newSetName, setNewSetName] = useState("");
  const [newSetDescription, setNewSetDescription] = useState("");
  const [newSetIsPublic, setNewSetIsPublic] = useState(false);

  // Эффекты
  useEffect(() => {
    fetchChannelSets();
  }, [fetchChannelSets]);

  useEffect(() => {
    let filtered = channelSets;

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((set) => set.type === typeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (set) =>
          set.name.toLowerCase().includes(query) ||
          set.description.toLowerCase().includes(query),
      );
    }

    setFilteredSets(filtered);
  }, [searchQuery, typeFilter, channelSets]);

  // Обработчики
  const handleCreateNewSet = async () => {
    if (!newSetName.trim()) {
      toast({
        title: "Ошибка",
        description: "Название набора не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    setCreateLoading(true);
    try {
      const data = {
        name: newSetName,
        description: newSetDescription,
        is_public: newSetIsPublic,
      };

      const newSet = await createChannelSet(data);

      if (newSet) {
        setNewSetName("");
        setNewSetDescription("");
        setNewSetIsPublic(false);
        setIsCreateModalOpen(false);

        toast({
          title: "Успешно",
          description: "Набор каналов создан",
        });
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAnalyze = (setId: string) => {
    const set = channelSets.find((s) => s.id === setId);
    if (set) {
      setSelectedSetForAnalysis(set);
      setAnalysisDialogOpen(true);
    }
  };

  const handleConfirmAnalysis = async (setId: string) => {
    // TODO: Реализовать создание задачи анализа
    console.log("Starting analysis for set:", setId);

    // Имитация API вызова
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Анализ запущен",
      description: "Задача создана и поставлена в очередь",
    });
  };

  const handleViewDetails = (setId: string) => {
    navigate(`/channel-sets/${setId}`);
  };

  const handleAddChannels = (setId: string) => {
    const set = channelSets.find((s) => s.id === setId);
    if (set) {
      setSelectedSetForChannels(set);
      setAddChannelsDialogOpen(true);
    }
  };

  // Get type filter buttons data
  const typeFilterButtons = [
    {
      value: "all" as const,
      label: "Все",
      icon: Filter,
      count: channelSets.length,
    },
    {
      value: "manual" as const,
      label: "Ручные",
      icon: UsersIcon,
      count: channelSets.filter((s) => s.type === "manual").length,
    },
    {
      value: "smart" as const,
      label: "Умные",
      icon: Brain,
      count: channelSets.filter((s) => s.type === "smart").length,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col w-full min-h-screen",
        gradients.background,
        "text-white",
      )}
    >
      <main
        className={cn(
          "flex-1 overflow-hidden flex flex-col",
          `px-${spacing.md} sm:px-${spacing.lg}`,
          `pb-${spacing.md} sm:pb-${spacing.lg}`,
        )}
      >
        {/* Заголовок */}
        <div className={`mt-${spacing.sm} sm:mt-${spacing.md}`}>
          <h1 className={typography.h1}>Наборы каналов</h1>
          <p className={cn(createTextStyle("small", "secondary"), "mt-1")}>
            Управляйте группами каналов для аналитики (максимум 20 каналов в
            наборе)
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className={`mt-${spacing.md} space-y-${spacing.md}`}>
          {/* Поиск */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Поиск по наборам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(components.input.base, "pl-9")}
            />
          </div>

          {/* Type filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {typeFilterButtons.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all",
                  "flex-shrink-0",
                  typeFilter === filter.value
                    ? "bg-blue-500 text-white"
                    : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50",
                )}
              >
                <filter.icon size={14} />
                <span>{filter.label}</span>
                <span className="text-xs opacity-75">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки создания */}
        <div className={cn(`mt-${spacing.md}`, `space-y-${spacing.sm}`)}>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className={cn(
              createButtonStyle("primary"),
              `py-${spacing.md}`,
              "w-full",
              animations.scaleIn,
            )}
          >
            <Plus size={18} className={`mr-${spacing.sm}`} />
            Создать ручной набор
          </Button>

          <Button
            onClick={() => setIsCreateSmartModalOpen(true)}
            className={cn(
              createButtonStyle("secondary"),
              `py-${spacing.md}`,
              "w-full border border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",
              animations.scaleIn,
            )}
          >
            <Zap size={18} className={`mr-${spacing.sm}`} />
            Создать умный набор
          </Button>
        </div>

        {/* Список наборов */}
        <div className={`mt-${spacing.lg} flex-1`}>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <LoadingCard key={i} text="Загрузка наборов..." />
              ))}
            </div>
          ) : filteredSets.length === 0 ? (
            <div
              className={cn(
                createCardStyle(),
                "text-center",
                `py-${spacing.xl}`,
                animations.fadeIn,
              )}
            >
              <h3 className={cn(typography.h3, textColors.primary, "mb-2")}>
                {searchQuery || typeFilter !== "all"
                  ? "Наборы не найдены"
                  : "У вас пока нет наборов"}
              </h3>
              <p className={cn(createTextStyle("small", "muted"), "mb-4")}>
                {searchQuery || typeFilter !== "all"
                  ? "Попробуйте изменить поисковый запрос или фильтры"
                  : "Создайте первый набор каналов для анализа"}
              </p>
            </div>
          ) : (
            <div className={cn(`space-y-${spacing.md}`, animations.fadeIn)}>
              {filteredSets.map((set) => (
                <ChannelSetCard
                  key={set.id}
                  channelSet={set}
                  onAnalyze={handleAnalyze}
                  onViewDetails={handleViewDetails}
                  onAddChannels={handleAddChannels}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Диалог создания ручного набора */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className={createCardStyle()}>
          <DialogHeader>
            <DialogTitle className={typography.h3}>
              Создать ручной набор
            </DialogTitle>
            <DialogDescription className={textColors.secondary}>
              Создайте набор каналов для ручного управления (максимум 20
              каналов)
            </DialogDescription>
          </DialogHeader>

          <div className={`space-y-${spacing.md} py-2`}>
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                placeholder="Название набора"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                className={components.input.base}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                placeholder="Краткое описание набора"
                value={newSetDescription}
                onChange={(e) => setNewSetDescription(e.target.value)}
                className={components.input.base}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className={createButtonStyle("secondary")}
              disabled={createLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateNewSet}
              className={cn(createButtonStyle("primary"), "mb-2")}
              disabled={createLoading}
            >
              {createLoading ? (
                <>
                  <LoaderCircle
                    size={16}
                    className={`mr-${spacing.sm} animate-spin`}
                  />
                  Создание...
                </>
              ) : (
                "Создать набор"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог создания умного набора */}
      <CreateSmartSetDialog
        open={isCreateSmartModalOpen}
        onOpenChange={setIsCreateSmartModalOpen}
      />

      {/* Диалог подтверждения анализа */}
      <AnalysisConfirmDialog
        open={analysisDialogOpen}
        onOpenChange={setAnalysisDialogOpen}
        channelSet={selectedSetForAnalysis}
        onConfirm={handleConfirmAnalysis}
      />

      {/* Диалог добавления каналов */}
      <AddChannelsDialog
        open={addChannelsDialogOpen}
        onOpenChange={setAddChannelsDialogOpen}
        setId={selectedSetForChannels?.id || ""}
        existingChannels={
          selectedSetForChannels?.channels?.map((ch) => ch.username) || []
        }
      />
    </div>
  );
};

export default ChannelSetPage;
