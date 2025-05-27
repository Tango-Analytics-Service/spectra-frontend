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
import {
  createCardStyle,
  createButtonStyle,
  createBadgeStyle,
  typography,
  spacing,
  components,
  animations,
} from "@/lib/design-system";

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
      <div
        className={cn(
          "container mx-auto",
          `py-${spacing.lg} px-${spacing.md}`,
          "max-w-5xl",
        )}
      >
        <div className={cn("flex items-center", `mb-${spacing.lg}`)}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              createButtonStyle("ghost"),
              `mr-${spacing.sm}`,
              "text-blue-400",
            )}
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={16} className="mr-1" />
            Назад
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>

        <div className={`mb-${spacing.lg}`}>
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        <Skeleton className={cn("h-10 w-full", `mb-${spacing.md}`)} />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  // Render when no channel set found
  if (!channelSet) {
    return (
      <div
        className={cn(
          "container mx-auto",
          `py-${spacing.lg} px-${spacing.md}`,
          "max-w-5xl",
        )}
      >
        <div className={cn("flex items-center", `mb-${spacing.lg}`)}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              createButtonStyle("ghost"),
              `mr-${spacing.sm}`,
              "text-blue-400",
            )}
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={16} className="mr-1" />
            Назад
          </Button>
          <h1 className={cn(typography.h2, "font-semibold")}>
            Набор не найден
          </h1>
        </div>

        <Card className={cn(createCardStyle(), `p-${spacing.lg}`)}>
          <div className="text-center py-12">
            <AlertCircle
              className={cn(
                "mx-auto h-12 w-12 text-amber-400",
                `mb-${spacing.md}`,
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

  // Main content render
  return (
    <div
      className={cn(
        "container mx-auto",
        `py-${spacing.lg} px-${spacing.md}`,
        "max-w-5xl",
        animations.fadeIn,
      )}
    >
      {/* Header with back button and actions */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between",
          `mb-${spacing.lg} gap-${spacing.md}`,
        )}
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              createButtonStyle("ghost"),
              `mr-${spacing.sm}`,
              "text-blue-400",
            )}
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
                className={cn(components.input.base, `w-72 mr-${spacing.sm}`)}
              />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  createButtonStyle("ghost"),
                  "mr-1 text-green-400 hover:text-green-300 hover:bg-green-400/10",
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
                  "text-red-400 hover:text-red-300 hover:bg-red-400/10",
                )}
                onClick={handleCancelEditing}
              >
                <X size={16} className="mr-1" />
                Отмена
              </Button>
            </div>
          ) : (
            <h1 className={cn(typography.h1, "flex items-center")}>
              {channelSet.name}
              {channelSet.is_predefined && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Star size={16} className={cn("ml-2 text-yellow-400")} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Предустановленный набор</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {channelSet.is_public ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Globe size={16} className={cn("ml-2 text-blue-400")} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Публичный набор</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lock size={16} className={cn("ml-2 text-gray-400")} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Приватный набор</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </h1>
          )}
        </div>

        <div className={cn("flex items-center", `space-x-${spacing.sm}`)}>
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

          {!isEditing && !channelSet.is_predefined && (
            <>
              <Button
                variant="outline"
                size="sm"
                className={createButtonStyle("secondary")}
                onClick={handleStartEditing}
              >
                <Edit size={16} className="mr-1" />
                Редактировать
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={cn(createButtonStyle("danger"))}
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
              className={createButtonStyle("secondary")}
            >
              <Share2 size={16} className="mr-1" />
              Поделиться
            </Button>
          )}
        </div>
      </div>

      {/* Channel set info card */}
      <Card className={cn(createCardStyle(), `mb-${spacing.lg}`)}>
        <CardContent className={`p-${spacing.md}`}>
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
                  disabled={channelSet.is_predefined}
                />
                <Label htmlFor="is-public">Публичный набор</Label>
              </div>
            </div>
          ) : (
            <>
              <p className={cn(`mb-${spacing.sm}`, "text-gray-300")}>
                {channelSet.description}
              </p>

              <div
                className={cn(
                  "flex flex-wrap items-center",
                  `gap-x-${spacing.lg} gap-y-${spacing.sm}`,
                  typography.small,
                  "text-gray-400",
                )}
              >
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

      {/* Tabs for channels/settings */}
      <Tabs
        defaultValue="channels"
        value={activeTab}
        onValueChange={setActiveTab}
        className={`mb-${spacing.lg}`}
      >
        <TabsList className="bg-slate-800">
          <TabsTrigger
            value="channels"
            className="data-[state=active]:bg-blue-500"
          >
            <Users size={16} className={`mr-${spacing.sm}`} />
            Каналы
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-blue-500"
          >
            <Settings size={16} className={`mr-${spacing.sm}`} />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className={`mt-${spacing.md}`}>
          <AnalysisTab channelSet={channelSet} />
        </TabsContent>

        <TabsContent value="channels" className={`mt-${spacing.md}`}>
          <div
            className={cn(
              "flex justify-between items-center",
              `mb-${spacing.md}`,
            )}
          >
            <div className={cn(typography.h3, "font-medium")}>
              Каналы в наборе
            </div>
            <Button
              onClick={() => setShowAddChannelsDialog(true)}
              className={createButtonStyle("primary")}
            >
              <Plus size={16} className="mr-1" />
              Добавить каналы
            </Button>
          </div>

          <ChannelsList channels={channelSet.channels} setId={channelSet.id} />
        </TabsContent>

        <TabsContent value="settings" className={`mt-${spacing.md}`}>
          <Card className={createCardStyle()}>
            <CardHeader>
              <CardTitle className={cn(typography.h3, "font-medium")}>
                Настройки набора
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  typography.small,
                  "text-gray-400",
                  `mb-${spacing.md}`,
                )}
              >
                Здесь будут дополнительные настройки набора каналов
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className={createCardStyle()}>
          <DialogHeader>
            <DialogTitle className={typography.h3}>Удаление набора</DialogTitle>
            <DialogDescription className="text-blue-300">
              Вы уверены, что хотите удалить набор каналов "{channelSet.name}"?
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
      variantClasses = createBadgeStyle("success");
      break;
    case "warning":
      variantClasses = createBadgeStyle("warning");
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
