import { cn } from "@/lib/cn";
import { createBadgeStyle } from "@/lib/design-system";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { SearchStatus } from "../types";

interface StatusBadgeProps {
    status: SearchStatus;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const baseClasses = "flex items-center gap-1 text-xs whitespace-nowrap";
    
    switch (status) {
        case "pending":
            return (
                <span className={cn(createBadgeStyle("primary"), baseClasses, className)}>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Ожидание</span>
                </span>
            );
        case "processing":
            return (
                <span className={cn(createBadgeStyle("primary"), baseClasses, className)}>
                    <Loader2 size={12} className="animate-spin" />
                    <span>В процессе</span>
                </span>
            );
        case "checking_channels":
            return (
                <span className={cn(createBadgeStyle("primary"), baseClasses, className)}>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Проверка каналов</span>
                </span>
            );
        case "parsing_channels":
            return (
                <span className={cn(createBadgeStyle("primary"), baseClasses, className)}>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Парсинг каналов</span>
                </span>
            );
        case "starting_analysis":
            return (
                <span className={cn(createBadgeStyle("primary"), baseClasses, className)}>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Запуск анализа</span>
                </span>
            );
        case "completed":
            return (
                <span className={cn(createBadgeStyle("success"), baseClasses, className)}>
                    <CheckCircle size={12} />
                    <span>Завершен</span>
                </span>
            );
        case "failed":
            return (
                <span className={cn(createBadgeStyle("error"), baseClasses, className)}>
                    <AlertCircle size={12} />
                    <span>Ошибка</span>
                </span>
            );
        default:
            return null;
    }
}