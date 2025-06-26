import { useAuth } from "@/contexts/AuthContext";
import { createButtonStyle, spacing } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { Button } from "react-day-picker";


export default function LoginButton() {
    const telegramBotUrl = import.meta.env.VITE_TELEGRAM_BOT_URL;

    const { isLoading, login, isTelegram } = useAuth();

    const handleLogin = async () => {
        if (!isLoading) {
            await login();
        }
    };

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
                > Открыть в Telegram </a>
            </div>
        );
    }
};
