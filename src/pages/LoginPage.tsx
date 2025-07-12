import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { typography, spacing, gradients, animations } from "@/lib/design-system";
import LoginButton from "@/auth/components/LoginButton";
import { useAuth } from "@/auth/api/hooks";

export default function LoginPage() {
    const navigate = useNavigate();

    const { data, error } = useAuth();
    const isAuthenticated = data.token !== undefined;

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
                    {error.message}
                </div>
            )}

            <LoginButton />
        </div>
    );
};
