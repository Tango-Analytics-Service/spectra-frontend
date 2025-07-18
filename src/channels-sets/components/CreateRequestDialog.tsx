import React, { useEffect, useState } from "react";
import { Dialog } from "@/ui/components/dialog";
import DialogContent from "@/ui/components/dialog/DialogContent";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Textarea } from "@/ui/components/textarea";
import { Slider } from "@/ui/components/slider";
import { LoaderCircle, Zap, Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "@/ui/components/use-toast";
import { useChannelsSetsStore } from "@/channels-sets/stores/useChannelsSetsStore";
import { SmartSetBuildCriteria } from "@/channels-sets/types";
import {
    createCardStyle,
    createButtonStyle,
    createTextStyle,
    typography,
    spacing,
    components,
    textColors,
} from "@/lib/design-system";

export interface CreateRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Текст, который пользователь ввёл в поле «Найти» на главной странице */
    initialQuery: string;
}

export default function CreateRequestDialog({
    open,
    onOpenChange,
    initialQuery,
}: CreateRequestDialogProps) {
    const createChannelsSet = useChannelsSetsStore((s) => s.createChannelsSet);

    // --- form state ---
    const [name, setName] = useState("");
    const [request, setRequest] = useState(initialQuery);
    const [targetCount, setTargetCount] = useState([50]);
    const [isCreating, setIsCreating] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState([1000]); // NEW: default 1000

    // reset form when dialog closes or initialQuery changes
    useEffect(() => {
        if (open) {
            setRequest(initialQuery || "");
            setName("");
            setTargetCount([50]);
        }
    }, [open, initialQuery]);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast({ title: "Ошибка", description: "Название не может быть пустым", variant: "destructive" });
            return;
        }
        setIsCreating(true);
        try {
            const buildCriteria: SmartSetBuildCriteria = {
                filter_ids: [],               // никакие фильтры в этом диалоге не выбираются
                target_count: targetCount[0],
                acceptance_threshold: 0.7,    // фиксированное
                batch_size: 20,               // фиксированное
            };

            const newSet = await createChannelsSet({
                name: name.trim(),
                description: request.trim(),  // сюда попадёт текст из поля «Запрос»
                is_public: false,
                build_criteria: buildCriteria,
            });

            if (newSet) {
                onOpenChange(false);
            }
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    createCardStyle(),
                    // responsive width + height
                    "w-[90%] sm:w-[600px] max-h-[80vh]",
                    // center horizontally and give some top margin
                    "mx-auto mt-16",
                    // layout
                    "flex flex-col p-0",
                )}
            >
                {/* Header */}
                <div className="p-6 pb-0 flex-shrink-0">
                    <h3 className={cn(typography.h3, "flex items-center gap-2")}>
                        <Zap size={20} className={textColors.accent} />
                        Новый запрос
                    </h3>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto px-6 pt-4">
                    <div className={`space-y-${spacing.lg}`}>
                        {/* Основная информация */}
                        <div className={`space-y-${spacing.md}`}>
                            <h4 className={cn(typography.h4, textColors.primary)}>Основная информация</h4>

                            <div className={`space-y-${spacing.sm}`}>
                                <Label htmlFor="name">Название</Label>
                                <Input
                                    id="name"
                                    placeholder="Название"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={components.input.base}
                                />
                            </div>

                            <div className={`space-y-${spacing.sm}`}>
                                <Label htmlFor="request">Запрос</Label>
                                <Textarea
                                    id="request"
                                    placeholder="Запрос"
                                    value={request}
                                    onChange={(e) => setRequest(e.target.value)}
                                    className={cn(components.input.base, "min-h-[60px]")}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Критерии построения */}
                        <div className={`space-y-${spacing.md}`}>
                            <div className="flex items-center gap-2">
                                <Settings size={16} className={textColors.accent} />
                                <h4 className={cn(typography.h4, textColors.primary)}>Настройки</h4>
                            </div>

                            <div className={`space-y-${spacing.md}`}>
                                {/* целевое количество */}
                                <div className={`space-y-${spacing.sm}`}>
                                    <Label>Сколько каналов ищем?: {targetCount[0]}</Label>
                                    <Slider
                                        value={targetCount}
                                        onValueChange={setTargetCount}
                                        min={10}
                                        max={1000}
                                        step={10}
                                    />
                                    <div className={createTextStyle("tiny", "muted")}>
                                        От 10 до 1000 каналов
                                    </div>
                                </div>
                                <div className={`space-y-${spacing.sm}`}>
                                    <Label>Кол-во подписчиков: {subscribersCount[0]}</Label>
                                    <Slider
                                        value={subscribersCount}
                                        onValueChange={setSubscribersCount}
                                        min={100}
                                        max={100000}
                                        step={100}
                                    />
                                    <div className={createTextStyle("tiny", "muted")}>
                                        От 100 до 100&nbsp;000 подписчиков
                                    </div>
                                </div>
                                {/* категории каналов (мокап) */}
                                {/* <div className={`space-y-${spacing.sm}`}>
                                    <Label htmlFor="categories">Категории канала:</Label>
                                    <Input
                                        id="categories"
                                        placeholder="#тег1 #тег2 #тег3"
                                        value=""           // пока просто мокап, без логики
                                        onChange={() => {}}
                                        className={components.input.base}
                                    />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`flex flex-col-reverse pt-4 pb-6 flex-shrink-0 gap-${spacing.sm}`}>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className={createButtonStyle("secondary")}
                        disabled={isCreating}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleCreate}
                        className={createButtonStyle("primary")}
                        disabled={isCreating || !name.trim()}
                    >
                        {isCreating ? (
                            <>
                                <LoaderCircle size={16} className="mr-2 animate-spin" />
                                Запуск…
                            </>
                        ) : (
                            <>
                                <Zap size={16} className="mr-2" />
                                Запустить поиск
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
