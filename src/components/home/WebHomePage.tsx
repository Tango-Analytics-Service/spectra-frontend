// src/components/home/WebHomePage.tsx
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    typography,
    animations,
} from "@/lib/design-system";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, Filter, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function WebHomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className={cn("container mx-auto", animations.fadeIn)}>
            {/* Hero section */}
            <section className="py-12 md:py-20">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Аналитика и управление{" "}
                            <span className="text-[#4395d3]">телеграм-каналами</span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-6">
                            SPECTRA предоставляет мощные инструменты для анализа и управления
                            вашими телеграм-каналами. Получайте ценные инсайты и принимайте
                            обоснованные решения.
                        </p>
                        {!isAuthenticated ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    className="bg-[#4395d3] hover:bg-[#3a80b9] text-white px-8 py-6 text-lg"
                                    onClick={() => { }}
                                >
                                    Начать работу
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-[#4395d3] text-[#4395d3] hover:bg-[#4395d3]/10 px-8 py-6 text-lg"
                                    onClick={() => { }}
                                >
                                    Узнать больше
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    className="bg-[#4395d3] hover:bg-[#3a80b9] text-white px-8 py-6 text-lg"
                                    asChild
                                >
                                    <Link to="/channel-sets">Мои наборы каналов</Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-[#4395d3] text-[#4395d3] hover:bg-[#4395d3]/10 px-8 py-6 text-lg"
                                    asChild
                                >
                                    <Link to="/filters">Настроить фильтры</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="/images/spectra-logo.png"
                            alt="Spectra Analytics"
                            className="w-64 md:w-80 object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Features section */}
            <section className="py-12 md:py-16">
                <h2 className={cn(typography.h2, "text-center mb-12")}>
                    Возможности платформы
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        icon={<Users className="h-10 w-10 text-[#4395d3]" />}
                        title="Управление наборами каналов"
                        description="Создавайте и управляйте группами каналов для удобного анализа и мониторинга"
                    />
                    <FeatureCard
                        icon={<Filter className="h-10 w-10 text-[#4395d3]" />}
                        title="Настраиваемые фильтры"
                        description="Создавайте собственные фильтры для анализа контента по различным параметрам"
                    />
                    <FeatureCard
                        icon={<BarChart2 className="h-10 w-10 text-[#4395d3]" />}
                        title="Детальная аналитика"
                        description="Получайте подробные отчеты о производительности каналов и качестве контента"
                    />
                    <FeatureCard
                        icon={<CreditCard className="h-10 w-10 text-[#4395d3]" />}
                        title="Гибкая система кредитов"
                        description="Прозрачная система оплаты с возможностью выбора подходящих пакетов"
                    />
                </div>
            </section>

            {/* CTA section */}
            <section className="py-12 md:py-16">
                <div className="bg-gradient-to-r from-[#041331] to-[#0a2a5e] rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Готовы начать работу с SPECTRA?
                    </h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        Присоединяйтесь к сотням пользователей, которые уже оптимизировали
                        работу со своими телеграм-каналами
                    </p>
                    <Button
                        className="bg-[#4395d3] hover:bg-[#3a80b9] text-white px-8 py-6 text-lg"
                        onClick={() => { }}
                    >
                        {isAuthenticated ? "Перейти в личный кабинет" : "Создать аккаунт"}
                    </Button>
                </div>
            </section>
        </div>
    );
}
