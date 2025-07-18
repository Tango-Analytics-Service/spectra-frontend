import { Badge } from "@/ui/components/badge";
import { cn } from "@/lib/cn";
import { gradients, spacing, typography } from "@/lib/design-system";

export interface AppHeaderProps {
    className?: string;
    showBadge?: boolean;
}

export default function CenteredAppHeader({
    className,
    showBadge = true,
}: AppHeaderProps) {
    return (
        <header
            className={cn(
                // center everything horizontally
                "flex justify-center items-center w-full relative z-10",
                // paddings
                `px-${spacing.md} sm:px-${spacing.lg}`,
                `py-${spacing.sm} sm:py-${spacing.md}`,
                className
            )}
        >
            {/* scale up logo+badge */}
            <div className="flex items-center transform scale-150">
                <span
                    className={cn(
                        gradients.logo,
                        "bg-clip-text text-transparent",
                        typography.h2,
                        "tracking-tight"
                    )}
                >
                    SPECTRA
                </span>
                {showBadge && (
                    <Badge
                        className={cn(
                            "ml-2",
                            // same blue gradient + glow as before
                            "bg-gradient-to-r from-[#358ee4] to-[#3b82f6] shadow-[0_0_8px_rgba(53,142,228,0.3)]"
                        )}
                        variant="default"
                    >
                        BETA
                    </Badge>
                )}
            </div>
        </header>
    );
}
