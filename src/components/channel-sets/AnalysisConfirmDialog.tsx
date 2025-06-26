// src/components/channel-sets/AnalysisConfirmDialog.tsx
import React, { useState } from "react";
import { BarChart3, Clock, Users, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    createCardStyle,
    createButtonStyle,
    createTextStyle,
    typography,
    spacing,
    textColors,
    animations,
} from "@/lib/design-system";
import { ChannelSet } from "@/types/channel-sets";

interface AnalysisConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelSet?: ChannelSet;
  onConfirm: (setId: string) => Promise<void>;
}

const AnalysisConfirmDialog: React.FC<AnalysisConfirmDialogProps> = ({
    open,
    onOpenChange,
    channelSet,
    onConfirm,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        if (!channelSet) return;

        setIsLoading(true);
        try {
            await onConfirm(channelSet.id);
            onOpenChange(false);
        } catch (error) {
            console.error("Error starting analysis:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            onOpenChange(false);
        }
    };

    // Вычисляем примерное время анализа
    const getEstimatedTime = (channelCount: number) => {
        if (channelCount <= 10) return "5-10 минут";
        if (channelCount <= 50) return "15-20 минут";
        return "25-30 минут";
    };

    if (!channelSet) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(createCardStyle(), "max-w-md")}>
                <DialogHeader>
                    <DialogTitle className={cn(typography.h3, "flex items-center gap-2")}>
                        <BarChart3 size={20} className={textColors.accent} />
            Анализ набора
                    </DialogTitle>
                    <DialogDescription className={textColors.muted}>
            Запустить анализ для выбранного набора каналов?
                    </DialogDescription>
                </DialogHeader>

                <div className={cn(`py-${spacing.md}`, animations.fadeIn)}>
                    {/* Информация о наборе */}
                    <div
                        className={cn(
                            "bg-slate-800/30 border border-blue-500/20",
                            `rounded-${spacing.sm} p-${spacing.md} mb-${spacing.md}`
                        )}
                    >
                        <h4 className={cn(typography.h4, textColors.primary, "mb-2")}>
                            {channelSet.name}
                        </h4>

                        <div className={`space-y-${spacing.sm}`}>
                            <div className="flex items-center gap-2">
                                <Users size={14} className={textColors.muted} />
                                <span className={createTextStyle("small", "muted")}>
                                    {channelSet.channel_count} готовых каналов
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock size={14} className={textColors.muted} />
                                <span className={createTextStyle("small", "muted")}>
                  Примерно {getEstimatedTime(channelSet.channel_count)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Предупреждение */}
                    <div
                        className={cn(
                            "bg-amber-500/5 border border-amber-500/20",
                            `rounded-${spacing.sm} p-${spacing.sm}`
                        )}
                    >
                        <p className={cn(createTextStyle("small", "muted"))}>
              Анализ может занять некоторое время. Вы получите уведомление 
              о завершении.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className={createButtonStyle("secondary")}
                    >
            Отмена
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={createButtonStyle("primary")}
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className={`mr-${spacing.sm} animate-spin`}
                                />
                Запуск...
                            </>
                        ) : (
                            "Начать анализ"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AnalysisConfirmDialog;