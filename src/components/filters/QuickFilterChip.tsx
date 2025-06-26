import { spacing } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export interface QuickFilterChipProps {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}

export default function QuickFilterChip({ label, count, active, onClick }: QuickFilterChipProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-1 text-xs font-medium transition-all duration-200",
                `px-${spacing.sm} py-1`,
                "rounded-full border",
                "whitespace-nowrap touch-manipulation", // для лучшего тача на мобильных
                active
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-slate-800/50 text-gray-400 border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50",
            )}
        >
            {label}
            {count !== undefined && (
                <span
                    className={cn(
                        "text-xs",
                        active ? "text-blue-200" : "text-gray-500",
                    )}
                >
                    {count}
                </span>
            )}
        </button>
    );
}
