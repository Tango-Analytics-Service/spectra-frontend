import React from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "md",
    className,
}) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
    };

    return (
        <div
            className={cn("animate-spin text-blue-400", sizeClasses[size], className)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
};

interface LoadingCardProps {
    text?: string;
    className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
    text = "Загрузка...",
    className,
}) => {
    return (
        <Card className={cn("bg-[#0a2a5e]/50 border-[#4395d3]/20", className)}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" className="mb-3" />
                <p className="text-gray-300">{text}</p>
            </CardContent>
        </Card>
    );
};
