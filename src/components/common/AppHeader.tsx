// src/components/common/AppHeader.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { gradients, spacing, typography } from "@/lib/design-system";

interface AppHeaderProps {
    className?: string;
    showBadge?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
    className, 
    showBadge = true 
}) => {
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
};

export default AppHeader;