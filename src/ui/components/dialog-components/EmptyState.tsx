import { createTextStyle, spacing, textColors, typography } from "@/lib/design-system";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

// Компонент для пустого состояния с иконкой
export default function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
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
