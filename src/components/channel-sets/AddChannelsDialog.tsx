// src/components/channel-sets/AddChannelsDialog.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Check,
  Plus,
  Search,
  ExternalLink,
  Users,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { ChannelDetails } from "@/types/channel-sets";
import { cn } from "@/lib/utils";
import {
  createButtonStyle,
  components,
  typography,
  spacing,
  animations,
  textColors,
  createTextStyle,
} from "@/lib/design-system";
import {
  DialogWrapper,
  FormField,
  ActionButtons,
  SelectionCounter,
  EmptyState,
  LoadingState,
} from "@/components/ui/dialog-components";

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
  const [isAdding, setIsAdding] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "manual">("search");

  // Refs
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to search channels when query changes
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
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
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Добавление каналов"
      description="Найдите или введите каналы, которые хотите добавить в набор"
      maxWidth="max-w-4xl"
    >
      {/* Tabs */}
      <div className={cn("flex", `space-x-${spacing.sm} mb-${spacing.md}`)}>
        <Button
          variant={activeTab === "search" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTabChange("search")}
          className={
            activeTab === "search"
              ? createButtonStyle("primary")
              : createButtonStyle("secondary")
          }
        >
          <Search size={16} className={`mr-${spacing.sm}`} />
          Поиск каналов
        </Button>
        <Button
          variant={activeTab === "manual" ? "default" : "outline"}
          size="sm"
          onClick={() => handleTabChange("manual")}
          className={
            activeTab === "manual"
              ? createButtonStyle("primary")
              : createButtonStyle("secondary")
          }
        >
          <Plus size={16} className={`mr-${spacing.sm}`} />
          Добавить вручную
        </Button>
      </div>

      <div className="h-[400px] flex flex-col">
        {/* Search Tab */}
        {activeTab === "search" && (
          <>
            <FormField label="Поиск каналов">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Поиск каналов по названию или @username"
                  className={cn(components.input.base, "pl-9")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </FormField>

            <ScrollArea
              className={cn(
                "flex-1 border border-blue-500/20 rounded-md bg-slate-900/30",
                `mt-${spacing.sm}`,
              )}
            >
              {searchLoading ? (
                <LoadingState />
              ) : searchResults.length === 0 ? (
                <EmptyState
                  icon={
                    searchQuery.length < 2 ? (
                      <Search size={12} />
                    ) : (
                      <AlertCircle size={12} />
                    )
                  }
                  title={
                    searchQuery.length < 2
                      ? "Введите не менее 2 символов для поиска"
                      : "Каналы не найдены"
                  }
                  description={
                    searchQuery.length >= 2
                      ? "Попробуйте другой запрос или добавьте канал вручную"
                      : undefined
                  }
                />
              ) : (
                <div className="p-1">
                  {searchResults.map((channel) => (
                    <div
                      key={channel.username}
                      className={cn(
                        "flex items-center justify-between",
                        `p-${spacing.sm}`,
                        "rounded-md cursor-pointer",
                        selectedChannels.includes(channel.username)
                          ? "bg-blue-500/20 hover:bg-blue-500/30"
                          : "hover:bg-slate-800/70",
                      )}
                      onClick={() => handleToggleChannel(channel.username)}
                    >
                      <div className="flex items-center">
                        {selectedChannels.includes(channel.username) ? (
                          <Check
                            size={16}
                            className={cn(
                              textColors.accent,
                              `mr-${spacing.sm}`,
                            )}
                          />
                        ) : (
                          <div
                            className={cn(
                              "w-4 h-4 border rounded-sm",
                              `mr-${spacing.sm}`,
                              textColors.muted,
                            )}
                          />
                        )}
                        <div>
                          <div
                            className={cn(
                              "font-medium flex items-center",
                              typography.body,
                            )}
                          >
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
                            <div className={createTextStyle("small", "muted")}>
                              {channel.title}
                            </div>
                          )}
                        </div>
                      </div>

                      {channel.stats && (
                        <div className={createTextStyle("small", "muted")}>
                          <div
                            className={cn(
                              "flex items-center",
                              `space-x-${spacing.sm}`,
                            )}
                          >
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
            <FormField label="Добавить канал вручную">
              <div className={cn("flex", `gap-${spacing.sm}`)}>
                <Input
                  placeholder="Введите @username канала"
                  className={cn(components.input.base, "flex-1")}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  onClick={handleAddManualChannel}
                  disabled={!manualInput.trim()}
                  className={createButtonStyle("primary")}
                >
                  Добавить
                </Button>
              </div>
            </FormField>

            <div
              className={cn(
                createTextStyle("tiny", "muted"),
                `mb-${spacing.sm}`,
              )}
            >
              <AlertCircle size={12} className="inline mr-1" />
              Вводите юзернеймы каналов с @ или без, например: @channel_name
              или channel_name
            </div>

            <ScrollArea
              className={cn(
                "flex-1 border border-blue-500/20 rounded-md bg-slate-900/30",
                `p-${spacing.md}`,
              )}
            >
              {manualChannels.length === 0 ? (
                <EmptyState
                  icon={<Plus size={12} />}
                  title="Добавьте каналы, введя их @username"
                />
              ) : (
                <div className={`space-y-${spacing.sm}`}>
                  {manualChannels.map((username) => (
                    <div
                      key={username}
                      className={cn(
                        "flex items-center justify-between",
                        `px-${spacing.sm} py-${spacing.sm}`,
                        "bg-slate-800/70 rounded-md",
                      )}
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            typography.weight.medium,
                            typography.body,
                          )}
                        >
                          @{username}
                        </div>
                        <a
                          href={`https://t.me/${username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            textColors.muted,
                            "ml-1 hover:text-blue-400",
                          )}
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveManualChannel(username)}
                        className={createButtonStyle("danger")}
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

        {/* Selection counter */}
        <SelectionCounter
          count={totalSelected}
          itemName="Выбрано каналов"
          getItemWord={getChannelWord}
        />
      </div>

      <ActionButtons
        onCancel={() => onOpenChange(false)}
        onConfirm={handleAddChannels}
        confirmText={`Добавить ${totalSelected} ${getChannelWord(totalSelected)}`}
        confirmDisabled={totalSelected === 0}
        isLoading={isAdding}
        loadingText="Добавление..."
        confirmIcon={<Plus size={16} />}
      />
    </DialogWrapper>
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