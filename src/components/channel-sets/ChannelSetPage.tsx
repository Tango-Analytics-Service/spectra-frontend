// src/components/channel-sets/ChannelSetPage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, LayoutGrid, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
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
import ChannelSetsList from "./ChannelSetsList";
import ChannelSetDetails from "./ChannelSetDetails";
import { LoadingCard, LoadingSpinner } from "@/components/ui/loading";
import {
  createButtonStyle,
  spacing,
  typography,
  gradients,
  components,
  createCardStyle,
  colors,
  radius,
  shadows,
  animations,
  createBadgeStyle,
} from "@/lib/design-system";
import { cn } from "@/lib/utils";

const ChannelSetPage = () => {
  const navigate = useNavigate();
  const {
    channelSets,
    isLoading,
    totalSets,
    totalChannels,
    fetchChannelSets,
    getChannelSet,
    createChannelSet,
  } = useChannelSets();

  // Local state
  const [selectedSetId, setSelectedSetId] = useState("");
  const [currentSet, setCurrentSet] = useState(undefined);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSets, setFilteredSets] = useState([]);

  // Form state
  const [newSetName, setNewSetName] = useState("");
  const [newSetDescription, setNewSetDescription] = useState("");
  const [newSetIsPublic, setNewSetIsPublic] = useState(false);

  // Effects
  useEffect(() => {
    fetchChannelSets();
  }, [fetchChannelSets]);

  useEffect(() => {
    if (channelSets.length > 0 && !selectedSetId) {
      setSelectedSetId(channelSets[0].id);
    }
  }, [channelSets, selectedSetId]);

  useEffect(() => {
    if (selectedSetId) {
      loadChannelSetDetails(selectedSetId);
    }
  }, [selectedSetId]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSets(channelSets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = channelSets.filter(
      (set) =>
        set.name.toLowerCase().includes(query) ||
        set.description.toLowerCase().includes(query),
    );
    setFilteredSets(filtered);
  }, [searchQuery, channelSets]);

  const loadChannelSetDetails = async (id) => {
    setDetailsLoading(true);
    try {
      const set = await getChannelSet(id);
      setCurrentSet(set);
    } finally {
      setDetailsLoading(false);
    }
  };

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
        setSelectedSetId(newSet.id);
        setNewSetName("");
        setNewSetDescription("");
        setNewSetIsPublic(false);
        setIsCreateModalOpen(false);
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewDetails = (setId) => {
    navigate(`/channel-sets/${setId}`);
  };

  const handleShareSet = (setId) => {
    console.log("Share set:", setId);
  };

  const handleEditSet = (setId) => {
    navigate(`/channel-sets/${setId}`);
  };

  const handleAnalyzeSet = async (setId) => {
    console.log("Analyze set:", setId);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full min-h-screen",
        gradients.background,
        "text-white",
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "flex items-center relative z-10",
          `px-${spacing.md} sm:px-${spacing.lg}`,
          `py-${spacing.sm} sm:py-${spacing.md}`,
        )}
      >
        <div className="text-xl font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            SPECTRA
          </span>
          <Badge
            className="ml-2 bg-gradient-to-r from-[#358ee4] to-[#3b82f6] shadow-[0_0_8px_rgba(53,142,228,0.3)]"
            variant="default"
          >
            BETA
          </Badge>
        </div>
      </header>

      <main
        className={cn(
          "flex-1 overflow-hidden flex flex-col",
          `px-${spacing.md} sm:px-${spacing.lg}`,
          `pb-${spacing.md} sm:pb-${spacing.lg}`,
        )}
      >
        {/* Title */}
        <div className={`mt-${spacing.sm} sm:mt-${spacing.md}`}>
          <h1 className={typography.h1}>Наборы каналов</h1>
          <p className={cn(typography.small, "text-blue-300 mt-1")}>
            Управляйте группами каналов для аналитики
          </p>
        </div>

        {/* Search and View Controls */}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-3 items-center",
            `mt-${spacing.md}`,
          )}
        >
          <div className="relative flex-1">
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
          <div className="flex gap-2 ml-auto">
            <div
              className={cn(
                "flex p-0.5 rounded-lg",
                "bg-slate-800/70 border border-blue-500/20",
              )}
            >
              <Toggle
                pressed={viewMode === "grid"}
                onPressedChange={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white",
                )}
              >
                <LayoutGrid size={16} />
              </Toggle>
              <Toggle
                pressed={viewMode === "list"}
                onPressedChange={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white",
                )}
              >
                <List size={16} />
              </Toggle>
            </div>
            <Button
              variant="outline"
              size="icon"
              className={components.button.secondary}
            >
              <Filter size={16} />
            </Button>
          </div>
        </div>

        {/* Create New Set Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className={cn(
            `mt-${spacing.md}`,
            `w-full py-${spacing.md} sm:py-${spacing.lg}`,
            `rounded-${radius.xl}`,
            "flex items-center justify-center",
            "font-medium transition-all duration-200",
            gradients.primary,
            "hover:" + gradients.primaryHover,
            "shadow-lg",
            "shadow-blue-600/20 hover:shadow-blue-600/30",
            animations.scaleIn,
          )}
        >
          <Plus size={18} className="mr-2" />
          <span>Создать новый набор</span>
        </motion.button>

        {/* Channel Sets List */}
        <div className={`mt-${spacing.lg} overflow-auto flex-1`}>
          <ChannelSetsList
            channelSets={filteredSets}
            isLoading={isLoading}
            selectedSetId={selectedSetId}
            onSelectSet={setSelectedSetId}
            onViewDetails={handleViewDetails}
            viewMode={viewMode}
          />
        </div>

        {/* Selected Set Details */}
        {selectedSetId && (
          <div className={`mt-${spacing.md}`}>
            {detailsLoading ? (
              <LoadingCard text="Загрузка информации о наборе..." />
            ) : currentSet ? (
              <ChannelSetDetails
                selectedSet={currentSet}
                onShare={handleShareSet}
                onEdit={handleEditSet}
                onAnalyze={handleAnalyzeSet}
              />
            ) : (
              <div className={cn(createCardStyle(), "p-6 text-center")}>
                Выберите набор для просмотра деталей
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Set Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-slate-800 border border-blue-500/20 text-white">
          <DialogHeader>
            <DialogTitle className={typography.h3}>
              Создать новый набор
            </DialogTitle>
            <DialogDescription className="text-blue-300">
              Создайте набор каналов для анализа и мониторинга
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

            <div className="flex items-center space-x-2">
              <Switch
                id="is-public"
                checked={newSetIsPublic}
                onCheckedChange={setNewSetIsPublic}
              />
              <Label htmlFor="is-public">Публичный набор</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className={components.button.secondary}
              disabled={createLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateNewSet}
              className={createButtonStyle("primary")}
              disabled={createLoading}
            >
              {createLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Создание...
                </>
              ) : (
                "Создать набор"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChannelSetPage;
