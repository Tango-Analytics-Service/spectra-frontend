import { cn } from "@/lib/cn";
import { Dialog } from "@/ui/components/dialog";
import DialogContent from "@/ui/components/dialog/DialogContent";
import DialogDescription from "@/ui/components/dialog/DialogDescription";
import DialogHeader from "@/ui/components/dialog/DialogHeader";
import DialogTitle from "@/ui/components/dialog/DialogTitle";
import { animations, createCardStyle, textColors, typography } from "@/lib/design-system";

export interface DialogWrapperProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    maxWidth?: string;
    className?: string;
}

// Базовая обертка для всех диалогов
export default function DialogWrapper({
    open,
    onOpenChange,
    title,
    description,
    children,
    maxWidth = "max-w-lg",
    className,
}: DialogWrapperProps) {
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
}
