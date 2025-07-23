import { cn } from "@/lib/cn";
import { createBadgeStyle } from "@/lib/design-system";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { SearchStatus } from "../types";

interface StatusBadgeProps {
    status: SearchStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    switch (status) {
        case "processing":
        case "pending":
            return (
                <span className={cn(createBadgeStyle("primary"), "flex items-center gap-1 text-xs")}>
                    <Loader2 size={12} className="animate-spin" />
                    <span>В процессе</span>
                </span>
            );
        case "completed":
            return (
                <span className={cn(createBadgeStyle("success"), "flex items-center gap-1 text-xs")}>
                    <CheckCircle size={12} />
                    <span>Завершен</span>
                </span>
            );
        case "failed":
            return (
                <span className={cn(createBadgeStyle("error"), "flex items-center gap-1 text-xs")}>
                    <AlertCircle size={12} />
                    <span>Ошибка</span>
                </span>
            );
        default:
            return null;
    }
}