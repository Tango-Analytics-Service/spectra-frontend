// src/components/layout/WebLayout.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { typography, spacing, animations } from "@/lib/design-system";
import WebNavigation from "@/components/navigation/WebNavigation";
import SidebarLink from "./SidebarLink";
import { useAuthStore } from "@/auth/stores/useAuthStore";

export interface WebLayoutProps {
    children: ReactNode;
}

export default function WebLayout({ children }: WebLayoutProps) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return (
        <div className="flex flex-col min-h-screen bg-[#041331] text-white">
            {/* Header */}
            <WebNavigation />

            {/* Main content */}
            <div className={cn("flex flex-1", animations.fadeIn)}>
                {/* Sidebar (only if authenticated) */}
                {isAuthenticated && (
                    <div className="hidden lg:block w-64 border-r border-blue-900/30 p-4">
                        <div className="sticky top-4">
                            <h3 className={cn(typography.h4, "mb-4")}>Навигация</h3>
                            <nav className="space-y-2">
                                <SidebarLink href="/" label="Главная" active={true} />
                                <SidebarLink href="/channel-sets" label="Наборы каналов" />
                                <SidebarLink href="/filters" label="Фильтры" />
                                <SidebarLink href="/credits" label="Кредиты" />
                                <SidebarLink href="/profile" label="Профиль" />
                            </nav>
                        </div>
                    </div>
                )}

                {/* Content area */}
                <main className={cn("flex-1 p-6", `pb-${spacing.xl}`)}>{children}</main>
            </div>

            {/* Footer */}
            <footer className="bg-[#030d20] border-t border-blue-900/30 py-6 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img
                                src="/images/spectra-logo.png"
                                alt="Spectra Logo"
                                className="h-8 mr-3"
                            />
                            <span className={cn(typography.h4, "text-[#4395d3]")}>
                                SPECTRA
                            </span>
                        </div>
                        <div className={cn(typography.small, "text-gray-400")}>
                            © 2025 SPECTRA - Аналитика и управление телеграм-каналами
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
