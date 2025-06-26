// src/components/profile/ProfilePage.tsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    components,
    typography,
    createCardStyle,
    animations,
} from "@/lib/design-system";

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className={cn("px-4 sm:px-6", "pt-4 pb-4", animations.fadeIn)}>
            <h1 className={cn(typography.h1, "text-white mb-4")}>Профиль</h1>

            {user && (
                <div className={cn(createCardStyle(), "p-4 mb-6", animations.scaleIn)}>
                    <div className={cn("flex items-center", "mb-4")}>
                        {user.photo_url ? (
                            <img
                                src={user.photo_url}
                                alt={user.first_name}
                                className={cn("w-16 h-16", "rounded-full mr-4")}
                            />
                        ) : (
                            <div
                                className={cn(
                                    "w-16 h-16 flex items-center justify-center text-xl font-semibold",
                                    "rounded-full mr-4",
                                    "bg-blue-500/20",
                                )}
                            >
                                {user.first_name.charAt(0)}
                            </div>
                        )}

                        <div>
                            <h2 className={cn(typography.h3, typography.weight.medium)}>
                                {user.first_name} {user.last_name}
                            </h2>
                            {user.username && (
                                <p className={cn(typography.body, "text-blue-300")}>
                  @{user.username}
                                </p>
                            )}
                            {user.is_premium && (
                                <span className="inline-block mt-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                  Premium
                                </span>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className={cn(components.button.danger, "w-full")}
                        onClick={logout}
                    >
            Выйти из аккаунта
                    </Button>
                </div>
            )}

            <div className={cn("space-y-4", animations.slideIn)}>
                <div className={cn(createCardStyle(), "p-4")}>
                    <h3
                        className={cn(
                            typography.small,
                            typography.weight.medium,
                            "text-blue-300 mb-2",
                        )}
                    >
            Настройки приложения
                    </h3>
                    <p className={cn(typography.small, "text-slate-400")}>
            Настройки приложения будут доступны в ближайшее время
                    </p>
                </div>

                <div className={cn(createCardStyle(), "p-4")}>
                    <h3
                        className={cn(
                            typography.small,
                            typography.weight.medium,
                            "text-blue-300 mb-2",
                        )}
                    >
            О приложении
                    </h3>
                    <p className={cn(typography.small, "text-slate-400")}>
            SPECTRA beta - Аналитика и управление телеграм-каналами
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
