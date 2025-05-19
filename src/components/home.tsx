import React, { useState } from "react";
import {
  Users,
  Search,
  PlusCircle,
  CheckCircle,
  Calendar,
  Globe,
  Star,
  Lock,
  Share2,
  Settings,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import ChannelSetsList from "./ChannelSetsList";
import ChannelSetDetails from "./ChannelSetDetails";
import StatisticsFooter from "./StatisticsFooter";

const Home = () => {
  // Sample data for channel sets
  const setsData = {
    sets: [
      {
        id: "24083538-67db-4339-b9fd-93d293c31458",
        name: "Тестовый набор",
        description: "Мой персональный набор каналов",
        is_public: false,
        is_predefined: false,
        created_at: "2025-05-03T16:07:19.378096",
        updated_at: "2025-05-04T13:51:16.708570",
        channel_count: 3,
        channels: [
          {
            username: "technomotel",
            channel_id: 1752992242,
            is_parsed: true,
            added_at: "2025-05-03T16:08:15.957344",
          },
          {
            username: "digitaldiva",
            channel_id: 1816620530,
            is_parsed: true,
            added_at: "2025-05-03T16:31:26.856099",
          },
          {
            username: "seeallochnaya",
            channel_id: 1511414765,
            is_parsed: true,
            added_at: "2025-05-04T13:51:03.709375",
          },
        ],
        all_parsed: true,
      },
      {
        id: "predefined-tech-news",
        name: "Технологические новости",
        description: "Популярные каналы о технологиях",
        is_public: true,
        is_predefined: true,
        created_at: "2025-04-15T10:00:00.000000",
        updated_at: "2025-05-01T12:00:00.000000",
        channel_count: 5,
        channels: [],
        all_parsed: true,
      },
      {
        id: "public-finance",
        name: "Финансовые каналы",
        description: "Публичный набор о финансах и инвестициях",
        is_public: true,
        is_predefined: false,
        created_at: "2025-04-20T14:30:00.000000",
        updated_at: "2025-05-02T09:15:00.000000",
        channel_count: 7,
        channels: [],
        all_parsed: true,
      },
    ],
    count: 3,
  };

  const [selectedSet, setSelectedSet] = useState(
    "24083538-67db-4339-b9fd-93d293c31458",
  );
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Get the currently selected set
  const currentSet = setsData.sets.find((set) => set.id === selectedSet);

  // Calculate total channels across all sets
  const totalChannels = setsData.sets.reduce(
    (acc, set) => acc + set.channel_count,
    0,
  );

  const handleCreateNewSet = () => {
    // Логика для создания нового набора
    console.log("Create new set");
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
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-blue-500 text-red" : "text-gray-400"}`}
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
          onClick={handleCreateNewSet}
        >
          <PlusCircle size={16} className="mr-2" />
          <span>Создать новый набор</span>
        </Button>

        {/* Channel Sets List */}
        <div className="mt-4 overflow-auto flex-1">
          <ChannelSetsList
            sets={setsData.sets}
            selectedSetId={selectedSet}
            onSelectSet={setSelectedSet}
            viewMode={viewMode}
          />
        </div>

        {/* Selected Set Details */}
        {currentSet && (
          <div className="mt-4">
            <ChannelSetDetails selectedSet={currentSet} />
          </div>
        )}
      </main>

      {/* Statistics Footer */}
      <StatisticsFooter
        totalSets={setsData.count}
        totalChannels={totalChannels}
      />
    </div>
  );
};

export default Home;
