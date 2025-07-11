import CreditsBalanceCard from "@/credits/components/CreditsBalanceCard";
import CreditsTransactionsList from "@/credits/components/CreditsTransactionsList";
import CreditsPackagesGrid from "@/credits/components/CreditsPackagesGrid";
import CreditsCostsList from "@/credits/components/CreditsCostsList";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useToast } from "@/ui/components/use-toast";
import { gradients, typography, spacing, createCardStyle, animations } from "@/lib/design-system";
import { useFetchCreditBalance, useFetchCreditTransactions, useFetchCreditPackages, useFetchCreditCosts } from "@/credits/api/hooks";

export default function CreditsPage() {
    const { data: balance, status: balanceLoadStatus } = useFetchCreditBalance();
    const { data: transactions, status: transactionsLoadStatus } = useFetchCreditTransactions();
    const { data: packages, status: packagesLoadStatus } = useFetchCreditPackages();
    const { data: costs, status: costsLoadStatus } = useFetchCreditCosts();

    // Toast for notifications
    const { toast } = useToast();

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
                    {balanceLoadStatus === "pending" ? (
                        <div className={cn(createCardStyle(), "p-6 flex justify-center")}>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : balance ? (
                        <CreditsBalanceCard balance={balance} />
                    ) : (
                        <div className={cn(createCardStyle(), "p-6 text-center")}>
                            Не удалось загрузить баланс
                        </div>
                    )}
                </div>

                {/* Credit packages */}
                <div className={`mt-${spacing.lg}`}>
                    {packagesLoadStatus === "pending" ? (
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

                            <CreditsPackagesGrid
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
                    {transactionsLoadStatus === "pending" ? (
                        <div className={cn(createCardStyle(), "p-6 flex justify-center")}>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <CreditsTransactionsList transactions={transactions} />
                    ) : (
                        <div className={cn(createCardStyle(), "p-6 text-center")}>
                            Нет истории транзакций
                        </div>
                    )}

                    {/* Costs */}
                    {costsLoadStatus === "pending" ? (
                        <div className={cn(createCardStyle(), "p-6 flex justify-center")}>
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : costs.length > 0 ? (
                        <CreditsCostsList costs={costs} />
                    ) : (
                        <div className={cn(createCardStyle(), "p-6 text-center")}>
                            Не удалось загрузить стоимость действий
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
