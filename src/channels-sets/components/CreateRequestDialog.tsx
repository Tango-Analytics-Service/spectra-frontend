import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "@/ui/components/dialog";
import DialogContent from "@/ui/components/dialog/DialogContent";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Textarea } from "@/ui/components/textarea";
import { Slider } from "@/ui/components/slider";
import { LoaderCircle, Zap, Settings, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "@/ui/components/use-toast";
import { useChannelsSetsStore } from "@/channels-sets/stores/useChannelsSetsStore";
import { useFiltersStore } from "@/filters/stores/useFiltersStore";
import { useSearchStore } from "@/search/stores/useSearchStore";
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
import { NumericFormat } from "react-number-format";

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
    // Replace 'createFilter' with the correct method from FiltersStore, e.g., 'addFilter'
    // Use the correct method from FiltersStore: 'createCustomFilter'
    const createFilter = useFiltersStore((s) => s.createCustomFilter);
    const startSearch = useSearchStore(state => state.startSearch);

    // --- form state ---
    const [name, setName] = useState("");
    const [request, setRequest] = useState(() => initialQuery || "");
    const [targetCount, setTargetCount] = useState([10]); // ← дефолт 10 каналов
    const [isCreating, setIsCreating] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState<[number, number]>([100, 100000]); // ← дефолт от 100 до 100000
    const [categoriesInput, setCategoriesInput] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        console.log("initialQuery changed:", initialQuery);
        setRequest(initialQuery || "");

        // Прямое обновление значения DOM-элемента
        if (textareaRef.current) {
            textareaRef.current.value = initialQuery || "";
        }
    }, [initialQuery]);

    // Оставьте существующий эффект для других сбросов
    useEffect(() => {
        if (open) {
            console.log("Dialog opened, setting name and other fields");
            setName("");
            setTargetCount([10]); // ← дефолт 10 каналов при открытии
            setSubscribersCount([100, 100000]); // ← дефолт от 100 до 100000 при открытии
        }
    }, [open]);

    // Add tag on Enter or comma
    const handleCategoriesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
            e.preventDefault();
            const tag = categoriesInput.trim().replace(/^#/, "");
            if (tag && !categories.includes(tag)) {
                setCategories([...categories, tag]);
            }
            setCategoriesInput("");
        }
    };

    // Remove tag
    const handleRemoveCategory = (tag: string) => {
        setCategories(categories.filter((c) => c !== tag));
    };

    const handleCreate = async () => {
        if (!request.trim()) {
            toast({ title: "Ошибка", description: "Запрос не может быть пустым", variant: "destructive" });
            return;
        }
        setIsCreating(true);
        try {
            await startSearch({
                search_query: request.trim(),
                categories: categories,
                channel_limit: targetCount[0],
                min_subscribers: subscribersCount[0],
                max_subscribers: subscribersCount[1],
            });
            onOpenChange(false); // Close dialog on success
        } catch (error) {
            // Error is handled in the store
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
                    "w-[90%] sm:w-[600px] max-h-[100vh]", // увеличил max-h
                    // убрал большой отступ сверху и поставил отступ как по бокам
                    "mx-auto mt-6", // заменил mt-16 на mt-6
                    // layout
                    "flex flex-col p-0",
                )}
            >
                {/* Header - одинаковый padding со всех сторон */}
                <div className="p-4 pb-2 flex-shrink-0"> {/* уменьшили с p-6 на p-4 pb-2 */}
                    <h3 className={cn(typography.h3, "flex items-center gap-2")}>
                        <Zap size={20} className={textColors.accent} />
                        Новый запрос
                    </h3>
                </div>

                {/* Body - уменьшили верхний отступ */}
                <div className="flex-1 overflow-auto px-6 pt-0 pb-4"> {/* изменили py-4 на pt-0 pb-4 */}
                    <div className={`space-y-${spacing.md}`}> {/* уменьшили space-y с lg на md */}
                        {/* Основная информация */}
                        <div className={`space-y-${spacing.md}`}>
                            <div className={`space-y-${spacing.sm}`}>
                                <Label htmlFor="request">Запрос</Label>
                                <Textarea
                                    id="request"
                                    placeholder="Запрос"
                                    ref={textareaRef}
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
                                    <Label>Сколько каналов ищем: {targetCount[0]}</Label>
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
                                    <Label>Кол-во подписчиков:</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className={createTextStyle("tiny", "muted")}>От</div>
                                            <NumericFormat
                                                value={subscribersCount[0]}
                                                onValueChange={(values) => {
                                                    const { value } = values;
                                                    setSubscribersCount([parseInt(value) || 100, subscribersCount[1] || 100000]);
                                                }}
                                                thousandSeparator={false}
                                                allowNegative={false}
                                                allowLeadingZeros={false}
                                                decimalScale={0}
                                                placeholder="100"
                                                customInput={Input}
                                                className={components.input.base}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className={createTextStyle("tiny", "muted")}>До</div>
                                            <NumericFormat
                                                value={subscribersCount[1]}
                                                onValueChange={(values) => {
                                                    const { value } = values;
                                                    setSubscribersCount([subscribersCount[0], parseInt(value) || 100000]);
                                                }}
                                                thousandSeparator={false}
                                                allowNegative={false}
                                                allowLeadingZeros={false}
                                                decimalScale={0}
                                                placeholder="100000"
                                                customInput={Input}
                                                className={components.input.base}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* категории каналов */}
                                <div className={`space-y-${spacing.sm}`}>
                                    <Label htmlFor="categories">Категории канала:</Label>
                                    <div
                                        className={cn(
                                            "flex flex-wrap items-center gap-2 px-2 py-2 rounded border border-blue-500 bg-blue-950/40 focus-within:ring-2 focus-within:ring-blue-500",
                                            components.input.base
                                        )}
                                    >
                                        {categories.map((tag) => (
                                            <span
                                                key={tag}
                                                className="flex items-center text-white px-2 py-1 rounded-full text-xs font-medium"
                                                style={{ backgroundColor: "#1838D2" }}>
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCategory(tag)}
                                                    className="ml-1 text-white/80 hover:text-white"
                                                    aria-label={`Удалить ${tag}`}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            id="categories"
                                            type="text"
                                            placeholder="Введите текст"
                                            value={categoriesInput}
                                            onChange={e => setCategoriesInput(e.target.value)}
                                            onKeyDown={handleCategoriesKeyDown}
                                            className={cn(
                                                "bg-transparent outline-none border-none focus:ring-0",
                                                createTextStyle("body", "muted"), // ← стиль как у 'Запрос'
                                                "min-w-[80px] flex-1"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`px-6 pt-4 pb-6 flex-shrink-0 space-y-${spacing.sm}`}>
                    <Button
                        onClick={handleCreate}
                        className={cn(createButtonStyle("primary"), "w-full")}
                        disabled={isCreating || !request.trim()}
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
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className={cn(createButtonStyle("secondary"), "w-full")}
                        disabled={isCreating}
                    >
                        Отмена
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
