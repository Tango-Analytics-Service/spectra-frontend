// src/contexts/CreditsContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";
import {
    creditService,
    CreditBalance,
    CreditTransaction,
    CreditPackage,
    CreditCost,
    PurchasePackageRequest,
} from "@/services/creditService";
import { toast } from "@/components/ui/use-toast";
import { ActionType } from "@/types/credits";

interface CreditsContextType {
    balance: CreditBalance | null;
    transactions: CreditTransaction[];
    packages: CreditPackage[];
    costs: CreditCost[];
    isBalanceLoading: boolean;
    isTransactionsLoading: boolean;
    isPackagesLoading: boolean;
    isCostsLoading: boolean;
    // Methods for managing credits
    fetchBalance: (forceRefresh?: boolean) => Promise<void>;
    fetchTransactions: (
        limit?: number,
        offset?: number,
        startDate?: string,
        endDate?: string,
        actionTypes?: string[],
        forceRefresh?: boolean,
    ) => Promise<void>;
    fetchPackages: (forceRefresh?: boolean) => Promise<void>;
    fetchCosts: (forceRefresh?: boolean) => Promise<void>;
    purchasePackage: (
        packageId: string,
        paymentMethod: string,
        paymentDetails?: unknown,
    ) => Promise<boolean>;
    checkActionAvailability: (
        actionType: ActionType,
        amount?: number,
    ) => Promise<{ canPerform: boolean; message: string }>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // State for data
    const [balance, setBalance] = useState<CreditBalance | null>(null);
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    const [costs, setCosts] = useState<CreditCost[]>([]);

    // Loading states
    const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
    const [isTransactionsLoading, setIsTransactionsLoading] =
        useState<boolean>(false);
    const [isPackagesLoading, setIsPackagesLoading] = useState<boolean>(false);
    const [isCostsLoading, setIsCostsLoading] = useState<boolean>(false);

    // Timestamps for cache control
    const [lastBalanceUpdate, setLastBalanceUpdate] = useState<number>(0);
    const [lastTransactionsUpdate, setLastTransactionsUpdate] =
        useState<number>(0);
    const [lastPackagesUpdate, setLastPackagesUpdate] = useState<number>(0);
    const [lastCostsUpdate, setLastCostsUpdate] = useState<number>(0);

    const fetchBalance = useCallback(
        async (forceRefresh = false) => {
            // If data was fetched less than 1 minute ago and no force refresh is requested, use cached data
            const now = Date.now();
            if (!forceRefresh && balance && now - lastBalanceUpdate < 60000) {
                return;
            }

            setIsBalanceLoading(true);
            try {
                const data = await creditService.getCreditBalance();
                setBalance(data);
                setLastBalanceUpdate(now);
            } catch (error) {
                console.error("Error fetching credit balance:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить баланс кредитов",
                    variant: "destructive",
                });
            } finally {
                setIsBalanceLoading(false);
            }
        },
        [balance, lastBalanceUpdate],
    );

    const fetchTransactions = useCallback(
        async (
            limit = 10,
            offset = 0,
            startDate?: string,
            endDate?: string,
            actionTypes?: string[],
            forceRefresh = false,
        ) => {
            // Check cache for transactions
            const now = Date.now();
            if (
                !forceRefresh &&
                transactions.length > 0 &&
                now - lastTransactionsUpdate < 60000
            ) {
                return;
            }

            setIsTransactionsLoading(true);
            try {
                const data = await creditService.getCreditTransactions(
                    limit,
                    offset,
                    startDate,
                    endDate,
                    actionTypes,
                );
                setTransactions(data.transactions);
                setLastTransactionsUpdate(now);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить историю транзакций",
                    variant: "destructive",
                });
            } finally {
                setIsTransactionsLoading(false);
            }
        },
        [transactions.length, lastTransactionsUpdate],
    );

    const fetchPackages = useCallback(
        async (forceRefresh = false) => {
            // Check cache for packages - here we cache for longer (5 minutes) as packages change less frequently
            const now = Date.now();
            if (
                !forceRefresh &&
                packages.length > 0 &&
                now - lastPackagesUpdate < 300000
            ) {
                return;
            }

            setIsPackagesLoading(true);
            try {
                const data = await creditService.getCreditPackages();
                setPackages(data.packages);
                setLastPackagesUpdate(now);
            } catch (error) {
                console.error("Error fetching credit packages:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить пакеты кредитов",
                    variant: "destructive",
                });
            } finally {
                setIsPackagesLoading(false);
            }
        },
        [packages.length, lastPackagesUpdate],
    );

    const fetchCosts = useCallback(
        async (forceRefresh = false) => {
            // Check cache for costs - cache for even longer (1 hour) as these rarely change
            const now = Date.now();
            if (
                !forceRefresh &&
                costs.length > 0 &&
                now - lastCostsUpdate < 3600000
            ) {
                return;
            }

            setIsCostsLoading(true);
            try {
                const data = await creditService.getCreditCosts();
                setCosts(data.costs);
                setLastCostsUpdate(now);
            } catch (error) {
                console.error("Error fetching credit costs:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить стоимость действий",
                    variant: "destructive",
                });
            } finally {
                setIsCostsLoading(false);
            }
        },
        [costs.length, lastCostsUpdate],
    );

    const purchasePackage = useCallback(
        async (
            packageId: string,
            paymentMethod: string,
            paymentDetails?: unknown,
        ): Promise<boolean> => {
            try {
                const request: PurchasePackageRequest = {
                    payment_method: paymentMethod,
                    payment_details: paymentDetails,
                };

                const result = await creditService.purchaseCreditPackage(
                    packageId,
                    request,
                );

                if (result.success) {
                    // Update balance after successful purchase
                    setBalance((prev) =>
                        prev
                            ? {
                                ...prev,
                                balance: result.new_balance,
                                last_updated: new Date().toISOString(),
                            }
                            : null,
                    );

                    // Also refresh transactions
                    fetchTransactions(10, 0, undefined, undefined, undefined, true);

                    toast({
                        title: "Успешно",
                        description: `Вы купили пакет "${result.package.name}" за ${result.payment.amount} ${result.payment.currency}`,
                    });
                    return true;
                } else {
                    toast({
                        title: "Ошибка",
                        description: result.message,
                        variant: "destructive",
                    });
                    return false;
                }
            } catch (error) {
                console.error("Error purchasing package:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось совершить покупку. Попробуйте позже.",
                    variant: "destructive",
                });
                return false;
            }
        },
        [fetchTransactions],
    );

    const checkActionAvailability = useCallback(
        async (
            actionType: ActionType,
            amount?: number,
        ): Promise<{ canPerform: boolean; message: string }> => {
            try {
                const result = await creditService.checkActionAvailability(
                    actionType,
                    amount,
                );
                return {
                    canPerform: result.can_perform,
                    message: result.message,
                };
            } catch (error) {
                console.error("Error checking action availability:", error);
                return {
                    canPerform: false,
                    message: "Не удалось проверить возможность выполнения действия",
                };
            }
        },
        [],
    );

    const value = {
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
        purchasePackage,
        checkActionAvailability,
    };

    return (
        <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
    );
};

export const useCredits = () => {
    const context = useContext(CreditsContext);
    if (context === undefined) {
        throw new Error("useCredits must be used within a CreditsProvider");
    }
    return context;
};
