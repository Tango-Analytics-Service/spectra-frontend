import React from "react";
import { Users, Globe, Star, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Channel {
  username: string;
  channel_id: number;
  is_parsed: boolean;
  added_at: string;
}

interface ChannelSet {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  is_predefined: boolean;
  created_at: string;
  updated_at: string;
  channel_count: number;
  channels: Channel[];
  all_parsed: boolean;
}

interface ChannelSetsListProps {
  sets?: ChannelSet[];
  selectedSetId?: string;
  onSelectSet?: (id: string) => void;
  viewMode: "grid" | "list";
}

const ChannelSetsList = ({
  sets = [
    {
      id: "24083538-67db-4339-b9fd-93d293c31458",
      name: "Тестовый набор",
      description: "Мой персональный набор каналов",
      is_public: false,
      is_predefined: false,
      created_at: "2025-05-03T16:07:19.378096",
      updated_at: "2025-05-04T13:51:16.708570",
      channel_count: 3,
      channels: [],
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
  selectedSetId = "24083538-67db-4339-b9fd-93d293c31458",
  onSelectSet = () => {},
  viewMode = "grid",
}: ChannelSetsListProps) => {
  // Format date to DD.MM.YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="px-6 mt-4 overflow-auto flex-1">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {sets.map((set) => (
            <div
              key={set.id}
              className="p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-500"
              style={{
                background:
                  set.id === selectedSetId
                    ? "linear-gradient(135deg, rgba(53, 142, 228, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)"
                    : "rgba(30, 41, 59, 0.5)",
                boxShadow:
                  set.id === selectedSetId
                    ? "0 4px 12px rgba(53, 142, 228, 0.15)"
                    : "none",
              }}
              onClick={() => onSelectSet(set.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className="font-medium truncate"
                  style={{ maxWidth: "80%" }}
                >
                  {set.name}
                </div>
                <div className="flex">
                  {set.is_predefined && (
                    <span className="ml-1" title="Предустановленный набор">
                      <Star size={14} className="text-yellow-400" />
                    </span>
                  )}
                  {set.is_public ? (
                    <span className="ml-1" title="Публичный набор">
                      <Globe size={14} className="text-blue-400" />
                    </span>
                  ) : (
                    <span className="ml-1" title="Приватный набор">
                      <Lock size={14} className="text-gray-400" />
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-3 text-xs text-gray-400 truncate">
                {set.description}
              </div>
              <div className="flex items-center text-xs text-blue-300">
                <Users size={12} className="mr-1" />
                <span>{set.channel_count} каналов</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sets.map((set) => (
            <div
              key={set.id}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-500 flex items-center"
              style={{
                background:
                  set.id === selectedSetId
                    ? "linear-gradient(135deg, rgba(53, 142, 228, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)"
                    : "rgba(30, 41, 59, 0.5)",
                boxShadow:
                  set.id === selectedSetId
                    ? "0 4px 12px rgba(53, 142, 228, 0.15)"
                    : "none",
              }}
              onClick={() => onSelectSet(set.id)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                style={{
                  background:
                    "linear-gradient(135deg, #358ee4 0%, #3b82f6 100%)",
                }}
              >
                {set.is_predefined ? (
                  <Star size={18} className="text-white" />
                ) : (
                  <span className="text-lg font-bold">
                    {set.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <div
                    className="font-medium truncate"
                    style={{ maxWidth: "80%" }}
                  >
                    {set.name}
                  </div>
                  {set.is_public ? (
                    <span className="ml-1" title="Публичный набор">
                      <Globe size={14} className="text-blue-400" />
                    </span>
                  ) : (
                    <span className="ml-1" title="Приватный набор">
                      <Lock size={14} className="text-gray-400" />
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <span className="truncate mr-2" style={{ maxWidth: "60%" }}>
                    {set.description}
                  </span>
                  <Users size={12} className="mr-1" />
                  <span>{set.channel_count}</span>
                </div>
              </div>
              <div className="text-xs text-blue-300 whitespace-nowrap">
                {formatDate(set.updated_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelSetsList;
