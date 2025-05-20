// src/components/filters/CreateFilterDialog.tsx
import React, { useState } from "react";
import { FilterCreateRequest, useFilters } from "@/contexts/FilterContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";

interface CreateFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFilterDialog: React.FC<CreateFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { createCustomFilter } = useFilters();
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState("");
  const [threshold, setThreshold] = useState(5);
  const [strictness, setStrictness] = useState(0.5);
  const [category, setCategory] = useState("Содержание");

  // Error states
  const [nameError, setNameError] = useState("");
  const [criteriaError, setCriteriaError] = useState("");

  const handleSubmit = async () => {
    // Reset errors
    setNameError("");
    setCriteriaError("");

    // Validate form
    let isValid = true;
    if (!name.trim()) {
      setNameError("Необходимо указать название фильтра");
      isValid = false;
    }
    if (!criteria.trim()) {
      setCriteriaError("Необходимо указать критерии фильтра");
      isValid = false;
    }

    if (!isValid) return;

    setIsCreating(true);
    try {
      const filterData: FilterCreateRequest = {
        name,
        criteria,
        threshold,
        strictness,
        category,
      };

      const newFilter = await createCustomFilter(filterData);
      if (newFilter) {
        onOpenChange(false);
        // Reset form
        setName("");
        setCriteria("");
        setThreshold(5);
        setStrictness(0.5);
        setCategory("Содержание");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border border-blue-500/20 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Создание фильтра</DialogTitle>
          <DialogDescription className="text-blue-300">
            Создайте свой фильтр для анализа каналов по выбранным критериям
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название фильтра</Label>
            <Input
              id="name"
              placeholder="Например: Контент без нецензурной лексики"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              className="bg-slate-900/70 border-blue-500/20"
            />
            {nameError && <p className="text-sm text-red-400">{nameError}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="criteria">Критерии фильтра</Label>
            <Textarea
              id="criteria"
              placeholder="Опишите, каким критериям должен соответствовать канал..."
              value={criteria}
              onChange={(e) => {
                setCriteria(e.target.value);
                setCriteriaError("");
              }}
              className="min-h-[100px] bg-slate-900/70 border-blue-500/20"
            />
            {criteriaError && (
              <p className="text-sm text-red-400">{criteriaError}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Категория</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="category"
                className="bg-slate-900/70 border-blue-500/20"
              >
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-blue-500/20">
                <SelectItem value="Содержание">Содержание</SelectItem>
                <SelectItem value="Качество">Качество</SelectItem>
                <SelectItem value="Безопасность">Безопасность</SelectItem>
                <SelectItem value="Вовлеченность">Вовлеченность</SelectItem>
                <SelectItem value="Рост">Рост</SelectItem>
                <SelectItem value="Другое">Другое</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="threshold">Порог прохождения (1-10)</Label>
              <span className="text-sm text-blue-300">{threshold}</span>
            </div>
            <Slider
              id="threshold"
              min={1}
              max={10}
              step={0.5}
              value={[threshold]}
              onValueChange={(value) => setThreshold(value[0])}
              className="py-2"
            />
            <p className="text-xs text-blue-300">
              Минимальный балл для прохождения фильтра (1 - минимальный, 10 -
              максимальный)
            </p>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="strictness">Строгость проверки (0-1)</Label>
              <span className="text-sm text-blue-300">
                {strictness.toFixed(1)}
              </span>
            </div>
            <Slider
              id="strictness"
              min={0}
              max={1}
              step={0.1}
              value={[strictness]}
              onValueChange={(value) => setStrictness(value[0])}
              className="py-2"
            />
            <p className="text-xs text-blue-300">
              Строгость проверки (0 - более снисходительно, 1 - максимально
              строго)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-blue-500/20 text-blue-300"
            disabled={isCreating}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <LoaderCircle size={16} className="mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              "Создать фильтр"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFilterDialog;
