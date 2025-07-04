// src/components/common/AppHeader.tsx
import { Badge } from "@/ui/components/badge";
import { cn } from "@/lib/cn";
import { gradients, spacing, typography } from "@/lib/design-system";

export interface AppHeaderProps {
    className?: string;
    showBadge?: boolean;
}

export default function AppHeader({ className, showBadge = true }: AppHeaderProps) {
    return (
        <header
            className={cn(
                "flex items-center relative z-10",
                `px-${spacing.md} sm:px-${spacing.lg}`,
                `py-${spacing.sm} sm:py-${spacing.md}`,
                className
            )}
        >
            <div className={cn(typography.h2, "tracking-tight")}>
                <span className={cn(gradients.logo, "bg-clip-text text-transparent")}>
                    SPECTRA
                </span>
                {showBadge && (
                    <Badge
                        className="ml-2 bg-gradient-to-r from-[#358ee4] to-[#3b82f6] shadow-[0_0_8px_rgba(53,142,228,0.3)]"
                        variant="default"
                    >
                        BETA
                    </Badge>
                )}
            </div>
        </header>
    );
}
