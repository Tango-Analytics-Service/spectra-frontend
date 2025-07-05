// src/components/filters/CreateFilterDialog.tsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/ui/components/input";
import { Textarea } from "@/ui/components/textarea";
import { Select, SelectValue } from "@/ui/components/select";
import SelectContent from "@/ui/components/select/SelectContent";
import SelectItem from "@/ui/components/select/SelectItem";
import SelectTrigger from "@/ui/components/select/SelectTrigger";
import { cn } from "@/lib/cn";
import { spacing, components } from "@/lib/design-system";
import DialogWrapper from "@/ui/components/dialog-components/DialogWrapper";
import FormField from "@/ui/components/dialog-components/FormFiels";
import ActionButtons from "@/ui/components/dialog-components/ActionButtons";
import { useFiltersStore } from "@/filters/stores/useFiltersStore";
import { FilterCreateRequest } from "../types";

export interface CreateFilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Доступные категории фильтров
const FILTER_CATEGORIES = [
    { value: "Содержание", label: "Содержание" },
    { value: "Качество", label: "Качество" },
    { value: "Безопасность", label: "Безопасность" },
    { value: "Вовлеченность", label: "Вовлеченность" },
    { value: "Рост", label: "Рост" },
    { value: "Другое", label: "Другое" },
];

export default function CreateFilterDialog({ open, onOpenChange, }: CreateFilterDialogProps) {
    const createCustomFilter = useFiltersStore(state => state.createCustomFilter);

    // Состояние формы
    const [formData, setFormData] = useState<FilterCreateRequest>({
        name: "",
        criteria: "",
        threshold: 5,
        strictness: 0.5,
        category: "Содержание",
    });

    // Состояния валидации
    const [errors, setErrors] = useState<{
        name?: string;
        criteria?: string;
    }>({});

    // Состояние загрузки
    const [isCreating, setIsCreating] = useState(false);

    // Сброс формы при закрытии диалога
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setFormData({
                    name: "",
                    criteria: "",
                    threshold: 5,
                    strictness: 0.5,
                    category: "Содержание",
                });
                setErrors({});
            }, 300);
        }
    }, [open]);

    // Обработчики изменения полей
    const handleFieldChange = (
        field: keyof FilterCreateRequest,
        value: string | number
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Сброс ошибки при изменении поля
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    // Валидация формы
    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Необходимо указать название фильтра";
        }

        if (!formData.criteria.trim()) {
            newErrors.criteria = "Необходимо указать критерии фильтра";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик создания фильтра
    const handleCreateFilter = async () => {
        if (!validateForm()) {
            return;
        }

        setIsCreating(true);
        try {
            const newFilter = await createCustomFilter(formData);
            if (newFilter) {
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Error creating filter:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // Проверка валидности формы для блокировки кнопки
    const isFormValid = formData.name.trim() && formData.criteria.trim();

    return (
        <DialogWrapper
            open={open}
            onOpenChange={onOpenChange}
            title="Создание фильтра"
            description="Создайте свой фильтр для анализа каналов по выбранным критериям"
            maxWidth="max-w-2xl"
        >
            <div className={cn("grid", `gap-${spacing.md}`, `py-${spacing.md}`)}>
                {/* Название фильтра */}
                <FormField
                    label="Название фильтра"
                    required
                    error={errors.name}
                >
                    <Input
                        placeholder="Например: Контент без нецензурной лексики"
                        value={formData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className={components.input.base}
                    />
                </FormField>

                {/* Категория */}
                <FormField label="Категория">
                    <Select
                        value={formData.category}
                        onValueChange={(value) => handleFieldChange("category", value)}
                    >
                        <SelectTrigger className={components.input.base}>
                            <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent className={cn("bg-slate-800 border-blue-500/20")}>
                            {FILTER_CATEGORIES.map((category) => (
                                <SelectItem
                                    key={category.value}
                                    value={category.value}
                                    className="hover:bg-blue-500/10 focus:bg-blue-500/10 text-white"
                                >
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                {/* Критерии фильтра */}
                <FormField
                    label="Критерии фильтра"
                    required
                    error={errors.criteria}
                >
                    <Textarea
                        placeholder="Опишите, каким критериям должен соответствовать канал..."
                        value={formData.criteria}
                        onChange={(e) => handleFieldChange("criteria", e.target.value)}
                        className={cn(components.input.base, "min-h-[100px] resize-none")}
                        rows={4}
                    />
                </FormField>

            </div>

            <ActionButtons
                onCancel={() => onOpenChange(false)}
                onConfirm={handleCreateFilter}
                confirmText="Создать фильтр"
                confirmDisabled={!isFormValid}
                isLoading={isCreating}
                loadingText="Создание..."
                confirmIcon={<Plus size={16} />}
            />
        </DialogWrapper>
    );
}
