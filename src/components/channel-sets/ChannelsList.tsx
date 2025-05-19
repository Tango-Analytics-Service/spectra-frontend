// src/components/channel-sets/ChannelsList.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HourglassIcon,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  SearchIcon,
  MessageSquare,
  Users,
  Eye,
  Star,
  CalendarClock,
  BarChart2,
  Share2,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (isParsed: boolean) => {
    if (isParsed) {
      return <CheckCircle2 size={16} className="text-green-400" />;
    } else {
      return <HourglassIcon size={16} className="text-amber-400" />;
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
      <div className="text-center py-10 border border-blue-500/20 rounded-lg bg-slate-800/50">
        <div className="flex flex-col items-center justify-center">
          <Users size={48} className="text-blue-400/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Нет каналов в наборе</h3>
          <p className="text-sm text-gray-400 mb-4">
            Добавьте каналы в этот набор, чтобы начать работу
          </p>
          <Button
            onClick={() => {}}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            Добавить каналы
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Поиск по @username"
            className="pl-9 bg-slate-900/70 border-blue-500/20"
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
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-blue-500/20 text-gray-300"
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
                ? "bg-green-600 hover:bg-green-700"
                : "border-blue-500/20 text-gray-300"
            }
          >
            <CheckCircle2 size={14} className="mr-1" />
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
                ? "bg-amber-600 hover:bg-amber-700"
                : "border-blue-500/20 text-gray-300"
            }
          >
            <HourglassIcon size={14} className="mr-1" />В процессе
          </Button>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center mb-3 text-sm text-gray-400">
        <div>
          Показано {filteredAndSortedChannels.length} из {channels.length}{" "}
          каналов
        </div>
      </div>

      {/* Channels table */}
      <div className="border border-blue-500/20 rounded-lg overflow-hidden">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="bg-slate-800/70 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[40px]">№</TableHead>
                <TableHead
                  className="w-[200px] cursor-pointer hover:text-blue-300"
                  onClick={() => handleSort("username")}
                >
                  <div className="flex items-center">
                    Канал
                    {sortConfig.field === "username" && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleSort("is_parsed")}
                >
                  <div className="flex items-center">
                    Статус
                    {sortConfig.field === "is_parsed" && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-blue-300"
                  onClick={() => handleSort("added_at")}
                >
                  <div className="flex items-center">
                    Добавлен
                    {sortConfig.field === "added_at" && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedChannels.map((channel, index) => (
                <TableRow
                  key={channel.username}
                  className="hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`https://t.me/${channel.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-blue-400"
                        >
                          @{channel.username}
                          <ExternalLink size={12} className="ml-1" />
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
                      <span className="ml-1">
                        {channel.is_parsed ? "Обработан" : "Обработка"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(channel.added_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Меню</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-800 border-blue-500/20"
                      >
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-slate-700"
                          onClick={() =>
                            window.open(
                              `https://t.me/${channel.username}`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Открыть канал</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-slate-700"
                          onClick={() => {}}
                        >
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>Анализировать</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-400 hover:bg-red-400/10 hover:text-red-300"
                          onClick={() => handleDeleteClick(channel.username)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Удалить из набора</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* No results after filtering */}
      {filteredAndSortedChannels.length === 0 && (
        <Alert className="mt-4 bg-slate-800/50 border border-blue-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ничего не найдено</AlertTitle>
          <AlertDescription>
            По вашему запросу не найдено каналов. Попробуйте изменить параметры
            поиска.
          </AlertDescription>
        </Alert>
      )}

      {/* Delete channel confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-800 border border-blue-500/20 text-white">
          <DialogHeader>
            <DialogTitle>Удаление канала</DialogTitle>
            <DialogDescription className="text-blue-300">
              Вы действительно хотите удалить канал @{channelToDelete} из
              набора?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-blue-500/20 text-blue-300"
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoaderCircle size={16} className="mr-1 animate-spin" />
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

// Additional components needed for the ChannelsList
import { MoreHorizontal, LoaderCircle } from "lucide-react";

export default ChannelsList;
