// src/components/layout/MainLayout.tsx
import React, { ReactNode } from "react";
import BottomNavigation from "../navigation/BottomNavigation";
import { useTelegramNavigation } from "../../hooks/useTelegramNavigation";
import PageTransition from "./PageTransition";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
    gradients,
    typography,
    spacing,
    animations,
} from "@/lib/design-system";
import AppHeader from "../common/AppHeader";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { isTelegram } = useAuth();

    useTelegramNavigation();

    return (
        <div
            className={cn(
                "flex flex-col w-full min-h-screen text-white",
                gradients.background,
            )}
        >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                <svg width="100%" height="100%">
                    <defs>
                        <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 40 0 L 0 0 0 40"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* App Header */}
            <AppHeader />

            {/* Основной контент */}
            <div className={cn("flex-1 pb-[70px]", animations.fadeIn)}>
                <PageTransition>{children}</PageTransition>
            </div>

            {/* Нижняя навигация */}
            {isTelegram && <BottomNavigation />}

            {/* Если не в Telegram, можно показать футер или другой элемент */}
            {!isTelegram && (
                <div
                    className={cn(
                        "w-full border-t border-gray-800 text-center text-gray-500",
                        `p-${spacing.md}`,
                        typography.small,
                    )}
                >
          SPECTRA © 2025 - Аналитика и управление телеграм-каналами
                </div>
            )}
        </div>
    );
};

export default MainLayout;
