// src/components/channel-sets/AddChannelsDialog.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Check,
  Plus,
  Search,
  Trash,
  X,
  LoaderCircle,
  ExternalLink,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { ChannelDetails } from "@/types/channel-sets";

interface AddChannelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setId: string;
}

const AddChannelsDialog: React.FC<AddChannelsDialogProps> = ({
  open,
  onOpenChange,
  setId,
}) => {
  const { addChannelsToSet, searchChannels } = useChannelSets();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChannelDetails[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [manualChannels, setManualChannels] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "manual">("search");

  // Refs
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to search channels when query changes
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchChannels(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching channels:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchChannels]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      // Small delay to avoid flashing during close animation
      setTimeout(() => {
        setSearchQuery("");
        setSearchResults([]);
        setSelectedChannels([]);
        setManualChannels([]);
        setManualInput("");
        setActiveTab("search");
      }, 300);
    }
  }, [open]);

  // Handlers
  const handleTabChange = (tab: "search" | "manual") => {
    setActiveTab(tab);
  };

  const handleToggleChannel = (username: string) => {
    setSelectedChannels((prev) =>
      prev.includes(username)
        ? prev.filter((c) => c !== username)
        : [...prev, username],
    );
  };

  const handleAddManualChannel = () => {
    const username = manualInput.trim().replace(/^@/, "");
    if (username && !manualChannels.includes(username)) {
      setManualChannels((prev) => [...prev, username]);
      setManualInput("");
    }
  };

  const handleRemoveManualChannel = (username: string) => {
    setManualChannels((prev) => prev.filter((c) => c !== username));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && manualInput.trim()) {
      e.preventDefault();
      handleAddManualChannel();
    }
  };

  const handleAddChannels = async () => {
    // Collect all selected channels
    const channelsToAdd = [...selectedChannels, ...manualChannels];

    if (channelsToAdd.length === 0) {
      toast({
        title: "Ошибка",
        description: "Выберите или добавьте хотя бы один канал",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const result = await addChannelsToSet(setId, channelsToAdd);

      if (result.success) {
        toast({
          title: "Успешно",
          description: `Добавлено ${channelsToAdd.length} каналов в набор`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Ошибка",
          description: result.message || "Не удалось добавить каналы",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding channels:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении каналов",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Derived state
  const totalSelected = selectedChannels.length + manualChannels.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border border-blue-500/20 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle>Добавление каналов</DialogTitle>
          <DialogDescription className="text-blue-300">
            Найдите или введите каналы, которые хотите добавить в набор
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "search" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTabChange("search")}
            className={
              activeTab === "search"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-blue-500/20 text-gray-300"
            }
          >
            <Search size={16} className="mr-2" />
            Поиск каналов
          </Button>
          <Button
            variant={activeTab === "manual" ? "default" : "outline"}
            size="sm"
            onClick={() => handleTabChange("manual")}
            className={
              activeTab === "manual"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-blue-500/20 text-gray-300"
            }
          >
            <Plus size={16} className="mr-2" />
            Добавить вручную
          </Button>
        </div>

        <div className="h-[400px] flex flex-col">
          {/* Search Tab */}
          {activeTab === "search" && (
            <>
              <div className="relative mb-2">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Поиск каналов по названию или @username"
                  className="pl-9 bg-slate-900/70 border-blue-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <ScrollArea className="flex-1 border border-blue-500/20 rounded-md bg-slate-900/30">
                {searchLoading ? (
                  <div className="py-8 flex justify-center items-center">
                    <LoaderCircle
                      size={24}
                      className="text-blue-400 animate-spin"
                    />
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 px-4 text-center text-gray-400">
                    {searchQuery.length < 2 ? (
                      <div>
                        <Search
                          size={24}
                          className="mx-auto mb-2 text-gray-500"
                        />
                        Введите не менее 2 символов для поиска
                      </div>
                    ) : (
                      <div>
                        <AlertCircle
                          size={24}
                          className="mx-auto mb-2 text-gray-500"
                        />
                        Каналы не найдены. Попробуйте другой запрос или добавьте
                        канал вручную
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-1">
                    {searchResults.map((channel) => (
                      <div
                        key={channel.username}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                          selectedChannels.includes(channel.username)
                            ? "bg-blue-500/20 hover:bg-blue-500/30"
                            : "hover:bg-slate-800/70"
                        }`}
                        onClick={() => handleToggleChannel(channel.username)}
                      >
                        <div className="flex items-center">
                          {selectedChannels.includes(channel.username) ? (
                            <Check size={16} className="text-blue-400 mr-2" />
                          ) : (
                            <div className="w-4 h-4 border border-gray-500 rounded-sm mr-2" />
                          )}
                          <div>
                            <div className="font-medium flex items-center">
                              @{channel.username}
                              <a
                                href={`https://t.me/${channel.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-gray-400 hover:text-blue-400"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink size={12} />
                              </a>
                            </div>
                            {channel.title && (
                              <div className="text-sm text-gray-400">
                                {channel.title}
                              </div>
                            )}
                          </div>
                        </div>

                        {channel.stats && (
                          <div className="text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                              <span
                                title="Подписчики"
                                className="flex items-center"
                              >
                                <Users size={12} className="mr-1" />
                                {formatNumber(channel.stats.subscribers_count)}
                              </span>
                              <span
                                title="Просмотры"
                                className="flex items-center"
                              >
                                <Eye size={12} className="mr-1" />
                                {formatNumber(channel.stats.average_views)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}

          {/* Manual Tab */}
          {activeTab === "manual" && (
            <>
              <div className="mb-2 flex">
                <Input
                  placeholder="Введите @username канала"
                  className="flex-1 mr-2 bg-slate-900/70 border-blue-500/20"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  onClick={handleAddManualChannel}
                  disabled={!manualInput.trim()}
                >
                  Добавить
                </Button>
              </div>

              <div className="text-xs text-gray-400 mb-2">
                <AlertCircle size={12} className="inline mr-1" />
                Вводите юзернеймы каналов с @ или без, например: @channel_name
                или channel_name
              </div>

              <ScrollArea className="flex-1 border border-blue-500/20 rounded-md bg-slate-900/30 p-4">
                {manualChannels.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">
                    <Plus size={24} className="mx-auto mb-2 text-gray-500" />
                    Добавьте каналы, введя их @username
                  </div>
                ) : (
                  <div className="space-y-2">
                    {manualChannels.map((username) => (
                      <div
                        key={username}
                        className="flex items-center justify-between px-3 py-2 bg-slate-800/70 rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="font-medium">@{username}</div>
                          <a
                            href={`https://t.me/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-gray-400 hover:text-blue-400"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveManualChannel(username)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}

          {/* Selected counter */}
          <div className="mt-2 text-sm">
            Выбрано каналов:{" "}
            <span className="font-semibold text-blue-400">{totalSelected}</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-blue-500/20 text-blue-300"
            disabled={isAdding}
          >
            Отмена
          </Button>
          <Button
            onClick={handleAddChannels}
            disabled={totalSelected === 0 || isAdding}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            {isAdding ? (
              <>
                <LoaderCircle size={16} className="mr-2 animate-spin" />
                Добавление...
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Добавить {totalSelected} {getChannelWord(totalSelected)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

const getChannelWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "каналов";
  }

  if (lastDigit === 1) {
    return "канал";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "канала";
  }

  return "каналов";
};

export default AddChannelsDialog;
