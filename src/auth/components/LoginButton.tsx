import { createButtonStyle, spacing } from "@/lib/design-system";
import { cn } from "@/lib/cn";
import { Button } from "@/ui/components/button";
import { isTelegramWebApp } from "@/telegram/utils";
import { useAuth } from "@/auth/api/hooks";

export default function LoginButton() {
    const telegramBotUrl = import.meta.env.VITE_TELEGRAM_BOT_URL;

    const { status, refetch: login } = useAuth();

    const handleLogin = async () => {
        if (status !== "success") {
            await login();
        }
    };

    if (isTelegramWebApp()) {
        return (
            <Button
                onClick={handleLogin}
                disabled={status === "pending"}
                className={cn(
                    createButtonStyle("primary"),
                    "w-full sm:w-auto shadow-md hover:shadow-lg transition-all",
                    `px-${spacing.lg} py-${spacing.sm}`,
                )}
            >
                {status === "pending" ? "Авторизация..." : "Войти через Telegram"}
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
                > Открыть в Telegram </a>
            </div>
        );
    }
};
