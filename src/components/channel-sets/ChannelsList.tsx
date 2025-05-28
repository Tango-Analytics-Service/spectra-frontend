// src/components/channel-sets/ChannelsList.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  HourglassIcon,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  SearchIcon,
  Users,
  AlertCircle,
  LoaderCircle,
  MoreHorizontal,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  components,
  typography,
  spacing,
  createCardStyle,
  createButtonStyle,
  createBadgeStyle,
  animations,
  createTextStyle,
  textColors,
} from "@/lib/design-system";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { ChannelInSet, ChannelParsingStatus } from "@/types/channel-sets";
import { useChannelSets } from "@/contexts/ChannelSetsContext";

interface ChannelsListProps {
  channels: ChannelInSet[];
  setId: string;
}

// Sort types
type SortField = "username" | "added_at" | "is_parsed";
type SortDirection = "asc" | "desc";

// Filter types
type FilterOptions = {
  status: "all" | "parsed" | "unparsed";
  search: string;
};

const ChannelsList: React.FC<ChannelsListProps> = ({ channels, setId }) => {
  const { removeChannelsFromSet } = useChannelSets();

  // State
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "added_at",
    direction: "desc",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    search: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derived state
  const filteredAndSortedChannels = useMemo(() => {
    // Apply filters
    let result = [...channels];

    // Filter by status
    if (filters.status === "parsed") {
      result = result.filter((channel) => channel.is_parsed);
    } else if (filters.status === "unparsed") {
      result = result.filter((channel) => !channel.is_parsed);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((channel) =>
        channel.username.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      // Handle different field types
      if (sortConfig.field === "username") {
        return sortConfig.direction === "asc"
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username);
      } else if (sortConfig.field === "added_at") {
        return sortConfig.direction === "asc"
          ? new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
          : new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
      } else if (sortConfig.field === "is_parsed") {
        return sortConfig.direction === "asc"
          ? (a.is_parsed ? 1 : 0) - (b.is_parsed ? 1 : 0)
          : (b.is_parsed ? 1 : 0) - (a.is_parsed ? 1 : 0);
      }
      return 0;
    });

    return result;
  }, [channels, sortConfig, filters]);

  // Handlers
  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleDeleteClick = (username: string) => {
    setChannelToDelete(username);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!channelToDelete) return;

    setIsDeleting(true);
    try {
      const result = await removeChannelsFromSet(setId, [channelToDelete]);
      if (result.success) {
        setShowDeleteDialog(false);
        toast({
          title: "Успешно",
          description: "Канал удален из набора",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить канал",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (isParsed: boolean) => {
    if (isParsed) {
      return <CheckCircle2 size={16} className={textColors.success} />;
    } else {
      return <HourglassIcon size={16} className={textColors.warning} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Empty state
  if (channels.length === 0) {
    return (
      <div
        className={cn(
          createCardStyle(),
          "text-center",
          `py-${spacing.xl}`,
          animations.fadeIn,
        )}
      >
        <div className="flex flex-col items-center justify-center">
          <Users size={48} className={cn(textColors.accent, "opacity-50 mb-4")} />
          <h3 className={cn(typography.h3, textColors.primary, "mb-2")}>
            Нет каналов в наборе
          </h3>
          <p className={cn(createTextStyle("small", "muted"), "mb-4")}>
            Добавьте каналы в этот набор, чтобы начать работу
          </p>
          <Button className={createButtonStyle("primary")}>
            Добавить каналы
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div
        className={cn(
          "flex flex-col sm:flex-row",
          `gap-${spacing.md} mb-${spacing.md}`,
        )}
      >
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2",
              textColors.muted
            )}
          />
          <Input
            placeholder="Поиск по @username"
            className={cn(components.input.base, "pl-9")}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filters.status === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters((prev) => ({ ...prev, status: "all" }))}
            className={
              filters.status === "all"
                ? createButtonStyle("primary")
                : createButtonStyle("secondary")
            }
          >
            Все
          </Button>
          <Button
            variant={filters.status === "parsed" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, status: "parsed" }))
            }
            className={
              filters.status === "parsed"
                ? createButtonStyle("success")
                : createButtonStyle("secondary")
            }
          >
            <CheckCircle2 size={14} className={`mr-${spacing.sm}`} />
            Обработанные
          </Button>
          <Button
            variant={filters.status === "unparsed" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setFilters((prev) => ({ ...prev, status: "unparsed" }))
            }
            className={
              filters.status === "unparsed"
                ? createButtonStyle("warning")
                : createButtonStyle("secondary")
            }
          >
            <HourglassIcon size={14} className={`mr-${spacing.sm}`} />
            В процессе
          </Button>
        </div>
      </div>

      {/* Results summary */}
      <div
        className={cn(
          "flex justify-between items-center mb-3",
          createTextStyle("small", "muted")
        )}
      >
        <div>
          Показано {filteredAndSortedChannels.length} из {channels.length}{" "}
          каналов
        </div>
      </div>

      {/* Channels table */}
      <div
        className={cn(
          createCardStyle(),
          "border overflow-hidden"
        )}
      >
        <div className="max-h-96 sm:max-h-[500px] overflow-auto">
          <Table>
            <TableHeader className={cn(
              components.table.header,
              "sticky top-0 z-10"
            )}>
              <TableRow>
                <TableHead
                  className={cn(
                    "w-[200px] cursor-pointer",
                    textColors.muted,
                    "hover:" + textColors.accent
                  )}
                  onClick={() => handleSort("username")}
                >
                  <div className="flex items-center">
                    Канал
                    {sortConfig.field === "username" && (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} className={`ml-${spacing.sm}`} />
                      ) : (
                        <ChevronDown size={14} className={`ml-${spacing.sm}`} />
                      )
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className={cn(
                    "cursor-pointer",
                    textColors.muted,
                    "hover:" + textColors.accent
                  )}
                  onClick={() => handleSort("is_parsed")}
                >
                  <div className="flex items-center">
                    Статус
                    {sortConfig.field === "is_parsed" && (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} className={`ml-${spacing.sm}`} />
                      ) : (
                        <ChevronDown size={14} className={`ml-${spacing.sm}`} />
                      )
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className={cn(
                    "cursor-pointer",
                    textColors.muted,
                    "hover:" + textColors.accent
                  )}
                  onClick={() => handleSort("added_at")}
                >
                  <div className="flex items-center">
                    Добавлен
                    {sortConfig.field === "added_at" && (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} className={`ml-${spacing.sm}`} />
                      ) : (
                        <ChevronDown size={14} className={`ml-${spacing.sm}`} />
                      )
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedChannels.map((channel, index) => (
                <TableRow
                  key={channel.username}
                  className="hover:bg-slate-800/30 transition-colors duration-200"
                >
                  <TableCell className={typography.weight.medium}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`https://t.me/${channel.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center",
                            textColors.primary,
                            "hover:" + textColors.accent
                          )}
                        >
                          @{channel.username}
                          <ExternalLink size={12} className={`ml-${spacing.sm}`} />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Открыть канал в Telegram</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(channel.is_parsed)}
                      <span className={cn(textColors.primary, `ml-${spacing.sm}`)}>
                        {channel.is_parsed ? "Обработан" : "Обработка"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={textColors.muted}>
                    {formatDate(channel.added_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* No results after filtering */}
      {filteredAndSortedChannels.length === 0 && (
        <Alert className={cn("mt-4", createCardStyle())}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ничего не найдено</AlertTitle>
          <AlertDescription className={textColors.muted}>
            По вашему запросу не найдено каналов. Попробуйте изменить параметры
            поиска.
          </AlertDescription>
        </Alert>
      )}

      {/* Delete channel confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className={createCardStyle()}>
          <DialogHeader>
            <DialogTitle className={typography.h3}>Удаление канала</DialogTitle>
            <DialogDescription className={textColors.secondary}>
              Вы действительно хотите удалить канал @{channelToDelete} из
              набора?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className={createButtonStyle("secondary")}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className={createButtonStyle("danger")}
            >
              {isDeleting ? (
                <>
                  <LoaderCircle
                    size={16}
                    className={cn(`mr-${spacing.sm}`, "animate-spin")}
                  />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelsList;