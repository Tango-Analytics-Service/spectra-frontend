// src/components/channel-sets/WebChannelSetPage.tsx
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  typography,
  spacing,
  animations,
  createCardStyle,
  createButtonStyle,
} from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, LayoutGrid, List } from "lucide-react";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import ChannelSetsList from "./ChannelSetsList";
import ChannelSetDetails from "./ChannelSetDetails";
import { LoadingCard } from "@/components/ui/loading";

const WebChannelSetPage: React.FC = () => {
  const {
    channelSets,
    isLoading,
    totalSets,
    totalChannels,
    fetchChannelSets,
    getChannelSet,
  } = useChannelSets();

  // Local state
  const [selectedSetId, setSelectedSetId] = useState("");
  const [currentSet, setCurrentSet] = useState(undefined);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSets, setFilteredSets] = useState([]);

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

  const handleViewDetails = (setId) => {
    setSelectedSetId(setId);
  };

  const handleShareSet = (setId) => {
    console.log("Share set:", setId);
  };

  const handleEditSet = (setId) => {
    console.log("Edit set:", setId);
  };

  const handleAnalyzeSet = async (setId) => {
    console.log("Analyze set:", setId);
  };

  return (
    <div className={cn("container mx-auto", animations.fadeIn)}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={typography.h1}>Наборы каналов</h1>
          <p className={cn(typography.small, "text-gray-300 mt-1")}>
            Управляйте группами каналов для аналитики
          </p>
        </div>
        <Button
          className="bg-[#4395d3] hover:bg-[#3a80b9] text-white"
          onClick={() => {}}
        >
          <Plus size={16} className="mr-2" />
          Создать набор
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Всего наборов</p>
                <h3 className="text-2xl font-bold">{totalSets}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#4395d3]/20 flex items-center justify-center">
                <LayoutGrid className="h-6 w-6 text-[#4395d3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Всего каналов</p>
                <h3 className="text-2xl font-bold">{totalChannels}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#4395d3]/20 flex items-center justify-center">
                <List className="h-6 w-6 text-[#4395d3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Активных анализов</p>
                <h3 className="text-2xl font-bold">2</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#4395d3]/20 flex items-center justify-center">
                <Filter className="h-6 w-6 text-[#4395d3]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Поиск по наборам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#0a2a5e]/30 border-[#4395d3]/20 focus:border-[#4395d3]/50"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex p-0.5 rounded-lg bg-[#0a2a5e]/50 border border-[#4395d3]/20">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3",
                viewMode === "grid"
                  ? "bg-[#4395d3] text-white"
                  : "text-gray-400 hover:text-white",
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={16} className="mr-2" />
              Сетка
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3",
                viewMode === "list"
                  ? "bg-[#4395d3] text-white"
                  : "text-gray-400 hover:text-white",
              )}
              onClick={() => setViewMode("list")}
            >
              <List size={16} className="mr-2" />
              Список
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-[#4395d3]/20 text-[#4395d3] hover:bg-[#4395d3]/10"
          >
            <Filter size={16} />
          </Button>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-[#0a2a5e]/50 border border-[#4395d3]/20">
          <TabsTrigger value="all">Все наборы</TabsTrigger>
          <TabsTrigger value="public">Публичные</TabsTrigger>
          <TabsTrigger value="private">Приватные</TabsTrigger>
          <TabsTrigger value="predefined">Предустановленные</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChannelSetsList
                channelSets={filteredSets}
                isLoading={isLoading}
                selectedSetId={selectedSetId}
                onSelectSet={setSelectedSetId}
                onViewDetails={handleViewDetails}
                viewMode={viewMode}
              />
            </div>
            <div>
              <div className="sticky top-6">
                <h3 className={cn(typography.h4, "mb-4")}>Детали набора</h3>
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
            </div>
          </div>
        </TabsContent>

        <TabsContent value="public" className="mt-6">
          <div className="p-8 text-center text-gray-400">
            <p>Фильтр по публичным наборам будет доступен в ближайшее время</p>
          </div>
        </TabsContent>

        <TabsContent value="private" className="mt-6">
          <div className="p-8 text-center text-gray-400">
            <p>Фильтр по приватным наборам будет доступен в ближайшее время</p>
          </div>
        </TabsContent>

        <TabsContent value="predefined" className="mt-6">
          <div className="p-8 text-center text-gray-400">
            <p>
              Фильтр по предустановленным наборам будет доступен в ближайшее
              время
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebChannelSetPage;
