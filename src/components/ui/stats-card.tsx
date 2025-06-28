// src/components/ui/stats-card.tsx
import React from "react";
import { cn } from "@/lib/utils";
import {
    createCardStyle,
    createTextStyle,
    typography,
    spacing,
    animations,
} from "@/lib/design-system";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    loading?: boolean;
    className?: string;
}

export default function StatsCard({
    title,
    value,
    icon,
    loading = false,
    className,
}: StatsCardProps) {
    return (
        <div
            className={cn(
                createCardStyle(),
                `p-${spacing.md}`,
                "flex flex-col",
                animations.scaleIn,
                className,
            )}
        >
            {/* Заголовок */}
            <div
                className={cn(
                    createTextStyle("small", "secondary"),
                    `mb-${spacing.sm}`,
                )}
            >
                {title}
            </div>

            {/* Иконка и значение */}
            <div className="flex items-center justify-between">
                <div
                    className={cn(
                        "bg-blue-500/10 rounded-full",
                        `p-${spacing.sm}`,
                        "flex items-center justify-center",
                    )}
                >
                    {icon}
                </div>

                <div className={cn(typography.h2, "font-semibold")}>
                    {loading ? (
                        <div className="animate-pulse bg-slate-700 h-6 w-8 rounded"></div>
                    ) : (
                        value
                    )}
                </div>
            </div>
        </div>
    );
}
