// src/components/channel-sets/ChannelsList.tsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    AlertCircle,
    Trash2,
    Calendar,
    Eye,
    Users,
    Loader2,
    Edit,
    MoreHorizontal,
    Check,
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { ChannelInSet } from "@/types/channel-sets";
import {
    createCardStyle,
    createButtonStyle,
    createBadgeStyle,
    createTextStyle,
    typography,
    spacing,
    components,
    animations,
    textColors,
} from "@/lib/design-system";

interface ChannelsListProps {
    channels: ChannelInSet[];
    setId: string;
    canManageChannels?: boolean;
}

const ChannelsList: React.FC<ChannelsListProps> = ({
    channels,
    setId,
    canManageChannels = false,
}) => {
    const { removeChannelsFromSet } = useChannelSets();

    // Состояния
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [removingChannels, setRemovingChannels] = useState<string[]>([]);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [showBulkRemoveDialog, setShowBulkRemoveDialog] = useState(false);
    const [channelToRemove, setChannelToRemove] = useState<string | null>(null);

    // Фильтрация каналов
    const filteredChannels = useMemo(() => {
        if (!searchQuery) return channels;
        return channels.filter((channel) =>
            channel.username.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [channels, searchQuery]);

    // Форматирование даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Получение статуса канала
    const getChannelStatus = (channel: ChannelInSet) => {
        if (channel.is_parsed) {
            return {
                icon: CheckCircle,
                text: "Готов",
                variant: "success" as const,
                color: "text-green-400",
            };
        }
        return {
            icon: AlertCircle,
            text: "Обработка",
            variant: "warning" as const,
            color: "text-yellow-400",
        };
    };

    // Обработчики режима редактирования
    const handleEditModeToggle = () => {
        setEditMode(!editMode);
        if (editMode) {
            setSelectedChannels([]);
        }
    };

    const handleChannelSelect = (username: string, selected: boolean) => {
        if (selected) {
            setSelectedChannels((prev) => [...prev, username]);
        } else {
            setSelectedChannels((prev) => prev.filter((u) => u !== username));
        }
    };

    const handleSelectAll = () => {
        if (selectedChannels.length === filteredChannels.length) {
            setSelectedChannels([]);
        } else {
            setSelectedChannels(filteredChannels.map((ch) => ch.username));
        }
    };

    // Обработчик удаления одного канала
    const handleRemoveChannel = async (username: string) => {
        setRemovingChannels((prev) => [...prev, username]);
        try {
            const success = await removeChannelsFromSet(setId, [username]);
            if (success) {
                toast({
                    title: "Канал удален",
                    description: "Канал успешно удален из набора",
                });
            }
        } catch (error) {
            console.error("Error removing channel:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить канал",
                variant: "destructive",
            });
        } finally {
            setRemovingChannels((prev) => prev.filter((u) => u !== username));
            setShowRemoveDialog(false);
            setChannelToRemove(null);
        }
    };

    // Обработчик массового удаления
    const handleBulkRemove = async () => {
        if (selectedChannels.length === 0) return;

        setRemovingChannels([...selectedChannels]);
        try {
            const success = await removeChannelsFromSet(setId, selectedChannels);
            if (success) {
                toast({
                    title: "Каналы удалены",
                    description: `Удалено каналов: ${selectedChannels.length}`,
                });
                setSelectedChannels([]);
            }
        } catch (error) {
            console.error("Error removing channels:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить каналы",
                variant: "destructive",
            });
        } finally {
            setRemovingChannels([]);
            setShowBulkRemoveDialog(false);
        }
    };

    // Состояние пустого списка
    if (channels.length === 0) {
        return (
            <div
                className={cn(
                    createCardStyle(),
                    "flex flex-col items-center justify-center text-center",
                    `p-${spacing.xl}`,
                    "border-dashed",
                    animations.fadeIn,
                )}
            >
                <Users size={48} className="text-blue-400/50 mb-4" />
                <h3 className={cn(typography.h3, "mb-2")}>В наборе пока нет каналов</h3>
                <p className={cn(createTextStyle("small", "muted"), "mb-4")}>
                    {canManageChannels
                        ? "Нажмите 'Добавить каналы', чтобы начать"
                        : "Каналы будут добавлены администратором"}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Поиск */}
            <div className={cn("mb-4", animations.fadeIn)}>
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        placeholder="Поиск каналов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(components.input.base, "pl-10")}
                    />
                </div>
            </div>

            {/* Панель управления в режиме редактирования */}
            {editMode && canManageChannels && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        createCardStyle(),
                        `p-${spacing.sm} mb-${spacing.sm}`,
                        "flex items-center justify-between flex-wrap gap-2",
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                            className={createButtonStyle("secondary")}
                        >
                            {selectedChannels.length === filteredChannels.length
                                ? "Снять выделение"
                                : "Выбрать все"}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditModeToggle}
                            className={createButtonStyle("primary")}
                        >
                            <Check size={16} className="mr-1" />
                            Готово
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {selectedChannels.length > 0 && (
                            <>
                                <span className={cn(createTextStyle("small", "muted"))}>
                                    Выбрано: {selectedChannels.length}
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkRemoveDialog(true)}
                                    disabled={removingChannels.length > 0}
                                    className={createButtonStyle("danger")}
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Удалить выбранные
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Кнопка "Изменить" в обычном режиме */}
            {!editMode && canManageChannels && filteredChannels.length > 0 && (
                <div className={cn("flex justify-end", `mb-${spacing.sm}`)}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditModeToggle}
                        className={createButtonStyle("secondary")}
                    >
                        <Edit size={16} className="mr-1" />
                        Изменить
                    </Button>
                </div>
            )}

            {/* Список каналов */}
            <div className={cn(`space-y-${spacing.sm}`, animations.fadeIn)}>
                {filteredChannels.map((channel, index) => {
                    const status = getChannelStatus(channel);
                    const isRemoving = removingChannels.includes(channel.username);
                    const isSelected = selectedChannels.includes(channel.username);

                    return (
                        <motion.div
                            key={channel.username}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.02 }}
                            className={cn(
                                createCardStyle(),
                                "transition-all duration-200",
                                `p-${spacing.md}`,
                                "group",
                                editMode &&
                                isSelected &&
                                "ring-2 ring-blue-500/50 bg-blue-500/5",
                                !editMode && components.card.hover,
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {/* Чекбокс в режиме редактирования */}
                                <AnimatePresence>
                                    {editMode && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                            animate={{ opacity: 1, scale: 1, width: "auto" }}
                                            exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) =>
                                                    handleChannelSelect(
                                                        channel.username,
                                                        checked as boolean,
                                                    )
                                                }
                                                disabled={isRemoving}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Аватар канала */}
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0",
                                        "bg-gradient-to-br from-blue-500 to-blue-600",
                                    )}
                                >
                                    {channel.username.charAt(0).toUpperCase()}
                                </div>

                                {/* Основная информация */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4
                                            className={cn(
                                                typography.h4,
                                                "text-white truncate flex items-center gap-1",
                                            )}
                                        >
                                            {channel.channel_id ? (
                                                <a
                                                    href={`https://t.me/${channel.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    @{channel.username}
                                                </a>
                                            ) : (
                                                `@${channel.username}`
                                            )}
                                        </h4>

                                        {/* Статус */}
                                        <span
                                            className={cn(
                                                createBadgeStyle(status.variant),
                                                "flex items-center gap-1 text-[10px]",
                                            )}
                                        >
                                            <status.icon size={10} />
                                            <span>{status.text}</span>
                                        </span>
                                    </div>

                                    {/* Дополнительная информация - только в обычном режиме */}
                                    <AnimatePresence>
                                        {!editMode && (
                                            <motion.div
                                                initial={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-4 text-xs text-gray-400"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    <span>Добавлен: {formatDate(channel.added_at)}</span>
                                                </div>

                                                {channel.channel_id && (
                                                    <div className="flex items-center gap-1">
                                                        <Eye size={12} />
                                                        <span>ID: {channel.channel_id}</span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Действия */}
                                <div className="flex items-center gap-1">
                                    {isRemoving ? (
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span className="text-xs">Удаление...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {/* В обычном режиме показываем контекстное меню */}
                                            {!editMode && canManageChannels && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={cn(
                                                                createButtonStyle("ghost"),
                                                                "opacity-0 group-hover:opacity-100 transition-opacity",
                                                                "text-gray-400 hover:text-white hover:bg-slate-800/50",
                                                            )}
                                                        >
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setChannelToRemove(channel.username);
                                                                setShowRemoveDialog(true);
                                                            }}
                                                            className="text-red-400 focus:text-red-300"
                                                        >
                                                            <Trash2 size={14} className="mr-2" />
                                                            Удалить канал
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}

                                            {/* В режиме редактирования показываем кнопку удаления */}
                                            <AnimatePresence>
                                                {editMode && canManageChannels && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                                                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setChannelToRemove(channel.username);
                                                                setShowRemoveDialog(true);
                                                            }}
                                                            className={cn(
                                                                createButtonStyle("danger"),
                                                                "opacity-70 hover:opacity-100",
                                                            )}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Информация о результатах поиска */}
            {searchQuery && (
                <div
                    className={cn("mt-4 text-center", createTextStyle("small", "muted"))}
                >
                    {filteredChannels.length === 0
                        ? "Каналы не найдены"
                        : `Найдено каналов: ${filteredChannels.length} из ${channels.length}`}
                </div>
            )}

            {/* Диалог удаления одного канала */}
            <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <DialogContent className={createCardStyle()}>
                    <DialogHeader>
                        <DialogTitle className={typography.h3}>Удаление канала</DialogTitle>
                        <DialogDescription className={textColors.secondary}>
                            Вы уверены, что хотите удалить канал &quot;@{channelToRemove}&quot; из
                            набора? Этот канал можно будет добавить обратно в любое время.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRemoveDialog(false);
                                setChannelToRemove(null);
                            }}
                            className={createButtonStyle("secondary")}
                            disabled={removingChannels.length > 0}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                channelToRemove && handleRemoveChannel(channelToRemove)
                            }
                            disabled={removingChannels.length > 0}
                            className={createButtonStyle("danger")}
                        >
                            {removingChannels.length > 0 ? (
                                <>
                                    <Loader2 size={16} className="mr-1 animate-spin" />
                                    Удаление...
                                </>
                            ) : (
                                "Удалить"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Диалог массового удаления */}
            <Dialog
                open={showBulkRemoveDialog}
                onOpenChange={setShowBulkRemoveDialog}
            >
                <DialogContent className={createCardStyle()}>
                    <DialogHeader>
                        <DialogTitle className={typography.h3}>
                            Удаление каналов
                        </DialogTitle>
                        <DialogDescription className={textColors.secondary}>
                            Вы уверены, что хотите удалить {selectedChannels.length} выбранных
                            каналов из набора? Эти каналы можно будет добавить обратно в любое
                            время.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowBulkRemoveDialog(false)}
                            className={createButtonStyle("secondary")}
                            disabled={removingChannels.length > 0}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBulkRemove}
                            disabled={removingChannels.length > 0}
                            className={createButtonStyle("danger")}
                        >
                            {removingChannels.length > 0 ? (
                                <>
                                    <Loader2 size={16} className="mr-1 animate-spin" />
                                    Удаление...
                                </>
                            ) : (
                                `Удалить ${selectedChannels.length} каналов`
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ChannelsList;
