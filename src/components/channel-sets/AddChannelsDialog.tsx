import React, { useState, useEffect, useMemo } from "react";
import {
    Plus,
    Upload,
    AlertCircle,
    Copy,
    AlertTriangle,
    LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import DialogContent from "@/components/ui/dialog/DialogContent";
import DialogDescription from "@/components/ui/dialog/DialogDescription";
import DialogFooter from "@/components/ui/dialog/DialogFooter";
import DialogHeader from "@/components/ui/dialog/DialogHeader";
import DialogTitle from "@/components/ui/dialog/DialogTitle";
import { Label } from "@/components/ui/label";
import {
    createButtonStyle,
    createCardStyle,
    createTextStyle,
    components,
    typography,
    spacing,
    textColors,
} from "@/lib/design-system";
import ChannelPreviewItem from "./ChannelPreviewItem";
import { useChannelsSetsStore } from "@/stores/useChannelsSetsStore";

// Максимальное количество каналов в наборе
const MAX_CHANNELS_PER_SET = 20;

export interface AddChannelsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setId: string;
    existingChannels?: string[]; // Список уже существующих каналов в наборе
}

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

export default function AddChannelsDialog({ open, onOpenChange, setId, existingChannels = [] }: AddChannelsDialogProps) {
    const addChannelsToSet = useChannelsSetsStore(state => state.addChannelsToSet);

    // State
    const [bulkInput, setBulkInput] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Вычисляем, сколько каналов можно еще добавить
    const remainingSlots = MAX_CHANNELS_PER_SET - existingChannels.length;
    const canAddChannels = remainingSlots > 0;

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
                id: Math.random().toString(36).substring(2, 9),
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

    // Ограничиваем количество каналов для добавления
    const limitedChannels = parsedChannels.slice(0, remainingSlots);
    const exceededChannels = parsedChannels.slice(remainingSlots);

    const validChannels = limitedChannels.filter((ch) => ch.isValid);
    const invalidChannels = limitedChannels.filter((ch) => !ch.isValid);
    const duplicateChannels = limitedChannels.filter((ch) => ch.isDuplicate);

    // Обработчики
    const handleInputChange = (value: string) => {
        setBulkInput(value);
    };

    const handlePasteExample = () => {
        const example = "@durov\nhttps://t.me/telegram\nbreakingmash\ntginfo";
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
            const result = await addChannelsToSet(setId, usernames) as {
                success: boolean,
                added: unknown[],
                failed: unknown[],
                message: string,
            };

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

    const isFormValid = validChannels.length > 0 && canAddChannels;

    // Если достигнут лимит каналов, показываем предупреждение
    if (!canAddChannels) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className={cn(
                        createCardStyle(),
                        "sm:max-w-md max-h-[80vh] flex flex-col p-0",
                    )}
                >
                    {/* Фиксированный заголовок */}
                    <DialogHeader className={"p-6 pb-0 flex-shrink-0"}>
                        <DialogTitle className={typography.h3}>
                            Лимит каналов достигнут
                        </DialogTitle>
                        <DialogDescription className={textColors.secondary}>
                            В наборе может быть максимум {MAX_CHANNELS_PER_SET} каналов
                        </DialogDescription>
                    </DialogHeader>

                    {/* Контент */}
                    <div className="flex-1 overflow-auto px-6 pt-4">
                        <div
                            className={cn(
                                createCardStyle(),
                                "bg-amber-500/5 border-amber-500/20",
                                `p-${spacing.md}`,
                                "text-center",
                            )}
                        >
                            <AlertTriangle
                                size={48}
                                className={cn(textColors.warning, "mx-auto mb-3")}
                            />
                            <h3 className={cn(typography.h4, textColors.primary, "mb-2")}>
                                Достигнут максимум каналов
                            </h3>
                            <p className={cn(createTextStyle("small", "muted"))}>
                                В наборе уже находится {existingChannels.length} каналов из{" "}
                                {MAX_CHANNELS_PER_SET} возможных. Удалите некоторые каналы,
                                чтобы добавить новые.
                            </p>
                        </div>
                    </div>

                    {/* Фиксированный футер */}
                    <DialogFooter className={"p-6 pt-4 flex-shrink-0"}>
                        <Button
                            onClick={() => onOpenChange(false)}
                            className={createButtonStyle("primary")}
                        >
                            Понятно
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    createCardStyle(),
                    "sm:max-w-3xl max-h-[80vh] flex flex-col p-0",
                )}
            >
                {/* Фиксированный заголовок */}
                <DialogHeader className={"p-6 pb-0 flex-shrink-0"}>
                    <DialogTitle className={typography.h3}>
                        Добавление каналов
                    </DialogTitle>
                    <DialogDescription className={textColors.secondary}>
                        Добавьте каналы в набор (осталось мест: {remainingSlots}/
                        {MAX_CHANNELS_PER_SET})
                    </DialogDescription>
                </DialogHeader>

                {/* Контент с правильным скроллом */}
                <div className="flex-1 overflow-auto px-6 pt-4">
                    <div className={cn("flex flex-col", `gap-${spacing.lg}`)}>
                        {/* Поле ввода */}
                        <div className={`space-y-${spacing.sm}`}>
                            <Label
                                htmlFor="channels-input"
                                className={cn(typography.small, textColors.secondary)}
                            >
                                Список каналов
                            </Label>
                            <Textarea
                                id="channels-input"
                                placeholder={`Введите каналы в любом формате (максимум ${remainingSlots}):

@username
https://t.me/channel
channel_name

Разделяйте каналы новыми строками или запятыми`}
                                value={bulkInput}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className={cn(
                                    components.input.base,
                                    "min-h-[120px] resize-none",
                                )}
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

                        {/* Информация о лимитах */}
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
                                    <div className="font-medium mb-1">Ограничения:</div>
                                    <ul className="space-y-1 text-gray-400">
                                        <li>• Максимум {MAX_CHANNELS_PER_SET} каналов в наборе</li>
                                        <li>• Можно добавить еще {remainingSlots} каналов</li>
                                        <li>• @username или username</li>
                                        <li>• https://t.me/username или t.me/username</li>
                                        <li>
                                            • Разделение новыми строками, запятыми или точками с
                                            запятой
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

                        {/* Предупреждение о превышении лимита */}
                        {exceededChannels.length > 0 && (
                            <div
                                className={cn(
                                    createCardStyle(),
                                    "bg-amber-500/5 border-amber-500/20",
                                    `p-${spacing.md}`,
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangle
                                        size={16}
                                        className={cn(textColors.warning, "mt-0.5 flex-shrink-0")}
                                    />
                                    <div className={createTextStyle("small", "warning")}>
                                        <div className="font-medium mb-1">Превышен лимит!</div>
                                        <p className="text-amber-400">
                                            {exceededChannels.length} каналов будет пропущено из-за
                                            ограничения в {MAX_CHANNELS_PER_SET} каналов на набор.
                                            Будут добавлены только первые {remainingSlots} каналов.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Предпросмотр каналов */}
                        {limitedChannels.length > 0 && (
                            <div className={`space-y-${spacing.sm}`}>
                                <div className="flex items-center justify-between">
                                    <h3 className={cn(typography.h4, textColors.primary)}>
                                        Предпросмотр ({limitedChannels.length}/{remainingSlots})
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
                                        {exceededChannels.length > 0 && (
                                            <span className="text-red-400 text-sm">
                                                🚫 {exceededChannels.length} превышено
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        createCardStyle(),
                                        "bg-slate-900/30",
                                        "max-h-48",
                                    )}
                                >
                                    <ScrollArea className="h-full max-h-48">
                                        <div className={`p-${spacing.sm} space-y-2`}>
                                            {limitedChannels.map((channel) => (
                                                <ChannelPreviewItem
                                                    key={channel.id}
                                                    channel={channel}
                                                />
                                            ))}
                                            {exceededChannels.length > 0 && (
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center",
                                                        `p-${spacing.sm}`,
                                                        "rounded-md",
                                                        "bg-red-500/10 border border-red-500/20",
                                                        "text-red-400 text-sm",
                                                    )}
                                                >
                                                    + {exceededChannels.length} каналов превышает лимит и
                                                    будет пропущено
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        )}

                        {/* Пустое состояние когда нет каналов */}
                        {bulkInput.trim() && limitedChannels.length === 0 && (
                            <div className={cn("text-center", `py-${spacing.xl}`)}>
                                <AlertCircle
                                    className={cn("mx-auto h-12 w-12 mb-3", textColors.muted)}
                                />
                                <h3 className={cn(typography.h4, textColors.primary, "mb-2")}>
                                    Каналы не распознаны
                                </h3>
                                <p className={createTextStyle("small", "muted")}>
                                    Проверьте формат введенных данных
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Фиксированный футер */}
                <DialogFooter className={`p-6 pt-4 flex-shrink-0 gap-${spacing.sm}`}>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className={createButtonStyle("secondary")}
                        disabled={isAdding}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleAddChannels}
                        className={createButtonStyle("primary")}
                        disabled={!isFormValid || isAdding}
                    >
                        {isAdding ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className={`mr-${spacing.sm} animate-spin`}
                                />
                                Добавляем каналы...
                            </>
                        ) : (
                            <>
                                <Plus size={16} className={`mr-${spacing.sm}`} />
                                Добавить {validChannels.length}{" "}
                                {getChannelWord(validChannels.length)}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
