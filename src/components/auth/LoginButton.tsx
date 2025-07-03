import { createButtonStyle, spacing } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "react-day-picker";


export default function LoginButton() {
    const telegramBotUrl = import.meta.env.VITE_TELEGRAM_BOT_URL;

    const isLoaded = useAuthStore(state => state.isLoaded);
    const login = useAuthStore(state => state.login);
    const isTelegram = useAuthStore(state => state.isTelegram);

    const handleLogin = async () => {
        if (isLoaded) {
            await login();
        }
    };

    if (isTelegram) {
        return (
            <Button
                onClick={handleLogin}
                disabled={!isLoaded}
                className={cn(
                    createButtonStyle("primary"),
                    "w-full sm:w-auto shadow-md hover:shadow-lg transition-all",
                    `px-${spacing.lg} py-${spacing.sm}`,
                )}
            >
                {isLoaded ? "Авторизация..." : "Войти через Telegram"}
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
