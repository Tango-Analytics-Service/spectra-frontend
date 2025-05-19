// src/components/home.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import ChannelSetsList from "./ChannelSetsList";
import ChannelSetDetails from "./ChannelSetDetails";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { CreateChannelSetRequest } from "@/types/channel-sets";

const ChannelSetPage = () => {
  const navigate = useNavigate();
  // Get data and methods from context
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
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [currentSet, setCurrentSet] = useState(undefined);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating a new set
  const [newSetName, setNewSetName] = useState("");
  const [newSetDescription, setNewSetDescription] = useState("");
  const [newSetIsPublic, setNewSetIsPublic] = useState(false);

  // Load channel sets on component mount
  useEffect(() => {
    fetchChannelSets();
  }, [fetchChannelSets]);

  // Update selectedSetId when channel sets load
  useEffect(() => {
    if (channelSets.length > 0 && !selectedSetId) {
      setSelectedSetId(channelSets[0].id);
    }
  }, [channelSets, selectedSetId]);

  // Load selected set details when selected ID changes
  useEffect(() => {
    if (selectedSetId) {
      loadChannelSetDetails(selectedSetId);
    }
  }, [selectedSetId]);

  const loadChannelSetDetails = async (id: string) => {
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
      const data: CreateChannelSetRequest = {
        name: newSetName,
        description: newSetDescription,
        is_public: newSetIsPublic,
      };

      const newSet = await createChannelSet(data);

      if (newSet) {
        // Select the new set
        setSelectedSetId(newSet.id);

        // Reset form
        setNewSetName("");
        setNewSetDescription("");
        setNewSetIsPublic(false);

        // Close modal
        setIsCreateModalOpen(false);
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewSet = (setId: string) => {
    navigate(`/channel-sets/${setId}`);
  };

  const handleShareSet = (setId: string) => {
    // Implement share functionality
    console.log("Share set:", setId);
  };

  const handleEditSet = (setId: string) => {
    // Navigate to edit page
    navigate(`/channel-sets/${setId}`);
  };

  const handleAnalyzeSet = async (setId: string) => {
    // Navigate to analysis page or show analysis modal
    console.log("Analyze set:", setId);
  };

  const handleAnalyticsClick = () => {
    // Navigate to analytics page or open analytics modal
    console.log("Analytics clicked");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-[#0F172A] to-[#131c2e] text-white">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 flex items-center relative z-10">
        <div className="text-xl font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
            SPECTRA
          </span>
        </div>
        <Badge
          className="ml-2 bg-gradient-to-r from-[#358ee4] to-[#3b82f6] shadow-[0_0_8px_rgba(53,142,228,0.3)]"
          variant="default"
        >
          BETA
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-400 hover:bg-white/10 h-8 w-8"
          >
            <Filter size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-400 hover:bg-white/10 h-8 w-8"
          >
            <Search size={16} />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-hidden flex flex-col">
        {/* Title */}
        <div className="mt-3 sm:mt-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Наборы каналов
          </h1>
          <p className="text-xs sm:text-sm text-blue-300 mt-1">
            Управляйте группами каналов для аналитики
          </p>
        </div>

        {/* View toggle and label */}
        <div className="mt-4 sm:mt-6 flex justify-between items-center">
          <div className="text-xs sm:text-sm font-medium text-blue-200">
            ВАШИ НАБОРЫ
          </div>
          <div className="flex p-0.5 rounded-lg bg-gray-800">
            <Toggle
              pressed={viewMode === "grid"}
              onPressedChange={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400"}`}
            >
              <LayoutGrid size={16} />
            </Toggle>
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400"}`}
            >
              <List size={16} />
            </Toggle>
          </div>
        </div>

        {/* Create New Set Button */}
        <Button
          className="mt-3 sm:mt-4 w-full py-4 sm:py-6 bg-gradient-to-r from-[#358ee4] to-[#3b82f6] shadow-[0_4px_12px_rgba(53,142,228,0.25)] hover:shadow-[0_6px_16px_rgba(53,142,228,0.35)] transition-all duration-200"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle size={16} className="mr-2" />
          <span>Создать новый набор</span>
        </Button>

        {/* Channel Sets List */}
        {isLoading ? (
          <div className="mt-4 flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : channelSets.length > 0 ? (
          <div className="mt-4 overflow-auto flex-1">
            <ChannelSetsList
              sets={channelSets}
              selectedSetId={selectedSetId}
              onSelectSet={setSelectedSetId}
              viewMode={viewMode}
            />
          </div>
        ) : (
          <div className="mt-4 flex-1 flex items-center justify-center text-center text-gray-400">
            <div>
              <p>У вас пока нет наборов каналов</p>
              <p className="text-sm mt-2">
                Нажмите "Создать новый набор", чтобы начать
              </p>
            </div>
          </div>
        )}

        {/* Selected Set Details */}
        {selectedSetId && (
          <div className="mt-4">
            {detailsLoading ? (
              <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              </div>
            ) : currentSet ? (
              <div className="relative">
                <ChannelSetDetails
                  selectedSet={currentSet}
                  onShare={handleShareSet}
                  onEdit={handleEditSet}
                  onAnalyze={handleAnalyzeSet}
                />
                <Button
                  className="absolute right-4 bottom-4 flex items-center text-xs bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  size="sm"
                  onClick={() => handleViewSet(currentSet.id)}
                >
                  <Eye size={14} className="mr-1" />
                  Детальный просмотр
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl text-center">
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
            <DialogTitle>Создать новый набор</DialogTitle>
            <DialogDescription className="text-blue-300">
              Создайте набор каналов для анализа и мониторинга
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                placeholder="Название набора"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                className="bg-slate-900 border-blue-500/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                placeholder="Краткое описание набора"
                value={newSetDescription}
                onChange={(e) => setNewSetDescription(e.target.value)}
                className="bg-slate-900 border-blue-500/20 text-white"
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
              className="border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
              disabled={createLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateNewSet}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              disabled={createLoading}
            >
              {createLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
