import { DialogFooter, } from "@/components/ui/dialog";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { createButtonStyle, spacing } from "@/lib/design-system";
import { LoaderCircle } from "lucide-react";

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

// Стандартные кнопки действий
export default function ActionButtons({
    onCancel,
    onConfirm,
    confirmText = "Подтвердить",
    cancelText = "Отмена",
    confirmDisabled = false,
    isLoading = false,
    loadingText = "Выполнение...",
    confirmIcon,
    className,
}: ActionButtonsProps) {
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
