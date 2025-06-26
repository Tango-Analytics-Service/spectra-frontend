// src/components/ui/dialog-components.tsx
import React from "react";
import { LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    createCardStyle,
    createButtonStyle,
    typography,
    spacing,
    textColors,
    animations,
    createTextStyle,
} from "@/lib/design-system";

// Базовая обертка для всех диалогов
interface DialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export const DialogWrapper: React.FC<DialogWrapperProps> = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    maxWidth = "max-w-lg",
    className,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    createCardStyle(),
                    maxWidth,
                    animations.fadeIn,
                    className
                )}
            >
                <DialogHeader>
                    <DialogTitle className={typography.h3}>{title}</DialogTitle>
                    {description && (
                        <DialogDescription className={textColors.secondary}>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

// Стандартное поле формы с валидацией
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    required = false,
    children,
    className,
}) => {
    return (
        <div className={cn(`space-y-${spacing.sm}`, className)}>
            <Label className={typography.small}>
                {label}
                {required && <span className={textColors.error}>*</span>}
            </Label>
            {children}
            {error && (
                <p className={cn(typography.tiny, textColors.error)}>{error}</p>
            )}
        </div>
    );
};

// Стандартные кнопки действий
interface ActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  confirmIcon?: React.ReactNode;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onCancel,
    onConfirm,
    confirmText = "Подтвердить",
    cancelText = "Отмена",
    confirmDisabled = false,
    isLoading = false,
    loadingText = "Выполнение...",
    confirmIcon,
    className,
}) => {
    return (
        <DialogFooter className={className}>
            <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className={cn(createButtonStyle("secondary"), `mt-${spacing.sm}`)}
            >
                {cancelText}
            </Button>
            <Button
                onClick={onConfirm}
                disabled={confirmDisabled || isLoading}
                className={createButtonStyle("primary")}
            >
                {isLoading ? (
                    <>
                        <LoaderCircle
                            size={16}
                            className={`mr-${spacing.sm} animate-spin`}
                        />
                        {loadingText}
                    </>
                ) : (
                    <>
                        {confirmIcon && (
                            <span className={`mr-${spacing.sm}`}>{confirmIcon}</span>
                        )}
                        {confirmText}
                    </>
                )}
            </Button>
        </DialogFooter>
    );
};

// Компонент для отображения счетчика выбранных элементов
interface SelectionCounterProps {
  count: number;
  itemName: string;
  getItemWord: (count: number) => string;
  className?: string;
}

export const SelectionCounter: React.FC<SelectionCounterProps> = ({
    count,
    itemName,
    getItemWord,
    className,
}) => {
    return (
        <div className={cn(`mt-${spacing.sm}`, typography.small, className)}>
            {itemName}:{" "}
            <span className={cn(textColors.accent, typography.weight.semibold)}>
                {count}
            </span>{" "}
            {getItemWord(count)}
        </div>
    );
};

// Компонент для пустого состояния с иконкой
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className,
}) => {
    return (
        <div
            className={cn(
                "text-center",
                `py-${spacing.xl}`,
                textColors.muted,
                className
            )}
        >
            <div className={cn("flex justify-center", `mb-${spacing.sm}`, textColors.muted)}>
                {icon}
            </div>
            <div className={typography.body}>{title}</div>
            {description && (
                <div className={cn(createTextStyle("small", "muted"), "mb-4")}>
                    {description}
                </div>
            )}
            {action}
        </div>
    );
};

// Компонент для состояния загрузки с спиннером
interface LoadingStateProps {
  text?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    text = "Загрузка...",
    className,
}) => {
    return (
        <div
            className={cn(
                `py-${spacing.xl} flex justify-center items-center`,
                className
            )}
        >
            <LoaderCircle size={24} className="text-blue-400 animate-spin" />
            {text && (
                <span className={cn(`ml-${spacing.sm}`, textColors.muted)}>
                    {text}
                </span>
            )}
        </div>
    );
};