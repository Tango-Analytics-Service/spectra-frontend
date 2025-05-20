// src/components/channel-sets/ChannelSetDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Edit,
  Settings,
  Calendar,
  Users,
  Share2,
  Trash2,
  Save,
  X,
  Lock,
  Globe,
  Plus,
  Search,
  RefreshCw,
  ArrowUpDown,
  Filter,
  Star,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge as UIBadge, badgeVariants } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisTab from "../analysis/AnalysisTab";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  ChannelSet,
  ChannelDetails,
  ChannelParsingStatus,
} from "@/types/channel-sets";
import ChannelsList from "./ChannelsList";
import AddChannelsDialog from "./AddChannelsDialog";

const ChannelSetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getChannelSet,
    updateChannelSet,
    refreshChannelSet,
    deleteChannelSet,
  } = useChannelSets();

  // State
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
  const [activeTab, setActiveTab] = useState("channels");

  // Load channel set data
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

  // Handlers
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 text-blue-400"
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={16} className="mr-1" />
            Назад
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  // Render when no channel set found
  if (!channelSet) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 text-blue-400"
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={16} className="mr-1" />
            Назад
          </Button>
          <h1 className="text-xl sm:text-2xl font-semibold">Набор не найден</h1>
        </div>

        <Card className="bg-slate-800/50 border border-blue-500/20 text-white p-6">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-400 mb-4" />
            <p className="text-lg mb-4">
              Набор каналов не найден или был удален
            </p>
            <Button onClick={() => navigate("/")}>
              Вернуться к списку наборов
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Main content render
  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Header with back button and actions */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 text-blue-400"
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={16} className="mr-1" />
            Назад
          </Button>

          {isEditing ? (
            <div className="flex items-center">
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-72 mr-2 bg-slate-900 border-blue-500/20"
              />
              <Button
                variant="ghost"
                size="sm"
                className="mr-1 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                onClick={handleSaveEditing}
              >
                <Save size={16} className="mr-1" />
                Сохранить
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                onClick={handleCancelEditing}
              >
                <X size={16} className="mr-1" />
                Отмена
              </Button>
            </div>
          ) : (
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
              {channelSet.name}
              {channelSet.is_predefined && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Star size={16} className="ml-2 text-yellow-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Предустановленный набор</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {channelSet.is_public ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Globe size={16} className="ml-2 text-blue-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Публичный набор</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lock size={16} className="ml-2 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Приватный набор</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/20 text-blue-300"
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

          {!isEditing && !channelSet.is_predefined && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500/20 text-blue-300"
                onClick={handleStartEditing}
              >
                <Edit size={16} className="mr-1" />
                Редактировать
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-300 hover:bg-red-500/10"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={16} className="mr-1" />
                Удалить
              </Button>
            </>
          )}

          {channelSet.is_public && (
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/20 text-blue-300"
            >
              <Share2 size={16} className="mr-1" />
              Поделиться
            </Button>
          )}
        </div>
      </div>

      {/* Channel set info card */}
      <Card className="bg-slate-800/50 border border-blue-500/20 text-white mb-6">
        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
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
                  className="bg-slate-900 border-blue-500/20"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-public"
                  checked={editForm.is_public}
                  onCheckedChange={(value) =>
                    setEditForm((prev) => ({ ...prev, is_public: value }))
                  }
                  disabled={channelSet.is_predefined}
                />
                <Label htmlFor="is-public">Публичный набор</Label>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-3 text-gray-300">{channelSet.description}</p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    Создан:{" "}
                    {new Date(channelSet.created_at).toLocaleDateString()}
                  </span>
                </div>

                {channelSet.updated_at && (
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      Обновлен:{" "}
                      {new Date(channelSet.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  <span>Каналов: {channelSet.channel_count}</span>
                </div>

                <div>
                  <Badge
                    variant={channelSet.all_parsed ? "success" : "warning"}
                    className="ml-1"
                  >
                    {channelSet.all_parsed
                      ? "Все каналы обработаны"
                      : "Не все каналы обработаны"}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabs for channels/stats/settings */}
      <Tabs
        defaultValue="channels"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="bg-slate-800">
          <TabsTrigger
            value="channels"
            className="data-[state=active]:bg-blue-500"
          >
            <Users size={16} className="mr-2" />
            Каналы
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-blue-500"
          >
            <Settings size={16} className="mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-4">
          <AnalysisTab channelSet={channelSet} />
        </TabsContent>

        <TabsContent value="channels" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium">Каналы в наборе</div>
            <Button
              onClick={() => setShowAddChannelsDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              <Plus size={16} className="mr-1" />
              Добавить каналы
            </Button>
          </div>

          <ChannelsList channels={channelSet.channels} setId={channelSet.id} />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card className="bg-slate-800/50 border border-blue-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Настройки набора
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Здесь будут дополнительные настройки набора каналов
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-800 border border-blue-500/20 text-white">
          <DialogHeader>
            <DialogTitle>Удаление набора</DialogTitle>
            <DialogDescription className="text-blue-300">
              Вы уверены, что хотите удалить набор каналов "{channelSet.name}"?
              Это действие нельзя отменить.
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
              onClick={handleDeleteSet}
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

      {/* Add channels dialog */}
      <AddChannelsDialog
        open={showAddChannelsDialog}
        onOpenChange={setShowAddChannelsDialog}
        setId={channelSet.id}
      />
    </div>
  );
};

// Add custom Badge variants
UIBadge.defaultProps = {
  ...UIBadge.defaultProps,
  variant: "default",
};

type ExtendedBadgeProps = React.ComponentPropsWithoutRef<typeof Badge> & {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
};

const Badge = ({
  className,
  variant = "default",
  ...props
}: ExtendedBadgeProps) => {
  let variantClasses = "";

  switch (variant) {
    case "success":
      variantClasses = "bg-green-500/10 text-green-400 border-green-500/20";
      break;
    case "warning":
      variantClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      break;
    default:
      variantClasses = "";
  }

  return (
    <div
      className={cn(badgeVariants({ variant }), variantClasses, className)}
      {...props}
    />
  );
};

export default ChannelSetDetailsPage;
