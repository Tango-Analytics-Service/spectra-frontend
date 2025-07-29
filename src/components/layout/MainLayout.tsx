import { ReactNode, useState, useEffect } from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useTelegramNavigation } from "@/telegram/hooks/useTelegramNavigation";
import { cn } from "@/lib/cn";
import {
    gradients,
    typography,
    spacing,
    animations,
} from "@/lib/design-system";
import AppHeader from "@/components/common/AppHeader";
import PageTransition from "./PageTransition";
import { isTelegramWebApp } from "@/telegram/utils";
import Onboarding from "@/components/onboarding/Onboarding";

export interface MainLayoutProps {
    children: ReactNode;
    hideHeader?: boolean; // Optional prop to hide the header
}

export default function MainLayout({ children, hideHeader }: MainLayoutProps) {
    useTelegramNavigation();
    const [onboardingState, setOnboardingState] = useState<
    "loading" | "hidden" | "first_view" | "second_view"
    >("loading");

    useEffect(() => {
        const viewCount = localStorage.getItem("onboardingViewCount");
        if (viewCount === null) {
            setOnboardingState("first_view");
        } else if (viewCount === "1") {
            setOnboardingState("second_view");
        } else {
            setOnboardingState("hidden");
        }
    }, []);

    const handleOnboardingComplete = () => {
        const viewCount = localStorage.getItem("onboardingViewCount");
        if (viewCount === "1") {
            localStorage.setItem("onboardingViewCount", "2");
        } else {
            localStorage.setItem("onboardingViewCount", "1");
        }
        setOnboardingState("hidden");
    };

    const handleOnboardingSkip = () => {
        localStorage.setItem("onboardingViewCount", "2");
        setOnboardingState("hidden");
    };

    return (
        <div
            className={cn(
                "flex flex-col w-full min-h-screen text-white",
                gradients.background,
            )}
        >
            {onboardingState !== "loading" && onboardingState !== "hidden" && (
                <Onboarding
                    onComplete={handleOnboardingComplete}
                    onSkip={handleOnboardingSkip}
                    showSkipButton={onboardingState === "second_view"}
                />
            )}
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
            {!hideHeader && <AppHeader />}

            {/* Основной контент */}
            <div className={cn("flex-1 pb-[70px]", animations.fadeIn)}>
                <PageTransition>{children}</PageTransition>
            </div>

            {/* Нижняя навигация */}
            {isTelegramWebApp() && <BottomNavigation />}

            {/* Если не в Telegram, можно показать футер или другой элемент */}
            {!isTelegramWebApp() && (
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
