import { LoaderCircle } from "lucide-react";
import { spacing, textColors } from "@/lib/design-system";
import { cn } from "@/lib/cn";

export interface LoadingStateProps {
    text?: string;
    className?: string;
}

// Компонент для состояния загрузки с спиннером
export default function LoadingState({
    text = "Загрузка...",
    className,
}: LoadingStateProps) {
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
