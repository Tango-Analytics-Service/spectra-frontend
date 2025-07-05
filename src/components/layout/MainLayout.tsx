import { ReactNode } from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useTelegramNavigation } from "@/telegram/hooks/useTelegramNavigation";
import { cn } from "@/lib/cn";
import { gradients, typography, spacing, animations } from "@/lib/design-system";
import AppHeader from "@/components/common/AppHeader";
import { useAuthStore } from "@/auth/stores/useAuthStore";
import PageTransition from "./PageTransition";

export interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const isTelegram = useAuthStore(state => state.isTelegram);

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
}
