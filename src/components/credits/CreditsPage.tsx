// src/components/credits/CreditsPage.tsx
import React, { useEffect } from "react";
import CreditBalanceCard from "./CreditBalanceCard";
import CreditTransactionsList from "./CreditTransactionsList";
import CreditPackagesGrid from "./CreditPackagesGrid";
import CreditCostsList from "./CreditCostsList";
import { Loader2, AlertCircle } from "lucide-react";
import { useCredits } from "@/contexts/CreditsContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
    gradients,
    typography,
    spacing,
    createCardStyle,
    animations,
} from "@/lib/design-system";

const CreditsPage = () => {
    // Get data and methods from context
    const {
        balance,
        transactions,
        packages,
        costs,
        isBalanceLoading,
        isTransactionsLoading,
        isPackagesLoading,
        isCostsLoading,
        fetchBalance,
        fetchTransactions,
        fetchPackages,
        fetchCosts,
    } = useCredits();

    // Toast for notifications
    const { toast } = useToast();

    // Load all data on component mount
    useEffect(() => {
        fetchBalance();
        fetchTransactions();
        fetchPackages();
        fetchCosts();
    }, [fetchBalance, fetchTransactions, fetchPackages, fetchCosts]);

    const handlePurchaseClick = (packageId: string) => {
        const pkg = packages.find((p) => p.id === packageId);
        if (pkg) {
            // Показываем заглушку вместо открытия модального окна
            toast({
                title: "Функция в разработке",
                description: `Покупка пакета "${pkg.name}" временно недоступна. Мы работаем над внедрением платежной системы.`,
                variant: "default",
            });
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col min-h-screen text-white",
                gradients.background,
            )}
        >
            {/* Main content */}
            <main
                className={cn(
                    "flex-1 overflow-hidden flex flex-col",
                    `px-${spacing.md} sm:px-${spacing.lg}`,
                    `pb-${spacing.md} sm:pb-${spacing.lg}`,
                )}
            >
                {/* Title */}
                <div className={`mt-${spacing.sm} sm:mt-${spacing.md}`}>
                    <h1 className={cn(typography.h1, "text-white")}>
                        Управление кредитами
                    </h1>
                    <p className={cn(typography.small, "text-blue-300 mt-1")}>
                        Просматривайте баланс, пополняйте кредиты и следите за расходами
                    </p>
                </div>

                {/* Credit balance */}
                <div className={`mt-${spacing.md}`}>
                    {isBalanceLoading ? (
                        <div className={cn(createCardStyle(), "p-6 flex justify-center")}>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : balance ? (
                        <CreditBalanceCard balance={balance} />
                    ) : (
                        <div className={cn(createCardStyle(), "p-6 text-center")}>
                            Не удалось загрузить баланс
                        </div>
                    )}
                </div>

                {/* Credit packages */}
                <div className={`mt-${spacing.lg}`}>
                    {isPackagesLoading ? (
                        <div className={cn(createCardStyle(), "p-6 flex justify-center")}>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : packages.length > 0 ? (
                        <>
                            {/* Уведомление о том, что функция в разработке */}
                            <div className={cn(
                                createCardStyle(),
                                "p-4 mb-4 bg-amber-500/10 border-amber-500/20"
                            )}>
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                                    <div>
                                        <div className="text-amber-400 font-medium text-sm">
                                            Платежная система в разработке
                                        </div>
                                        <div className="text-amber-300/80 text-xs mt-1">
                                            Функция покупки кредитов временно недоступна. Мы активно работаем над интеграцией платежных систем.
                                        </div>
                                    </div>
                                </div>
                            </div>
              
                            <CreditPackagesGrid
                                packages={packages}
                                onPurchase={handlePurchaseClick}
                            />
                        </>
                    ) : (
                        <div className={cn(createCardStyle(), "p-6 text-center")}>
                            Нет доступных пакетов кредитов
                        </div>
                    )}
                </div>

                {/* Two columns layout on larger screens */}
                <div
                    className={cn(
                        "grid grid-cols-1 lg:grid-cols-2",
                        `mt-${spacing.lg} gap-${spacing.lg}`,
                        animations.slideIn,
                    )}
                >
                    {/* Transactions */}
                    {isTransactionsLoading ? (
                        <div className={cn(createCardStyle(), "p-6 flex justify-center")}>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <CreditTransactionsList transactions={transactions} />
                    ) : (
                        <div className={cn(createCardStyle(), "p-6 text-center")}>
                            Нет истории транзакций
                        </div>
                    )}

                    {/* Costs */}
                    {isCostsLoading ? (
                        <div className={cn(createCardStyle(), "p-6 flex justify-center")}>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : costs.length > 0 ? (
                        <CreditCostsList costs={costs} />
                    ) : (
                        <div className={cn(createCardStyle(), "p-6 text-center")}>
                            Не удалось загрузить стоимость действий
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CreditsPage;