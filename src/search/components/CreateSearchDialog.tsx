import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "@/ui/components/dialog";
import DialogContent from "@/ui/components/dialog/DialogContent";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import { Textarea } from "@/ui/components/textarea";
import { Slider } from "@/ui/components/slider";
import { LoaderCircle, Zap, Settings, X, ChevronDown } from "lucide-react";
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

export interface CreateSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Текст, который пользователь ввёл в поле «Найти» на главной странице */
    initialQuery: string;
}

// Доступные категории для выбора
const AVAILABLE_CATEGORIES = [
    { value: "art", label: "Искусство" },
    { value: "blogs", label: "Блоги" },
    { value: "business", label: "Бизнес" },
    { value: "crypto", label: "Криптовалюты" },
    { value: "design", label: "Дизайн" },
    { value: "economics", label: "Экономика" },
    { value: "entertainment", label: "Развлечения" },
    { value: "law", label: "Право" },
    { value: "marketing-all", label: "Маркетинг" },
    { value: "news", label: "Новости" },
    { value: "psychology", label: "Психология" },
    { value: "tech", label: "Технологии" },
    { value: "travel", label: "Путешествия" },
];

export default function CreateSearchDialog({
    open,
    onOpenChange,
    initialQuery,
}: CreateSearchDialogProps) {
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
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
        }
    }, [open]);

    // Закрытие выпадающего списка при клике вне его
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Добавление категории
    const handleAddCategory = (category: string) => {
        if (!categories.includes(category)) {
            setCategories([...categories, category]);
        }
        setIsDropdownOpen(false);
    };

    // Remove tag
    const handleRemoveCategory = (tag: string) => {
        setCategories(categories.filter((c) => c !== tag));
    };

    // Фильтрация доступных категорий (исключаем уже выбранные)
    const availableCategories = AVAILABLE_CATEGORIES.filter(
        category => !categories.includes(category.value)
    );

    const handleCreate = async () => {
        if (!request.trim()) {
            toast({ title: "Ошибка", description: "Запрос не может быть пустым", variant: "destructive" });
            return;
        }
        if (categories.length === 0) {
            toast({ title: "Ошибка", description: "Выберите хотя бы одну категорию для поиска", variant: "destructive" });
            return;
        }
        if (!subscribersCount[0] || !subscribersCount[1]) {
            toast({ title: "Ошибка", description: "Укажите количество подписчиков", variant: "destructive" });
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
                                        max={200}
                                        step={10}
                                    />
                                    <div className={createTextStyle("tiny", "muted")}>
                                        От 10 до 200 каналов
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
                                                thousandSeparator={true}
                                                allowNegative={false}
                                                allowLeadingZeros={false}
                                                decimalScale={0}
                                                // placeholder="100"
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
                                                thousandSeparator={true}
                                                allowNegative={false}
                                                allowLeadingZeros={false}
                                                decimalScale={0}
                                                // placeholder="100000"
                                                customInput={Input}
                                                className={components.input.base}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* категории каналов */}
                                <div className={`space-y-${spacing.sm}`}>
                                    <Label htmlFor="categories">Категории канала:</Label>
                                    
                                    {/* Выбранные категории */}
                                    <div
                                        className={cn(
                                            "flex flex-wrap items-center gap-2 px-3 py-2 rounded border border-blue-500 bg-blue-950/40 min-h-[44px]",
                                            components.input.base
                                        )}
                                    >
                                        {categories.map((tag) => (
                                            <span
                                                key={tag}
                                                className="flex items-center text-white px-2 py-1 rounded-md text-xs font-medium"
                                                style={{ backgroundColor: "#1838D2" }}
                                            >
                                                {AVAILABLE_CATEGORIES.find(c => c.value === tag)?.label || tag}
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
                                        
                                        {/* Кнопка для открытия выпадающего списка */}
                                        {availableCategories.length > 0 && (
                                            <div className="relative" ref={dropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className={cn(
                                                        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border border-blue-400 text-blue-400 hover:bg-blue-950/60 transition-colors",
                                                        isDropdownOpen && "bg-blue-950/60"
                                                    )}
                                                >
                                                    Добавить категорию
                                                    <ChevronDown size={12} className={cn(
                                                        "transition-transform",
                                                        isDropdownOpen && "rotate-180"
                                                    )} />
                                                </button>
                                                
                                                {/* Выпадающий список */}
                                                {isDropdownOpen && (
                                                    <div className="absolute top-full mt-1 left-0 z-50 w-64 max-h-48 overflow-y-auto bg-gray-900 border border-blue-500 rounded-md shadow-lg">
                                                        {availableCategories.map((category) => (
                                                            <button
                                                                key={category.value}
                                                                type="button"
                                                                onClick={() => handleAddCategory(category.value)}
                                                                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-950/60 transition-colors first:rounded-t-md last:rounded-b-md"
                                                            >
                                                                {category.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
