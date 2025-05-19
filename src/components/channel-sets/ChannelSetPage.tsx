import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, LayoutGrid, List, Plus, Loader2 } from "lucide-react";
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
  const [selectedSetId, setSelectedSetId] = useState("");
  const [currentSet, setCurrentSet] = useState(undefined);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSets, setFilteredSets] = useState([]);

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

  // Filter channel sets based on search query
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

  const handleViewDetails = (setId) => {
    navigate(`/channel-sets/${setId}`);
  };

  const handleShareSet = (setId) => {
    // Implement share functionality
    console.log("Share set:", setId);
  };

  const handleEditSet = (setId) => {
    // Navigate to edit page
    navigate(`/channel-sets/${setId}`);
  };

  const handleAnalyzeSet = async (setId) => {
    // Navigate to analysis page or show analysis modal
    console.log("Analyze set:", setId);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-[#0F172A] to-[#131c2e] text-white">
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

        {/* Search and View Controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Поиск по наборам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-900/70 border-blue-500/20 w-full"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <div className="flex p-0.5 rounded-lg bg-slate-800">
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
            <Button
              variant="outline"
              size="icon"
              className="text-blue-400 hover:bg-white/10 border-blue-500/20"
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
          className="mt-4 w-full py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl flex items-center justify-center text-white font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200"
        >
          <Plus size={18} className="mr-2" />
          <span>Создать новый набор</span>
        </motion.button>

        {/* Channel Sets List */}
        <div className="mt-6 overflow-auto flex-1">
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
          <div className="mt-4">
            {detailsLoading ? (
              <div className="bg-slate-800/50 border border-blue-500/20 text-white p-6 rounded-xl flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              </div>
            ) : currentSet ? (
              <ChannelSetDetails
                selectedSet={currentSet}
                onShare={handleShareSet}
                onEdit={handleEditSet}
                onAnalyze={handleAnalyzeSet}
              />
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
