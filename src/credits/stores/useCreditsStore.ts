import { toast } from "@/ui/components/use-toast";
import { creditService, PurchasePackageRequest } from "@/credits/service";
import { ActionType, CreditBalance, CreditCost, CreditPackage, CreditTransaction } from "@/credits/types";
import { create } from "zustand";

export interface CreditsStore {
    balance: CreditBalance | null;
    transactions: CreditTransaction[];
    packages: CreditPackage[];
    costs: CreditCost[];
    isBalanceLoaded: boolean;
    isTransactionsLoaded: boolean;
    isPackagesLoaded: boolean;
    isCostsLoaded: boolean;
    lastBalanceUpdate: number;
    lastTransactionsUpdate: number;
    lastPackagesUpdate: number;
    lastCostsUpdate: number;
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

const initialState = {
    balance: null,
    transactions: [],
    packages: [],
    costs: [],
    isBalanceLoaded: false,
    isTransactionsLoaded: false,
    isPackagesLoaded: false,
    isCostsLoaded: false,
    lastBalanceUpdate: 0,
    lastTransactionsUpdate: 0,
    lastPackagesUpdate: 0,
    lastCostsUpdate: 0,
};

export const useCreditsStore = create<CreditsStore>((set, getState) => ({
    ...initialState,

    fetchBalance: async (forceRefresh = false) => {
        const state = getState();
        // If data was fetched less than 1 minute ago and no force refresh is requested, use cached data
        const now = Date.now();
        if (!forceRefresh && state.balance && now - state.lastBalanceUpdate < 60000) {
            return;
        }

        try {
            const data = await creditService.getCreditBalance();
            set(state => ({
                ...state,
                balance: data,
                lastBalanceUpdate: now,
            }));
        } catch (error) {
            console.error("Error fetching credit balance:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить баланс кредитов",
                variant: "destructive",
            });
        } finally {
            set(state => ({ ...state, isBalanceLoaded: true }));
        }
    },

    fetchTransactions: async (
        limit = 10,
        offset = 0,
        startDate?: string,
        endDate?: string,
        actionTypes?: string[],
        forceRefresh = false,
    ) => {
        const state = getState();
        // Check cache for transactions
        const now = Date.now();
        if (!forceRefresh && state.transactions.length > 0 && now - state.lastTransactionsUpdate < 60000) {
            return;
        }

        try {
            const data = await creditService.getCreditTransactions(
                limit,
                offset,
                startDate,
                endDate,
                actionTypes,
            );
            set(state => ({
                ...state,
                transactions: data.transactions,
                lastTransactionsUpdate: now,
            }));
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить историю транзакций",
                variant: "destructive",
            });
        } finally {
            set(state => ({ ...state, isTransactionsLoaded: true }));
        }
    },

    fetchPackages: async (forceRefresh = false) => {
        const state = getState();
        // Check cache for packages - here we cache for longer (5 minutes) as packages change less frequently
        const now = Date.now();
        if (!forceRefresh && state.packages.length > 0 && now - state.lastPackagesUpdate < 300000) {
            return;
        }

        try {
            const data = await creditService.getCreditPackages();
            set(state => ({
                ...state,
                packages: data.packages,
                lastPackagesUpdate: now,
            }));
        } catch (error) {
            console.error("Error fetching credit packages:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить пакеты кредитов",
                variant: "destructive",
            });
        } finally {
            set(state => ({ ...state, isPackagesLoaded: true }));
        }
    },

    fetchCosts: async (forceRefresh = false) => {
        const state = getState();
        // Check cache for costs - cache for even longer (1 hour) as these rarely change
        const now = Date.now();
        if (!forceRefresh && state.costs.length > 0 && now - state.lastCostsUpdate < 3600000) {
            return;
        }

        try {
            const data = await creditService.getCreditCosts();
            set(state => ({
                ...state,
                costs: data.costs,
                lastCostsUpdate: now,
            }));
        } catch (error) {
            console.error("Error fetching credit costs:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить стоимость действий",
                variant: "destructive",
            });
        } finally {
            set(state => ({ ...state, isCostsLoaded: true }));
        }
    },

    purchasePackage: async (packageId: string, paymentMethod: string, paymentDetails?: unknown): Promise<boolean> => {
        const state = getState();

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
                set(state => ({
                    ...state,
                    balance: state.balance ? {
                        ...state.balance,
                        balance: result.new_balance,
                        last_updated: new Date().toISOString(),
                    } : null,
                }));

                // Also refresh transactions
                state.fetchTransactions(10, 0, undefined, undefined, undefined, true);

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

    checkActionAvailability: async (actionType: ActionType, amount?: number,): Promise<{ canPerform: boolean; message: string }> => {
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

}));
