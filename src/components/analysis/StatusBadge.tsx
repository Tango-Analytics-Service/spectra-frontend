import { ReactElement } from "react";
import { CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createBadgeStyle } from "@/lib/design-system";

export interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    let icon: ReactElement;
    let text: string;
    let variant: "success" | "primary" | "error" | "warning" = "warning";

    switch (status) {
        case "completed":
            icon = <CheckCircle size={12} className="mr-1" />;
            text = "Завершен";
            variant = "success";
            break;
        case "processing":
            icon = <RefreshCw size={12} className="mr-1 animate-spin" />;
            text = "Выполняется";
            variant = "primary";
            break;
        case "failed":
            icon = <XCircle size={12} className="mr-1" />;
            text = "Ошибка";
            variant = "error";
            break;
        default:
            icon = <Clock size={12} className="mr-1" />;
            text = "Ожидание";
            variant = "warning";
    }

    return (
        <Badge
            variant="outline"
            className={cn("flex items-center", createBadgeStyle(variant))}
        >
            {icon}
            {text}
        </Badge>
    );
}
