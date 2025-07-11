import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    checkActionAvailability,
    getCreditBalance,
    getCreditCosts,
    getCreditPackages,
    getCreditTransactions,
    purchaseCreditPackage,
} from "@/credits/api/services";
import {
    CheckActionResponse,
    CreditTransactionsRequest,
    PurchasePackageRequest,
} from "@/credits/api/types";
import { ActionType, CreditBalance, CreditCost, CreditPackage, CreditTransaction } from "@/credits/types";

export function useFetchCreditBalance() {
    return useQuery({
        queryKey: ["credits", "balance"],
        queryFn() { return getCreditBalance(); },
        staleTime: Infinity,
    });
}

export function useFetchCreditTransactions(req?: CreditTransactionsRequest) {
    return useQuery<CreditTransaction[]>({
        queryKey: ["credits", "transactions", { req }],
        async queryFn() {
            const resp = await getCreditTransactions(req);
            return resp.transactions;
        },
        staleTime: Infinity,
    });
}

export function useFetchCreditPackages() {
    return useQuery<CreditPackage[]>({
        queryKey: ["credits", "packages"],
        async queryFn() {
            const resp = await getCreditPackages();
            return resp.packages;
        },
        staleTime: Infinity,
    });
}

export function useFetchCreditCosts() {
    return useQuery<CreditCost[]>({
        queryKey: ["credits", "costs"],
        async queryFn() {
            const resp = await getCreditCosts();
            return resp.costs;
        },
        staleTime: Infinity,
    });
}

export function usePurchaseCreditPackage(id: string) {
    const queryClient = useQueryClient();
    const balanceCacheKeys = ["credits", "balance"];
    return useMutation({
        mutationFn(req: PurchasePackageRequest) { return purchaseCreditPackage(id, req); },
        onSuccess(data, _req) {
            queryClient.setQueryData<CreditBalance>(balanceCacheKeys, oldBalance => ({
                ...oldBalance,
                balance: data.new_balance,
                last_updated: new Date().toISOString(),
            }));
        },
    });
}

export function useCheckActionAvailability(actionType: ActionType, amount = 1) {
    const queryClient = useQueryClient();
    const balanceCacheKeys = ["credits", "balance"];
    const costsCacheKeys = ["credits", "costs"];
    return useQuery({
        queryKey: ["credits", "action-availability", actionType, amount],
        queryFn() { return checkActionAvailability(actionType, amount); },
        initialData() {
            const balance = queryClient.getQueryData<CreditBalance>(balanceCacheKeys);
            const costs = queryClient.getQueryData<CreditCost[]>(costsCacheKeys);
            const cost = costs.find(c => c.action_type === actionType)?.cost;
            const isValid = cost !== undefined;
            return {
                can_perform: isValid ? balance.balance >= cost * amount : false,
                message: undefined,
                required: isValid ? cost * amount : 0,
                available: isValid ? balance.balance / (cost * amount) : 0,
            } satisfies CheckActionResponse;
        },
        initialDataUpdatedAt() {
            return Math.min(queryClient.getQueryState(balanceCacheKeys)?.dataUpdatedAt,
                queryClient.getQueryState(costsCacheKeys)?.dataUpdatedAt);
        },
        subscribed: false,
    });
}
