import { spacing, textColors, typography } from "@/lib/design-system";
import { cn } from "@/lib/utils";

interface SelectionCounterProps {
    count: number;
    itemName: string;
    getItemWord: (count: number) => string;
    className?: string;
}

// Компонент для отображения счетчика выбранных элементов
export default function SelectionCounter({
    count,
    itemName,
    getItemWord,
    className,
}: SelectionCounterProps) {
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
