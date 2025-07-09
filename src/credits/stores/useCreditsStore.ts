import { toast } from "@/ui/components/use-toast";
import { creditService, PurchasePackageRequest } from "@/credits/service";
import { ActionType, CreditBalance, CreditCost, CreditPackage, CreditTransaction } from "@/credits/types";
import { create } from "zustand";
import { LoadStatus } from "@/lib/types";

const AUTO_REFRESH_TIMEOUT = 60 * 1000;


interface FetchTransactionsRequestOptions {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    actionTypes?: string[];
}

export interface CreditsStore {
    balance: CreditBalance | null;
    transactions: CreditTransaction[];
    packages: CreditPackage[];
    costs: CreditCost[];
    balanceLoadStatus: LoadStatus;
    transactionsLoadStatus: LoadStatus;
    packagesLoadStatus: LoadStatus;
    costsLoadStatus: LoadStatus;
    // Methods for managing credits
    fetchBalance: (force?: boolean) => Promise<void>;
    fetchTransactions: (options?: FetchTransactionsRequestOptions, force?: boolean) => Promise<void>;
    fetchPackages: (force?: boolean) => Promise<void>;
    fetchCosts: (force?: boolean) => Promise<void>;
    purchasePackage: (packageId: string, paymentMethod: string, paymentDetails?: unknown) => Promise<boolean>;
    checkActionAvailability: (actionType: ActionType, amount?: number) => Promise<{ canPerform: boolean; message: string }>;
}

const initialState = {
    balance: null,
    transactions: [],
    packages: [],
    costs: [],
    balanceLoadStatus: "idle" as LoadStatus,
    transactionsLoadStatus: "idle" as LoadStatus,
    packagesLoadStatus: "idle" as LoadStatus,
    costsLoadStatus: "idle" as LoadStatus,
};

export const useCreditsStore = create<CreditsStore>((set, getState) => ({
    ...initialState,

    fetchBalance: async (force = false) => {
        const state = getState();
        if (!force) {
            if (state.balanceLoadStatus !== "idle") {
                return;
            }
        }

        set(state => ({ ...state, balanceLoadStatus: "pending" }));
        try {
            const data = await creditService.getCreditBalance();
            set(state => ({
                ...state,
                balance: data,
                balanceLoadStatus: "success",
            }));
        } catch (error) {
            console.error("Error fetching credit balance:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить баланс кредитов",
                variant: "destructive",
            });
            set(state => ({ ...state, balanceLoadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, balanceLoadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    fetchTransactions: async (options?: FetchTransactionsRequestOptions, force = false) => {
        const state = getState();
        if (!force) {
            if (state.transactionsLoadStatus !== "idle") {
                return;
            }
        }
        options = {
            limit: 10,
            offset: 0,
            startDate: undefined,
            endDate: undefined,
            actionTypes: undefined,
            ...options,
        };

        set(state => ({ ...state, transactionsLoadStatus: "pending" }));
        try {
            const data = await creditService.getCreditTransactions(
                options.limit,
                options.offset,
                options.startDate,
                options.endDate,
                options.actionTypes,
            );
            set(state => ({
                ...state,
                transactions: data.transactions,
                transactionsLoadStatus: "success",
            }));
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить историю транзакций",
                variant: "destructive",
            });
            set(state => ({ ...state, transactionsLoadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, transactionsLoadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    fetchPackages: async (force = false) => {
        const state = getState();
        if (!force) {
            if (state.packagesLoadStatus !== "idle") {
                return;
            }
        }

        set(state => ({ ...state, packagesLoadStatus: "pending" }));
        try {
            const data = await creditService.getCreditPackages();
            set(state => ({
                ...state,
                packages: data.packages,
                packagesLoadStatus: "success",
            }));
        } catch (error) {
            console.error("Error fetching credit packages:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить пакеты кредитов",
                variant: "destructive",
            });
            set(state => ({ ...state, packagesLoadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, packagesLoadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
        }
    },

    fetchCosts: async (force = false) => {
        const state = getState();
        if (!force) {
            if (state.costsLoadStatus !== "idle") {
                return;
            }
        }
        set(state => ({ ...state, costsLoadStatus: "pending" }));
        try {
            const data = await creditService.getCreditCosts();
            set(state => ({
                ...state,
                costs: data.costs,
                costsLoadStatus: "success",
            }));
        } catch (error) {
            console.error("Error fetching credit costs:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить стоимость действий",
                variant: "destructive",
            });
            set(state => ({ ...state, costsLoadStatus: "error" }));
        } finally {
            setTimeout(() => {
                set(state => ({ ...state, costsLoadStatus: "idle" }));
            }, AUTO_REFRESH_TIMEOUT);
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
