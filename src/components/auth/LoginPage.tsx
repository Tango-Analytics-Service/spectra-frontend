// src/components/auth/LoginPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    typography,
    spacing,
    gradients,
    createButtonStyle,
    animations,
} from "@/lib/design-system";

const LoginPage: React.FC = () => {
    const { isAuthenticated, login, isLoading, error, isTelegram } = useAuth();
    const navigate = useNavigate();

    const telegramBotUrl =
    import.meta.env.VITE_TELEGRAM_BOT_URL;

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        if (!isLoading) {
            await login();
        }
    };

    const renderLoginButton = () => {
        if (isTelegram) {
            return (
                <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={cn(
                        createButtonStyle("primary"),
                        "w-full sm:w-auto shadow-md hover:shadow-lg transition-all",
                        `px-${spacing.lg} py-${spacing.sm}`,
                    )}
                >
                    {isLoading ? "Авторизация..." : "Войти через Telegram"}
                </Button>
            );
        } else {
            return (
                <div className="text-center">
                    <p className="mb-4 text-red-400">
                        Приложение должно быть открыто через Telegram
                    </p>
                    <a
                        href={telegramBotUrl}
                        className={cn(
                            "inline-block rounded-md font-medium transition-colors",
                            createButtonStyle("primary"),
                            `px-${spacing.lg} py-${spacing.sm}`,
                        )}
                    >
                        Открыть в Telegram
                    </a>
                </div>
            );
        }
    };

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

            {renderLoginButton()}
        </div>
    );
};

export default LoginPage;
