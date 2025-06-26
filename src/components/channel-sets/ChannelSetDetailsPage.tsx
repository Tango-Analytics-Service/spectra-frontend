// src/components/channel-sets/ChannelSetDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Edit,
    Calendar,
    Users,
    Trash2,
    Save,
    X,
    Lock,
    Globe,
    Plus,
    RefreshCw,
    Star,
    AlertCircle,
    LoaderCircle,
    Crown,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { ChannelSet } from "@/types/channel-sets";
import ChannelsList from "./ChannelsList";
import AddChannelsDialog from "./AddChannelsDialog";
import ChannelSetStatus from "./ChannelSetStatus";
import {
    createCardStyle,
    createButtonStyle,
    createTextStyle,
    typography,
    spacing,
    components,
    animations,
    textColors,
} from "@/lib/design-system";
import StartAnalysisDialog from "../analysis/StartAnalysisDialog";

const ChannelSetDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        getChannelSet,
        updateChannelSet,
        refreshChannelSet,
        deleteChannelSet,
    } = useChannelSets();

    // Состояния
    const [channelSet, setChannelSet] = useState<ChannelSet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        description: "",
        is_public: false,
    });
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAddChannelsDialog, setShowAddChannelsDialog] = useState(false);
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

    // Загрузка данных набора
    useEffect(() => {
        if (!id) return;

        const loadChannelSet = async () => {
            setIsLoading(true);
            try {
                const set = await getChannelSet(id);
                if (set) {
                    setChannelSet(set);
                    setEditForm({
                        name: set.name,
                        description: set.description,
                        is_public: set.is_public,
                    });
                } else {
                    toast({
                        title: "Ошибка",
                        description: "Набор каналов не найден",
                        variant: "destructive",
                    });
                    navigate("/");
                }
            } catch (error) {
                console.error("Error loading channel set:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChannelSet();
    }, [id, getChannelSet, navigate]);

    // Обработчики
    const handleRefresh = async () => {
        if (!id || !channelSet) return;

        setIsRefreshing(true);
        try {
            const refreshedSet = await refreshChannelSet(id);
            if (refreshedSet) {
                setChannelSet(refreshedSet);
                toast({
                    title: "Обновлено",
                    description: "Данные набора обновлены",
                });
            }
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleStartEditing = () => {
        if (!channelSet) return;
        setEditForm({
            name: channelSet.name,
            description: channelSet.description,
            is_public: channelSet.is_public,
        });
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
    };

    const handleSaveEditing = async () => {
        if (!id || !channelSet) return;

        try {
            const updatedSet = await updateChannelSet(id, {
                name: editForm.name,
                description: editForm.description,
                is_public: editForm.is_public,
            });

            if (updatedSet) {
                setChannelSet(updatedSet);
                setIsEditing(false);
                toast({
                    title: "Сохранено",
                    description: "Изменения сохранены",
                });
            }
        } catch (error) {
            console.error("Error updating channel set:", error);
        }
    };

    const handleDeleteSet = async () => {
        if (!id) return;

        setIsDeleting(true);
        try {
            const success = await deleteChannelSet(id);
            if (success) {
                toast({
                    title: "Удалено",
                    description: "Набор каналов удален",
                });
                navigate("/");
            }
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleAnalyze = () => {
        if (channelSet) {
            setAnalysisDialogOpen(true);
        }
    };

    const handleStartAnalysis = async () => {
        try {
            toast({
                title: "Анализ запущен",
                description: "Результаты анализа будут доступны в скором времени",
            });
        } catch (error) {
            console.error("Error starting analysis:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось запустить анализ",
                variant: "destructive",
            });
        }
    };

    // Получение статуса доступа для отображения
    const getAccessStatusInfo = () => {
        if (!channelSet) return null;

        if (channelSet.is_owned_by_user) {
            return {
                icon: Crown,
                text: "Владелец",
                color: "text-yellow-400",
            };
        }

        if (channelSet.permissions.can_edit) {
            return {
                icon: Edit,
                text: "Редактор",
                color: "text-blue-400",
            };
        }

        return {
            icon: Eye,
            text: "Просмотр",
            color: "text-gray-400",
        };
    };

    // Состояния загрузки
    if (isLoading) {
        return (
            <div
                className={cn(
                    "container mx-auto",
                    `py-${spacing.lg} px-${spacing.md}`,
                    "max-w-5xl",
                )}
            >
                <div className={`mb-${spacing.lg}`}>
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>

                <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
        );
    }

    if (!channelSet) {
        return (
            <div
                className={cn(
                    "container mx-auto",
                    `py-${spacing.lg} px-${spacing.md}`,
                    "max-w-5xl",
                )}
            >
                <Card className={cn(createCardStyle(), `p-${spacing.lg}`)}>
                    <div className="text-center py-12">
                        <AlertCircle
                            className={cn(
                                "mx-auto h-12 w-12",
                                `mb-${spacing.md}`,
                                textColors.warning,
                            )}
                        />
                        <p className={cn(typography.h3, `mb-${spacing.md}`)}>
                            Набор каналов не найден или был удален
                        </p>
                        <Button
                            onClick={() => navigate("/")}
                            className={createButtonStyle("primary")}
                        >
                            Вернуться к списку наборов
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const accessInfo = getAccessStatusInfo();

    return (
        <div
            className={cn(
                "container mx-auto",
                `py-${spacing.lg} px-${spacing.md}`,
                "max-w-5xl",
                animations.fadeIn,
            )}
        >
            {/* Заголовок */}
            <div className={cn(`mb-${spacing.lg}`)}>
                <div className="flex items-center mb-4">
                    {isEditing ? (
                        <div className="flex items-center flex-1">
                            <Input
                                value={editForm.name}
                                onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className={cn(components.input.base, `flex-1 mr-${spacing.sm}`)}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    createButtonStyle("ghost"),
                                    "mr-1 text-green-400 hover:text-green-300",
                                )}
                                onClick={handleSaveEditing}
                            >
                                <Save size={16} className="mr-1" />
                                Сохранить
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    createButtonStyle("ghost"),
                                    "text-red-400 hover:text-red-300",
                                )}
                                onClick={handleCancelEditing}
                            >
                                <X size={16} className="mr-1" />
                                Отмена
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <h1 className={cn(typography.h1, "flex items-center")}>
                                {channelSet.name}
                                {channelSet.is_predefined && (
                                    <Star size={16} className={cn("ml-2 text-yellow-400")} />
                                )}
                                {channelSet.is_public ? (
                                    <Globe size={16} className={cn("ml-2 text-blue-400")} />
                                ) : (
                                    <Lock size={16} className={cn("ml-2 text-gray-400")} />
                                )}
                            </h1>

                            {/* Индикатор уровня доступа */}
                            {accessInfo && (
                                <div className="flex items-center gap-2">
                                    <accessInfo.icon size={16} className={cn(accessInfo.color)} />
                                    <span
                                        className={cn(
                                            createTextStyle("small", "muted"),
                                            accessInfo.color,
                                        )}
                                    >
                                        {accessInfo.text}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={cn("flex flex-wrap items-center gap-2")}>
                    {!isEditing && (
                        <>
                            {/* Кнопка обновления - доступна если можно редактировать или управлять каналами */}
                            {(channelSet.permissions.can_edit ||
                                channelSet.permissions.can_manage_channels) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={createButtonStyle("secondary")}
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                >
                                    {isRefreshing ? (
                                        <LoaderCircle size={16} className="mr-1 animate-spin" />
                                    ) : (
                                        <RefreshCw size={16} className="mr-1" />
                                    )}
                                        Обновить
                                </Button>
                            )}

                            {/* Кнопка редактирования - доступна если можно редактировать */}
                            {channelSet.permissions.can_edit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={createButtonStyle("secondary")}
                                    onClick={handleStartEditing}
                                >
                                    <Edit size={16} className="mr-1" />
                                    Редактировать
                                </Button>
                            )}

                            {/* Кнопка удаления - доступна если можно удалять */}
                            {channelSet.permissions.can_delete && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={createButtonStyle("danger")}
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Удалить
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Информация о наборе */}
            <div className={cn(createCardStyle(), `mb-${spacing.lg}`)}>
                <div className={`p-${spacing.md}`}>
                    {isEditing ? (
                        <div className={cn(`space-y-${spacing.md} py-${spacing.sm}`)}>
                            <div className={`space-y-${spacing.sm}`}>
                                <Label htmlFor="description">Описание</Label>
                                <Input
                                    id="description"
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className={components.input.base}
                                />
                            </div>

                            <div className={cn("flex items-center", `space-x-${spacing.sm}`)}>
                                <Switch
                                    id="is-public"
                                    checked={editForm.is_public}
                                    onCheckedChange={(value) =>
                                        setEditForm((prev) => ({ ...prev, is_public: value }))
                                    }
                                />
                                <Label htmlFor="is-public">Публичный набор</Label>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className={cn(createTextStyle("body", "muted"), "mb-3")}>
                                    {channelSet.description}
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className={textColors.muted} />
                                            <span className={createTextStyle("small", "muted")}>
                                                {channelSet.channel_count} каналов
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className={textColors.muted} />
                                            <span className={createTextStyle("small", "muted")}>
                                                Обновлен:{" "}
                                                {new Date(channelSet.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:items-end gap-2">
                                        <ChannelSetStatus
                                            channelCount={channelSet.channel_count}
                                            allParsed={channelSet.all_parsed}
                                        />

                                        {/* Кнопка анализа - доступна если можно анализировать */}
                                        {channelSet.permissions.can_analyze &&
                                            channelSet.all_parsed &&
                                            channelSet.channel_count > 0 && (
                                            <Button
                                                onClick={handleAnalyze}
                                                className={createButtonStyle("primary")}
                                            >
                                                    Анализировать
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Управление каналами */}
            <div className={cn(createCardStyle())}>
                <div className={`p-${spacing.md}`}>
                    <div
                        className={cn(
                            "flex justify-between items-center",
                            `mb-${spacing.md}`,
                        )}
                    >
                        <h3 className={cn(typography.h3, "font-medium")}>
                            Каналы в наборе
                        </h3>

                        {/* Кнопка добавления каналов - доступна если можно управлять каналами */}
                        {channelSet.permissions.can_manage_channels && (
                            <Button
                                onClick={() => setShowAddChannelsDialog(true)}
                                className={createButtonStyle("primary")}
                            >
                                <Plus size={16} className="mr-1" />
                                Добавить каналы
                            </Button>
                        )}
                    </div>

                    <ChannelsList
                        channels={channelSet.channels}
                        setId={channelSet.id}
                        canManageChannels={channelSet.permissions.can_manage_channels}
                    />
                </div>
            </div>

            {/* Диалог удаления */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className={createCardStyle()}>
                    <DialogHeader>
                        <DialogTitle className={typography.h3}>Удаление набора</DialogTitle>
                        <DialogDescription className={textColors.secondary}>
                            Вы уверены, что хотите удалить набор каналов &quot;{channelSet.name}&quot;?
                            Это действие нельзя отменить.
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
                            onClick={handleDeleteSet}
                            disabled={isDeleting}
                            className={createButtonStyle("danger")}
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

            {/* Диалог добавления каналов - показывается только если можно управлять каналами */}
            {channelSet.permissions.can_manage_channels && (
                <AddChannelsDialog
                    open={showAddChannelsDialog}
                    onOpenChange={setShowAddChannelsDialog}
                    setId={channelSet.id}
                    existingChannels={channelSet.channels.map((ch) => ch.username)}
                />
            )}

            {/* Диалог анализа - показывается только если можно анализировать */}
            {channelSet.permissions.can_analyze && (
                <StartAnalysisDialog
                    open={analysisDialogOpen}
                    onOpenChange={setAnalysisDialogOpen}
                    onStart={handleStartAnalysis}
                    setId={channelSet.id}
                    channelCount={channelSet.channel_count}
                />
            )}
        </div>
    );
};

export default ChannelSetDetailsPage;
