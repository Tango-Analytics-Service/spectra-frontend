// src/components/auth/LoginPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    typography,
    spacing,
    gradients,
    animations,
} from "@/lib/design-system";
import LoginButton from "./LoginButton";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const error = useAuthStore(state => state.error);
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);


    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center min-h-screen text-white",
                `px-${spacing.md}`,
                gradients.background,
                animations.fadeIn,
            )}
        >
            <div
                className={cn(
                    "text-3xl font-semibold mb-2 bg-clip-text text-transparent",
                    gradients.primary.replace("bg-gradient-to-r", "bg-gradient-to-r"),
                )}
            >
                SPECTRA
            </div>
            <p className={cn(typography.body, "text-blue-300 text-center mb-6")}>
                Аналитика и управление телеграм-каналами
            </p>

            {error && (
                <div
                    className={cn(
                        "mb-6 p-3 rounded-md max-w-md text-center",
                        "bg-red-500/20 border border-red-500/40 text-red-300",
                    )}
                >
                    {error}
                </div>
            )}

            <LoginButton />
        </div>
    );
};
