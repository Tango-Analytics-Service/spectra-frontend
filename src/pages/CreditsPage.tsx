import CreditsBalanceCard from "@/credits/components/CreditsBalanceCard";
import CreditsTransactionsList from "@/credits/components/CreditsTransactionsList";
import CreditsPackagesGrid from "@/credits/components/CreditsPackagesGrid";
import CreditsCostsList from "@/credits/components/CreditsCostsList";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useToast } from "@/ui/components/use-toast";
import { gradients, typography, spacing, createCardStyle, animations } from "@/lib/design-system";
import { useCreditsStore } from "@/credits/stores/useCreditsStore";
import { usePaymentsStore } from "@/payments/stores/usePaymentsStore";
import { useEffect } from "react";

export default function CreditsPage() {
    // Get data and methods from context
    const balance = useCreditsStore(state => state.balance);
    const transactions = useCreditsStore(state => state.transactions);
    const packages = useCreditsStore(state => state.packages);
    const costs = useCreditsStore(state => state.costs);
    const balanceLoadStatus = useCreditsStore(state => state.balanceLoadStatus);
    const transactionsLoadStatus = useCreditsStore(state => state.transactionsLoadStatus);
    const packagesLoadStatus = useCreditsStore(state => state.packagesLoadStatus);
    const costsLoadStatus = useCreditsStore(state => state.costsLoadStatus);
    const fetchBalance = useCreditsStore(state => state.fetchBalance);
    const fetchTransactions = useCreditsStore(state => state.fetchTransactions);
    const fetchPackages = useCreditsStore(state => state.fetchPackages);
    const fetchCosts = useCreditsStore(state => state.fetchCosts);

    // Payments store
    const initiatePurchase = usePaymentsStore(state => state.initiatePurchase);
    const paymentLoadStatus = usePaymentsStore(state => state.loadStatus);

    // Toast for notifications
    const { toast } = useToast();

    useEffect(() => {
        fetchBalance(true);
        fetchTransactions(undefined, true);
        fetchPackages(true);
        fetchCosts(true);
    }, [fetchBalance, fetchTransactions, fetchPackages, fetchCosts]);

    const handlePurchaseClick = async (packageId: string) => {
        const pkg = packages.find((p) => p.id === packageId);
        if (!pkg) {
            toast({
                title: "Ошибка",
                description: "Пакет не найден",
                variant: "destructive",
            });
            return;
        }

        // Инициируем покупку через новый store
        await initiatePurchase({
            package_id: packageId,
            payment_methods: ["card", "sbp"], // Можно настроить
            return_url: window.location.origin + "/credits", // Возврат на страницу кредитов
        });
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
                        <CreditsPackagesGrid
                            packages={packages}
                            onPurchase={handlePurchaseClick}
                            isLoading={paymentLoadStatus === "pending"}
                        />
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
