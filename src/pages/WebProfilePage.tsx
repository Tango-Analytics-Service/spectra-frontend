// src/components/profile/WebProfilePage.tsx
import { cn } from "@/lib/cn";
import { typography, animations } from "@/lib/design-system";
import { Button } from "@/ui/components/button";
import Card from "@/ui/components/card/Card";
import CardContent from "@/ui/components/card/CardContent";
import CardHeader from "@/ui/components/card/CardHeader";
import CardTitle from "@/ui/components/card/CardTitle";
import { User, Settings, LogOut, Bell, Shield, CreditCard } from "lucide-react";
import ProfileNavButton from "./ProfileNavButton";
import { useAuthStore } from "@/auth/stores/useAuthStore";

export default function WebProfilePage() {
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    return (
        <div className={cn("container mx-auto", animations.fadeIn)}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className={typography.h1}>Профиль</h1>
                    <p className={cn(typography.small, "text-gray-300 mt-1")}>
                        Управление вашим аккаунтом и настройками
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20 sticky top-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                {user?.photo_url ? (
                                    <img
                                        src={user.photo_url}
                                        alt={user.first_name}
                                        className="w-24 h-24 rounded-full mb-4"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-[#4395d3]/20 flex items-center justify-center text-2xl font-semibold mb-4">
                                        {user?.first_name?.charAt(0)}
                                    </div>
                                )}
                                <h2 className={cn(typography.h3, typography.weight.medium)}>
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                {user?.username && (
                                    <p className={cn(typography.body, "text-[#4395d3]")}>
                                        @{user.username}
                                    </p>
                                )}
                                {user?.is_premium && (
                                    <span className="inline-block mt-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                                        Premium
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <ProfileNavButton
                                    icon={<User size={18} />}
                                    label="Основная информация"
                                    active
                                />
                                <ProfileNavButton
                                    icon={<Bell size={18} />}
                                    label="Уведомления"
                                />
                                <ProfileNavButton
                                    icon={<Shield size={18} />}
                                    label="Безопасность"
                                />
                                <ProfileNavButton
                                    icon={<CreditCard size={18} />}
                                    label="Платежи"
                                />
                                <ProfileNavButton
                                    icon={<Settings size={18} />}
                                    label="Настройки"
                                />
                            </div>

                            <div className="mt-6 pt-6 border-t border-blue-900/30">
                                <Button
                                    variant="outline"
                                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                    onClick={logout}
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Выйти из аккаунта
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main content */}
                <div className="lg:col-span-3">
                    <Card className="bg-[#0a2a5e]/50 border-[#4395d3]/20">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5 text-[#4395d3]" />
                                Основная информация
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm text-gray-400 block mb-1">
                                            Имя
                                        </div>
                                        <div className="p-3 bg-[#041331] border border-blue-900/30 rounded-md">
                                            {user?.first_name || "Не указано"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 block mb-1">
                                            Фамилия
                                        </div>
                                        <div className="p-3 bg-[#041331] border border-blue-900/30 rounded-md">
                                            {user?.last_name || "Не указано"}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400 block mb-1">
                                        Имя пользователя
                                    </div>
                                    <div className="p-3 bg-[#041331] border border-blue-900/30 rounded-md">
                                        @{user?.username || "Не указано"}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400 block mb-1">
                                        Дата регистрации
                                    </div>
                                    <div className="p-3 bg-[#041331] border border-blue-900/30 rounded-md">
                                        {"Не указано"}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-blue-900/30">
                                    <h3 className="text-lg font-medium mb-4">О приложении</h3>
                                    <p className="text-gray-300 mb-2">
                                        SPECTRA beta - Аналитика и управление телеграм-каналами
                                    </p>
                                    <p className="text-gray-400 text-sm">Версия: 1.0.0</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
