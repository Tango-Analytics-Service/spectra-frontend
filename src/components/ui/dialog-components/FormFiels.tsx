import { spacing, textColors, typography } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

// Стандартное поле формы с валидацией
export default function FormField({
    label,
    error,
    required = false,
    children,
    className,
}: FormFieldProps) {
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
}
