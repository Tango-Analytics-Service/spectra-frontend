import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Upload,
  X,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useChannelSets } from "@/contexts/ChannelSetsContext";
import { cn } from "@/lib/utils";
import {
  createButtonStyle,
  createCardStyle,
  createTextStyle,
  components,
  typography,
  spacing,
  textColors,
  animations,
} from "@/lib/design-system";
import {
  DialogWrapper,
  FormField,
  ActionButtons,
  EmptyState,
} from "@/components/ui/dialog-components";

interface Channel {
  id: string;
  original: string;
  username: string;
  isValid: boolean;
  isDuplicate?: boolean;
  isFormatValid?: boolean;
}

interface AddChannelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setId: string;
  existingChannels?: string[]; // Список уже существующих каналов в наборе
}

const AddChannelsDialog: React.FC<AddChannelsDialogProps> = ({
  open,
  onOpenChange,
  setId,
  existingChannels = [],
}) => {
  const { addChannelsToSet } = useChannelSets();

  // State
  const [bulkInput, setBulkInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Парсинг каналов в реальном времени
  const parsedChannels = useMemo(() => {
    if (!bulkInput.trim()) return [];

    const lines = bulkInput
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const processed = lines.map((line) => {
      const original = line;
      let username = line;

      // Извлекаем username из различных форматов
      if (line.includes("t.me/")) {
        const match = line.match(/t\.me\/([a-zA-Z0-9_]+)/);
        username = match ? match[1] : line;
      } else if (line.startsWith("@")) {
        username = line.substring(1);
      }

      // Валидация username (5-32 символа, только буквы, цифры и _)
      const isValid = /^[a-zA-Z0-9_]{5,32}$/.test(username);

      // Проверка на дубликаты с существующими каналами
      const isDuplicate = existingChannels.includes(username);

      return {
        id: Math.random().toString(36).substr(2, 9),
        original,
        username,
        isValid: isValid && !isDuplicate,
        isDuplicate,
        isFormatValid: isValid,
      };
    });

    // Удаляем дубликаты по username внутри введенного списка
    const unique = processed.filter(
      (channel, index, self) =>
        index === self.findIndex((c) => c.username === channel.username),
    );

    return unique;
  }, [bulkInput, existingChannels]);

  const validChannels = parsedChannels.filter((ch) => ch.isValid);
  const invalidChannels = parsedChannels.filter((ch) => !ch.isValid);
  const duplicateChannels = parsedChannels.filter((ch) => ch.isDuplicate);

  // Обработчики
  const handleInputChange = (value: string) => {
    setBulkInput(value);
  };

  const handlePasteExample = () => {
    const example = `@durov
https://t.me/telegram
breakingmash
tginfo`;
    setBulkInput(example);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBulkInput((e.target?.result as string) || "");
      };
      reader.readAsText(file);
    }
  };

  const handleAddChannels = async () => {
    if (validChannels.length === 0) return;

    setIsAdding(true);
    try {
      const usernames = validChannels.map((ch) => ch.username);
      const result = await addChannelsToSet(setId, usernames);

      if (result.success) {
        // Проверяем, были ли частичные ошибки
        if (result.added && result.failed) {
          const addedCount = result.added.length;
          const failedCount = result.failed.length;

          if (addedCount > 0 && failedCount > 0) {
            toast({
              title: "Частично выполнено",
              description: `Добавлено ${addedCount} ${getChannelWord(addedCount)}. ${failedCount} не удалось добавить.`,
            });
          } else if (addedCount > 0) {
            toast({
              title: "Успешно",
              description: `Добавлено ${addedCount} ${getChannelWord(addedCount)} в набор`,
            });
          }
        } else {
          toast({
            title: "Успешно",
            description: `Добавлено ${validChannels.length} ${getChannelWord(validChannels.length)} в набор`,
          });
        }
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

  // Сброс при закрытии
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setBulkInput("");
      }, 300);
    }
  }, [open]);

  const isFormValid = validChannels.length > 0;

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Добавление каналов"
      description="Добавьте каналы в набор, используя различные форматы"
      maxWidth="max-w-3xl"
    >
      <div
        className={cn("flex flex-col", `gap-${spacing.lg}`, `py-${spacing.sm}`)}
      >
        {/* Поле ввода */}
        <FormField label="Список каналов">
          <div className={`space-y-${spacing.sm}`}>
            <Textarea
              placeholder={`Введите каналы в любом формате:

@username
https://t.me/channel
channel_name

Разделяйте каналы новыми строками или запятыми`}
              value={bulkInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className={cn(components.input.base, "min-h-[120px] resize-none")}
              rows={6}
            />

            {/* Вспомогательные кнопки */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePasteExample}
                className={createButtonStyle("secondary")}
              >
                <Copy size={14} className={`mr-${spacing.sm}`} />
                Пример
              </Button>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  className={cn(
                    createButtonStyle("secondary"),
                    "inline-flex items-center gap-2 px-3 py-1.5 text-sm",
                  )}
                >
                  <Upload size={14} />
                  Загрузить файл
                </div>
              </label>
            </div>
          </div>
        </FormField>

        {/* Подсказка по форматам */}
        <div
          className={cn(
            createCardStyle(),
            "bg-blue-500/5 border-blue-500/20",
            `p-${spacing.md}`,
          )}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={16}
              className={cn(textColors.accent, "mt-0.5 flex-shrink-0")}
            />
            <div className={createTextStyle("small", "secondary")}>
              <div className="font-medium mb-1">Поддерживаемые форматы:</div>
              <ul className="space-y-1 text-gray-400">
                <li>• @username или username</li>
                <li>• https://t.me/username или t.me/username</li>
                <li>
                  • Разделение новыми строками, запятыми или точками с запятой
                </li>
                {existingChannels.length > 0 && (
                  <li className="text-amber-400">
                    • Дубликаты с существующими каналами будут пропущены
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Предпросмотр каналов */}
        {parsedChannels.length > 0 && (
          <div className={`space-y-${spacing.sm}`}>
            <div className="flex items-center justify-between">
              <h3 className={cn(typography.h4, textColors.primary)}>
                Предпросмотр
              </h3>
              <div className="flex items-center gap-4">
                {validChannels.length > 0 && (
                  <span className={cn(createTextStyle("small", "success"))}>
                    ✓ {validChannels.length} готово
                  </span>
                )}
                {invalidChannels.length > 0 && (
                  <span className={cn(createTextStyle("small", "error"))}>
                    ✗ {invalidChannels.length} ошибок
                  </span>
                )}
                {duplicateChannels.length > 0 && (
                  <span className="text-amber-400 text-sm">
                    ⚠ {duplicateChannels.length} дубликатов
                  </span>
                )}
              </div>
            </div>

            <div
              className={cn(createCardStyle(), "bg-slate-900/30", "max-h-48")}
            >
              <ScrollArea className="h-full max-h-48">
                <div className={`p-${spacing.sm} space-y-2`}>
                  {parsedChannels.map((channel) => (
                    <ChannelPreviewItem key={channel.id} channel={channel} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Пустое состояние когда нет каналов */}
        {bulkInput.trim() && parsedChannels.length === 0 && (
          <EmptyState
            icon={<AlertCircle size={32} />}
            title="Каналы не распознаны"
            description="Проверьте формат введенных данных"
          />
        )}
      </div>

      <ActionButtons
        onCancel={() => onOpenChange(false)}
        onConfirm={handleAddChannels}
        confirmText={`Добавить ${validChannels.length} ${getChannelWord(validChannels.length)}`}
        confirmDisabled={!isFormValid}
        isLoading={isAdding}
        loadingText="Добавляем каналы..."
        confirmIcon={<Plus size={16} />}
      />
    </DialogWrapper>
  );
};

// Компонент для предпросмотра отдельного канала
interface ChannelPreviewItemProps {
  channel: Channel;
}

const ChannelPreviewItem: React.FC<ChannelPreviewItemProps> = ({ channel }) => {
  const getStatusIcon = () => {
    if (channel.isValid) {
      return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
    } else if (channel.isDuplicate) {
      return (
        <AlertCircle size={16} className="text-yellow-400 flex-shrink-0" />
      );
    } else {
      return <AlertCircle size={16} className="text-red-400 flex-shrink-0" />;
    }
  };

  const getStatusColor = () => {
    if (channel.isValid) {
      return "bg-green-500/10 border border-green-500/20";
    } else if (channel.isDuplicate) {
      return "bg-yellow-500/10 border border-yellow-500/20";
    } else {
      return "bg-red-500/10 border border-red-500/20";
    }
  };

  const getTextColor = () => {
    if (channel.isValid) {
      return "text-green-100";
    } else if (channel.isDuplicate) {
      return "text-yellow-100";
    } else {
      return "text-red-100";
    }
  };

  const getErrorMessage = () => {
    if (channel.isDuplicate) {
      return "Канал уже есть в наборе";
    } else if (!channel.isFormatValid) {
      return "Неверный формат (5-32 символа, только буквы, цифры и _)";
    }
    return null;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        `p-${spacing.sm}`,
        "rounded-md transition-colors",
        getStatusColor(),
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getStatusIcon()}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium truncate", getTextColor())}>
              @{channel.username}
            </span>
            <a
              href={`https://t.me/${channel.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
            </a>
          </div>

          {getErrorMessage() && (
            <div
              className="text-xs mt-0.5"
              style={{ color: channel.isDuplicate ? "#fbbf24" : "#f87171" }}
            >
              {getErrorMessage()}
            </div>
          )}

          {channel.original !== channel.username && (
            <div className="text-xs text-gray-500 mt-0.5 truncate">
              Из: {channel.original}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для склонения слова "канал"
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
